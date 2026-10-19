/** One row in a filter list (employee / object picker). */
export interface FilterOption {
  value: string;
  label: string;
  /** Small second line, e.g. "11 Schichten · 97:55" */
  sub?: string;
  /** Initials shown in an avatar square (employees) */
  initials?: string;
}
