export function hasLinkedInDataMapForAutomation(
  property:
    | {
        versions?: { page?: unknown };
        hasLinkedInFieldMapping?: boolean;
      }
    | null
    | undefined
): boolean {
  if (!property) return false;
  if (typeof property.hasLinkedInFieldMapping === "boolean") {
    return property.hasLinkedInFieldMapping;
  }
  return Boolean(property.versions?.page);
}
