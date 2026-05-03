import { PropertyValue } from "~/service/types";
import { PropertyType } from "~/stores/propertiesStore";
import { KIND_TO_SHORT_LABEL, LABEL_TO_KIND, type EmployeeCountKind } from "~/utils/employeeCount";

export type MailboxEntry = {
  label: string;
  value: string;
  isPrimary?: boolean;
};

/**
 * Resolves the short display label for an employee count entry.
 * Tries kind first (direct lookup), then falls back to LABEL_TO_KIND for the long label string.
 * Returns the short label ("Low", "High", "Range", "LinkedIn") or the raw label/source as fallback.
 */
const resolveEmployeeCountLabel = (entry: {
  kind?: string;
  label?: string;
  source?: string;
}): string => {
  const kind = entry.kind as EmployeeCountKind | undefined;
  if (kind && KIND_TO_SHORT_LABEL[kind]) return KIND_TO_SHORT_LABEL[kind];
  if (entry.label) {
    const inferredKind = LABEL_TO_KIND[entry.label] as EmployeeCountKind | undefined;
    if (inferredKind && KIND_TO_SHORT_LABEL[inferredKind]) return KIND_TO_SHORT_LABEL[inferredKind];
    return entry.label;
  }
  return entry.source || "Value";
};

/** Returns structured label+value entries for mailbox-type properties (CONTACT_EMAILS, COMPANY_EMPLOYEE_COUNT). */
export const getMailboxEntries = ({
  property,
  type,
}: {
  property: PropertyValue;
  type: PropertyType;
}): MailboxEntry[] | null => {
  if (type === "CONTACT_EMAILS") {
    if (!property.jsonValue || !Array.isArray(property.jsonValue)) return null;
    const entries = (property.jsonValue as Array<{
      email?: string;
      source?: string;
      isPrimary?: boolean;
      action?: string | null;
    }>).filter((e) => !e.action && e.email);
    if (!entries.length) return null;
    return entries.map((e) => ({
      label: e.source || "Email",
      value: e.email ?? "",
      isPrimary: e.isPrimary ?? false,
    }));
  }

  if (type === "COMPANY_EMPLOYEE_COUNT") {
    // jsonValue can be a parsed array (newer rows) or a JSON string (older seeded rows)
    let raw = property.jsonValue;
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = null; }
    }
    if (!raw || !Array.isArray(raw)) return null;
    const entries = (raw as Array<{
      kind?: string;
      label?: string;
      value?: string | number;
      source?: string;
      isPrimary?: boolean;
    }>).filter(
      (e) =>
        e.value !== undefined &&
        e.value !== null &&
        e.value !== "" &&
        e.value !== "--"
    );
    if (!entries.length) return null;
    return entries.map((e) => ({
      label: resolveEmployeeCountLabel(e),
      value: e.value?.toString() ?? "",
      isPrimary: e.isPrimary ?? false,
    }));
  }

  return null;
};

export const getPropertyValues = ({
  property,
  type,
}: {
  property: PropertyValue;
  type: PropertyType;
}): string[] => {
  switch (type) {
    case "SINGLE_SELECT":
    case "MULTI_SELECT":
      return property.selectOptions.map((option) => option.value);
    case "DATE":
      return [property.dateValue || ""];
    case "COUNTRY_SELECT":
    case "MULTI_LINE_TEXT":
    case "NUMBER":
    case "PHOTO":
    case "DOMAIN":
    case "ACCOUNT_EMAIL":
    case "CONTACT_EMAIL":
    case "LINKEDIN_PROFILE_URL":
    case "SINGLE_LINE_TEXT":
    case "STATE_SELECT":
    case "REGION_SELECT":
    case "LANGUAGE_SELECT":
    case "CITY_SELECT":
      return [property.textValue || ""];
    case "LANGUAGE_MULTISELECT":
      // LANGUAGE_MULTISELECT stores languages as JSON array in textValue
      if (property.textValue) {
        try {
          const languages = JSON.parse(property.textValue);
          if (Array.isArray(languages)) {
            return languages;
          }
        } catch {
          // If parsing fails, return as single value
          return [property.textValue];
        }
      }
      return [];
    // Mailbox types are handled by getMailboxEntries — not rendered as plain strings
    case "CONTACT_EMAILS":
    case "COMPANY_EMPLOYEE_COUNT":
      return [];
  }
};

export const getPropertySources = ({
  property,
  type,
}: {
  property: PropertyValue;
  type: PropertyType;
}): string => {
  if (type === "CONTACT_EMAILS" && property.jsonValue && Array.isArray(property.jsonValue)) {
    const sources = (property.jsonValue as Array<{ source?: string }>)
      .map((entry) => entry.source)
      .filter((source): source is string => Boolean(source));
    const uniqueSources = [...new Set(sources)];
    return uniqueSources.join(", ") || "-";
  }
  return "-";
};
