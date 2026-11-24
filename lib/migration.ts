import { createHash } from 'node:crypto';
import {
  articleSchema,
  pictureSchema,
  isCloudinary,
  type Article,
  type Picture,
} from './model';
export const sha256 = (s: string | Buffer) =>
  createHash('sha256').update(s).digest('hex');
export function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`)
      .join(',')}}`;
  return JSON.stringify(value);
}
export type PhotoMap = Record<string, Picture>;
export function assemble(
  metadata: unknown,
  content: unknown,
  mapping: PhotoMap = {},
) {
  const issues: string[] = [];
  const articles: Article[] = [];
  const validated: PhotoMap = {};
  for (const [url, value] of Object.entries(mapping)) {
    const parsed = pictureSchema.safeParse(value);
    if (
      !parsed.success ||
      !isCloudinary(parsed.data.url) ||
      !(['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const).every(
        (k) => isCloudinary(parsed.data.formats[k].url),
      )
    ) {
      issues.push(`Invalid Cloudinary mapping for ${url}`);
    } else validated[url] = parsed.data;
  }
  mapping = validated;
  function index(value: unknown, label: string) {
    const map = new Map<string, Record<string, unknown>>();
    if (!Array.isArray(value)) {
      issues.push(`${label}: expected array`);
      return map;
    }
    for (const [i, row] of value.entries()) {
      if (!row || typeof row !== 'object' || typeof row.id !== 'string') {
        issues.push(`${label}[${i}]: missing string ID`);
        continue;
      }
      if (map.has(row.id)) issues.push(`${label}: duplicate ID ${row.id}`);
      map.set(row.id, row);
    }
    return map;
  }
  const data = index(metadata, 'metadata'),
    texts = index(content, 'content');
  const replace = (p: Picture): Picture => {
    const mapped = mapping[p.url];
    if (!mapped) return p;
    const parsed = pictureSchema.parse(mapped);
    return {
      ...p,
      url: parsed.url,
      width: parsed.width,
      height: parsed.height,
      formats: parsed.formats,
    };
  };
  for (const id of new Set([...data.keys(), ...texts.keys()])) {
    if (!data.has(id) || !texts.has(id)) {
      issues.push(
        `${id}: missing ${data.has(id) ? 'content' : 'metadata'} record`,
      );
      continue;
    }
    const left = data.get(id)!,
      right = texts.get(id)!;
    for (const key of Object.keys(left))
      if (
        key !== 'id' &&
        key in right &&
        stable(left[key]) !== stable(right[key])
      )
        issues.push(`${id}: conflicting field ${key} in source documents`);
    const parsed = articleSchema.safeParse({ ...right, ...left });
    if (!parsed.success) {
      issues.push(
        ...parsed.error.issues.map(
          (e) => `${id}.${e.path.join('.')}: ${e.message}`,
        ),
      );
      continue;
    }
    const a = parsed.data;
    try {
      a.pictures = a.pictures.map(replace);
      if (a.cover)
        a.cover = { ...replace(a.cover), position: a.cover.position };
    } catch (e) {
      issues.push(`${id}: invalid photo mapping ${String(e)}`);
      continue;
    }
    for (const p of [...a.pictures, ...(a.cover ? [a.cover] : [])])
      if (
        ![
          p.url,
          ...(['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const).map(
            (k) => p.formats[k].url,
          ),
        ].every(isCloudinary)
      )
        issues.push(`${id}: unresolved photo ${p.id} (${p.url})`);
    // Only explicitly mapped URLs may change; all surrounding Markdown stays byte-for-byte intact.
    a.content = a.content.replace(/https?:\/\/[^\s)\]<>"']+/g, (url) =>
      mapping[url] ? pictureSchema.parse(mapping[url]).url : url,
    );
    if (
      /https?:\/\/[^\s)"<>]*(?:googleusercontent\.com|photos\.google\.com)/i.test(
        a.content,
      )
    )
      issues.push(
        `${id}: Google-hosted URL in Markdown needs explicit preparation`,
      );
    articles.push(a);
  }
  return {
    articles,
    issues,
    counts: {
      metadata: data.size,
      content: texts.size,
      articles: new Set([...data.keys(), ...texts.keys()]).size,
      validArticles: articles.length,
      photos: [...texts.values()].reduce(
        (n, a) => n + (Array.isArray(a.pictures) ? a.pictures.length : 0),
        0,
      ),
    },
  };
}
export function compare(expected: Article[], actual: Article[]) {
  const issues: string[] = [];
  const target = new Map(actual.map((a) => [a.id, a]));
  for (const a of expected) {
    if (!target.has(a.id)) issues.push(`Missing destination ID ${a.id}`);
    else if (stable(a) !== stable(target.get(a.id)))
      issues.push(`Field mismatch ${a.id}`);
  }
  const ids = new Set(expected.map((a) => a.id));
  for (const a of actual)
    if (!ids.has(a.id)) issues.push(`Unexpected destination ID ${a.id}`);
  return issues;
}
