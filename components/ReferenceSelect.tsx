'use client';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  optionLabels,
  type EditorOption,
  type OptionKind,
} from '@/lib/editor-option-model';

export default function ReferenceSelect({
  kind,
  options,
  value,
  onChange,
}: {
  kind: OptionKind;
  options: EditorOption[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  const available = options.filter(
    (option) =>
      option.kind === kind &&
      (!option.archived || value.includes(option.label)),
  );
  const choices = [
    ...available.map((option) => ({
      value: option.label,
      label: option.label + (option.archived ? ' (archivé)' : ''),
    })),
    ...value
      .filter((label) => !available.some((option) => option.label === label))
      .map((label) => ({ value: label, label: `${label} (ancienne valeur)` })),
  ];
  return (
    <div>
      <Label htmlFor={`article-${kind}`}>{optionLabels[kind]}</Label>
      <Select multiple value={value} onValueChange={onChange}>
        <SelectTrigger
          id={`article-${kind}`}
          className="w-full"
          aria-describedby={`${kind}-help`}
        >
          <SelectValue>
            {() => (value.length ? `${value.length} sélection(s)` : 'Choisir…')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {choices.map((choice) => (
            <SelectItem key={choice.value} value={choice.value}>
              {choice.label}
            </SelectItem>
          ))}
          {!choices.length && (
            <p className="px-3 text-sm">
              Ajoutez des choix depuis « Gérer les choix ».
            </p>
          )}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2">
        {value.map((label, index) => (
          <span
            key={`${index}-${label}`}
            className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-border px-2 text-sm"
          >
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {label || '(valeur vide)'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Retirer ${label || 'la valeur vide'}`}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              <X aria-hidden="true" />
            </Button>
          </span>
        ))}
      </div>
      <p id={`${kind}-help`} className="m-0 text-sm text-muted-foreground">
        Plusieurs choix possibles. Les anciennes sélections sont conservées.
      </p>
    </div>
  );
}
