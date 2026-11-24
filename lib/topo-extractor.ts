import { z } from 'zod';
import { HttpError } from './auth';
import { camptocampRouteId, type TopoDetails } from './topo';

const rating = z.string().trim().max(80).nullish();
const routeSchema = z.object({
  document_id: z.number().int().positive(),
  height_diff_difficulties: z.number().finite().nonnegative().nullish(),
  orientations: z
    .array(z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']))
    .nullish(),
  global_rating: rating,
  rock_free_rating: rating,
  rock_required_rating: rating,
  engagement_rating: rating,
  risk_rating: rating,
  equipment_rating: rating,
});

export function extractRouteDetails(
  value: unknown,
  expectedId: string,
): TopoDetails {
  const parsed = routeSchema.safeParse(value);
  if (!parsed.success || String(parsed.data.document_id) !== expectedId) {
    throw new HttpError(
      502,
      'Les informations reçues de Camptocamp sont invalides.',
    );
  }
  const route = parsed.data;
  const rockRating = route.rock_free_rating
    ? route.rock_free_rating +
      (route.rock_required_rating ? `>${route.rock_required_rating}` : '')
    : route.rock_required_rating
      ? `${route.rock_required_rating} obligatoire`
      : null;
  return {
    elevation: route.height_diff_difficulties ?? null,
    orientation: route.orientations?.[0] ?? null,
    cotation:
      [
        route.global_rating,
        rockRating,
        route.engagement_rating,
        route.risk_rating,
        route.equipment_rating,
      ]
        .filter(Boolean)
        .join(' ') || null,
  };
}

export async function fetchTopoDetails(
  url: string,
  request: typeof fetch = fetch,
): Promise<TopoDetails> {
  const id = camptocampRouteId(url);
  if (!id)
    throw new HttpError(400, 'Utilisez un lien vers un itinéraire Camptocamp.');
  let response: Response;
  try {
    // Never fetch a user-provided host or follow redirects to another service.
    response = await request(`https://api.camptocamp.org/routes/${id}?l=fr`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new HttpError(
      502,
      'Camptocamp est indisponible. Vous pouvez réessayer ou remplir les champs à la main.',
    );
  }
  if (response.status === 404)
    throw new HttpError(404, 'Cet itinéraire est introuvable sur Camptocamp.');
  if (!response.ok)
    throw new HttpError(
      502,
      'Camptocamp est indisponible. Réessayez plus tard.',
    );
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new HttpError(
      502,
      'La réponse de Camptocamp est illisible. Réessayez plus tard.',
    );
  }
  return extractRouteDetails(data, id);
}
