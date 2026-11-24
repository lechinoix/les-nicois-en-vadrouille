import { z } from 'zod';

export const optionKinds = ['participants', 'places', 'periods'] as const;
export type OptionKind = (typeof optionKinds)[number];
export const optionLabels: Record<OptionKind, string> = {
  participants: 'Participants',
  places: 'Lieux',
  periods: 'Périodes',
};
export type EditorOption = {
  id: string;
  kind: OptionKind;
  label: string;
  archived: boolean;
  revision: number;
};
const label = z.string().trim().min(1, 'Un libellé est requis').max(200);
export const createOptionSchema = z.object({
  kind: z.enum(optionKinds),
  label,
});
export const updateOptionSchema = z.object({
  id: z.uuid(),
  expectedRevision: z.number().int().positive(),
  label,
  archived: z.boolean(),
});
