import { usePropertiesStore } from "~/stores/propertiesStore";

export function getActivePropertiesMutationPayload() {
  const propertiesStore = usePropertiesStore.getState();

  return propertiesStore.properties.map((property, index) => ({
    id: property.id,
    is_active:
      !!propertiesStore.activeProperties.find(
        (activeProperty) => activeProperty.id === property.id
      ) ?? false,
    sortOrder:
      propertiesStore.activeProperties.find(
        (activeProperty) => activeProperty.id === property.id
      )?.sortOrder ?? index,
    title: property.title,
  }));
}
