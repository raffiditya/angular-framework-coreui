export function toIsoDateFormat(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
}
