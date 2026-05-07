export const EMPLOYEE_COUNT_BASE_ROWS = [
  { kind: "low", label: "Employee count low", shortLabel: "Low", sortOrder: 0 },
  { kind: "high", label: "Employee count high", shortLabel: "High", sortOrder: 1 },
  { kind: "range", label: "Full range", shortLabel: "Range", sortOrder: 2 },
  { kind: "linkedin", label: "Employees on LinkedIn", shortLabel: "LinkedIn", sortOrder: 3 },
] as const;

export type EmployeeCountKind = (typeof EMPLOYEE_COUNT_BASE_ROWS)[number]["kind"];

/** Label string → kind mapping for icon/display lookups. */
export const LABEL_TO_KIND: Record<string, EmployeeCountKind> = Object.fromEntries(
  EMPLOYEE_COUNT_BASE_ROWS.map((r) => [r.label, r.kind])
) as Record<string, EmployeeCountKind>;

/** Maps kind → short display label (e.g. "low" → "Low"). */
export const KIND_TO_SHORT_LABEL: Record<EmployeeCountKind, string> = Object.fromEntries(
  EMPLOYEE_COUNT_BASE_ROWS.map((r) => [r.kind, r.shortLabel])
) as Record<EmployeeCountKind, string>;

/**
 * Canonical employee-count row model shared by server mapping + modal logic.
 */
export type EmployeeCountEntry = {
  id: string;
  label: string;
  value: string | number | undefined;
  source: string;
  isPrimary: boolean;
  sortOrder: number;
  kind?: EmployeeCountKind;
  numericValue?: number | null;
};

const labelToKind = (label?: string): EmployeeCountKind | undefined => {
  switch (label) {
    case "Employee count low":
      return "low";
    case "Employee count high":
      return "high";
    case "Full range":
      return "range";
    case "Employees on LinkedIn":
      return "linkedin";
    default:
      return undefined;
  }
};

const toNumeric = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const defaultValueByKind = (
  kind: EmployeeCountKind,
  fallbackRange: string,
): string | number => {
  if (kind === "range") return fallbackRange || "--";
  return "--";
};

const baseId = (kind: EmployeeCountKind, index: number) => `employee-count-${kind}-${index}`;

export const isUserAddedEmployeeCountEntry = (entry: EmployeeCountEntry) =>
  entry.source === "User" || entry.label.startsWith("Additional");

/**
 * Normalizes unknown jsonValue into canonical employee-count rows:
 * - guarantees all 4 base LinkedIn rows
 * - preserves/normalizes user-added rows
 * - enforces one primary row (defaults to Range)
 */
export const normalizeEmployeeCountEntries = (
  rawEntries: unknown,
  fallbackRange = "",
): EmployeeCountEntry[] => {
  const input = Array.isArray(rawEntries)
    ? (rawEntries as Partial<EmployeeCountEntry>[])
    : [];

  const byKind = new Map<EmployeeCountKind, Partial<EmployeeCountEntry>>();
  const userRows: EmployeeCountEntry[] = [];

  input.forEach((entry, index) => {
    const inferredKind = entry.kind || labelToKind(entry.label);
    if (inferredKind) {
      if (!byKind.has(inferredKind)) byKind.set(inferredKind, entry);
      return;
    }

    if (!entry.id || !entry.label) return;
    userRows.push({
      id: String(entry.id),
      label: String(entry.label),
      value: entry.value as string | number | undefined,
      source: typeof entry.source === "string" ? entry.source : "User",
      isPrimary: entry.isPrimary === true,
      sortOrder: typeof entry.sortOrder === "number" ? entry.sortOrder : 100 + index,
      numericValue:
        typeof entry.numericValue === "number" && Number.isFinite(entry.numericValue)
          ? entry.numericValue
          : toNumeric(entry.value),
    });
  });

  const baseRows: EmployeeCountEntry[] = EMPLOYEE_COUNT_BASE_ROWS.map((base, index) => {
    const current = byKind.get(base.kind);
    const numericValue =
      typeof current?.numericValue === "number" && Number.isFinite(current.numericValue)
        ? current.numericValue
        : toNumeric(current?.value);

    const defaultValue = defaultValueByKind(base.kind, fallbackRange);
    const value =
      current?.value !== undefined && current?.value !== null ? current.value : defaultValue;

    return {
      id: typeof current?.id === "string" ? current.id : baseId(base.kind, index),
      label: base.label,
      value,
      source: typeof current?.source === "string" ? current.source : "LinkedIn",
      isPrimary: current?.isPrimary === true,
      sortOrder: base.sortOrder,
      kind: base.kind,
      numericValue,
    };
  });

  const merged = [
    ...baseRows,
    ...userRows
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((row, idx) => ({ ...row, sortOrder: EMPLOYEE_COUNT_BASE_ROWS.length + idx })),
  ];

  const hasPrimary = merged.some((e) => e.isPrimary);
  if (!hasPrimary) {
    const range = merged.find((e) => e.kind === "range") || merged[0];
    if (range) {
      merged.forEach((e) => {
        e.isPrimary = e.id === range.id;
      });
    }
  }

  return merged;
};

export const getEmployeeCountPrimaryValue = (entries: EmployeeCountEntry[]): string => {
  const primary = entries.find((e) => e.isPrimary) || entries[0];
  if (!primary || primary.value == null) return "";
  return String(primary.value);
};
