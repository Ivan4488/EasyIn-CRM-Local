import { Property2 } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { formatDateValue } from "~/utils/birthday";

/**
 * Extracts a human-readable display string from a contact property value.
 * Shared between useDuplicateConflictCount and DuplicateReviewRightMenu.
 */
export function getPropertyDisplayValue(property: Property2): string {
  const val = property.values?.[0];
  if (!val) return "";

  if (property.type === "CONTACT_EMAILS") {
    const jsonValue = val.jsonValue;
    if (Array.isArray(jsonValue) && jsonValue.length > 0) {
      const usable = jsonValue.filter((e: any) => !e.action);
      const primary = usable.find((e: any) => e.isPrimary);
      return primary?.email ?? jsonValue[0]?.email ?? "";
    }
    return "";
  }

  if (property.type === "DATE") {
    return val.dateValue ? formatDateValue(new Date(val.dateValue)) : "";
  }

  if (property.type === "PHOTO") {
    return val.textValue ?? val.linkValue ?? "";
  }

  if (
    ["SINGLE_SELECT", "COUNTRY_SELECT", "STATE_SELECT", "REGION_SELECT", "CITY_SELECT", "LANGUAGE_SELECT"].includes(property.type)
  ) {
    return val.selectOptions?.[0]?.value ?? val.textValue ?? "";
  }

  if (["MULTI_SELECT", "LANGUAGE_MULTISELECT"].includes(property.type)) {
    if (val.selectOptions?.length) return val.selectOptions.map((o) => o.value).join(", ");
    if (val.textValue) {
      try {
        const parsed = JSON.parse(val.textValue);
        if (Array.isArray(parsed)) return parsed.join(", ");
      } catch { /* ignore */ }
    }
    return val.textValue ?? "";
  }

  return val.textValue ?? val.linkValue ?? "";
}
