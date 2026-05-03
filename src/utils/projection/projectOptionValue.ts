import { COUNTRY_NAME_TO_CODE } from "~/constants/countries";
import { PropertyValueProjection } from "~/types/propertyValueProjection";

export const projectOptionValue = (
  originalValue: string,
  projection?: PropertyValueProjection | null
): string => {
  if (!projection) {
    return originalValue;
  }

  switch (projection.dataset) {
    case "country":
      if (projection.format === "alpha_2") {
        return COUNTRY_NAME_TO_CODE[originalValue] ?? originalValue;
      }
      return originalValue;
    default:
      return originalValue;
  }
};
