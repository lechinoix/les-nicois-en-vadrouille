import { z } from 'zod';

export const optionKinds = [
  'participants',
  'places',
  'periods',
  'sports',
] as const;
export type OptionKind = (typeof optionKinds)[number];
export const optionLabels: Record<OptionKind, string> = {
  participants: 'Participants',
  places: 'Lieux',
  periods: 'Périodes',
  sports: 'Sports',
};
export type EditorOption = {
  id: string;
  kind: OptionKind;
  label: string;
  value: string | null;
  archived: boolean;
  revision: number;
};
// Sports retain stable codes in articles and URLs when their label changes.
export const optionValue = (option: EditorOption) =>
  option.value ?? option.label;
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
