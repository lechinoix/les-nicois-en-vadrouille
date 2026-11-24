// Article dates are displayed in UTC. Do not shift their calendar day when
// showing an existing ISO timestamp in the device's native date picker.
export function dateInputValue(value: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}
