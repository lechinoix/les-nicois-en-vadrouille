import { z } from 'zod';
import { slugify } from './string';
const url = z
  .string()
  .url()
  .refine((v) => /^https?:\/\//.test(v), 'HTTP(S) URL required');
const format = z
  .object({ url, width: z.number().positive(), height: z.number().positive() })
  .passthrough();
export const pictureSchema = format
  .extend({
    id: z.union([z.string().min(1), z.number()]),
    albumId: z.string(),
    formats: z
      .object({
        thumbnail: format,
        small: format,
        medium: format,
        large: format,
        xlarge: format,
      })
      .passthrough(),
  })
  .passthrough();
export const articleSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .max(160)
      .regex(/^[a-zA-Z0-9_-]+$/),
    title: z.string(),
    content: z.string(),
    date: z
      .string()
      .refine((v) => v === '' || !Number.isNaN(Date.parse(v)), 'Invalid date'),
    cotation: z.string().nullable(),
    elevation: z.number().nullable(),
    orientation: z.string().nullable(),
    participants: z.array(z.string()),
    places: z.array(z.string()),
    sports: z.array(z.string()),
    periods: z.array(z.string()),
    pictures: z.array(pictureSchema),
    cover: pictureSchema.extend({ position: z.string().nullable() }).nullable(),
    topos: z.array(url),
  })
  .passthrough()
  .superRefine((a, ctx) => {
    const ids = a.pictures.map((p) => String(p.id));
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({ code: 'custom', message: 'Duplicate photo IDs' });
    if (a.cover && !ids.includes(String(a.cover.id)))
      ctx.addIssue({ code: 'custom', message: 'Cover missing from pictures' });
  });
export type Article = z.infer<typeof articleSchema>;
export type Picture = z.infer<typeof pictureSchema>;
export type Draft = {
  id: string;
  revision: number;
  data: Article;
  updatedAt: string | Date;
};
export const emptyArticle = (id: string): Article => ({
  id,
  title: '',
  content: '',
  date: '',
  cotation: null,
  elevation: null,
  orientation: null,
  participants: [],
  places: [],
  sports: [],
  periods: [],
  pictures: [],
  cover: null,
  topos: [],
});
export const articlePath = (a: Pick<Article, 'id' | 'title'>) =>
  `/adventures/${a.id}_${slugify(a.title)}`;
export const isCloudinary = (url: string) => {
  try {
    const u = new URL(url);
    return (
      ['https:', 'http:'].includes(u.protocol) &&
      u.hostname === 'res.cloudinary.com' &&
      u.pathname.includes('/image/upload/')
    );
  } catch {
    return false;
  }
};
export class ContentError extends Error {}
export function publishable(a: Article) {
  if (/https?:\/\/[^\s)"<>]*googleusercontent\.com/i.test(a.content))
    throw new ContentError(
      'Importez les images Google intégrées au Markdown avant publication.',
    );
  if (!a.title.trim()) throw new ContentError('Un titre est requis.');
  for (const p of [...a.pictures, ...(a.cover ? [a.cover] : [])]) {
    if (
      ![
        p.url,
        ...(['thumbnail', 'small', 'medium', 'large', 'xlarge'] as const).map(
          (k) => p.formats[k].url,
        ),
      ].every(isCloudinary)
    )
      throw new ContentError(
        'Importez toutes les photos dans Cloudinary avant publication.',
      );
  }
}
export function imageUrl(url: string, width: number) {
  return isCloudinary(url)
    ? url
        .replace(/^http:/, 'https:')
        .replace(
          '/image/upload/',
          `/image/upload/f_auto,q_auto,c_limit,w_${width}/`,
        )
    : url;
}
export const positionCss = (p?: string | null) =>
  ({
    CENTER: 'center',
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right',
    TOP_LEFT: 'left top',
    TOP_RIGHT: 'right top',
    BOTTOM_LEFT: 'left bottom',
    BOTTOM_RIGHT: 'right bottom',
  })[p || 'CENTER'] || 'center';
