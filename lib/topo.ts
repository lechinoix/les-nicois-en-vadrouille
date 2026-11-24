import { z } from 'zod';
import type { Article } from './model';

export const topoDetailsSchema = z.object({
  cotation: z.string().max(500).nullable(),
  elevation: z.number().finite().nonnegative().nullable(),
  orientation: z.string().max(30).nullable(),
});
export type TopoDetails = z.infer<typeof topoDetailsSchema>;

export function camptocampRouteId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      !['www.camptocamp.org', 'camptocamp.org'].includes(url.hostname) ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    return url.pathname.match(/^\/routes\/([1-9]\d{0,9})(?:\/|$)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

// Apply to the current draft, not the version that started the request.
export function emptyTopoFields(
  article: Article,
  details: TopoDetails,
): Partial<TopoDetails> {
  const patch: Partial<TopoDetails> = {};
  if (!article.cotation?.trim() && details.cotation)
    patch.cotation = details.cotation;
  if (article.elevation === null && details.elevation !== null)
    patch.elevation = details.elevation;
  if (!article.orientation?.trim() && details.orientation)
    patch.orientation = details.orientation;
  return patch;
}
