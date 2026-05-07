import { AssociationItem } from "~/stores/associationStore"

export const getAssociationsDiff = (
  initialAssociations: AssociationItem[],
  currentAssociations: AssociationItem[]
) => {
  const associationsToDelete = initialAssociations.filter(
    (initialItem) => !currentAssociations.some((currentItem) => currentItem.id === initialItem.id)
  );

  const associationsToUpdateOrAdd = currentAssociations.map((currentItem) => {
    const initialItem = initialAssociations.find((item) => item.id === currentItem.id);
    if (!initialItem || initialItem.order !== currentItem.order) {
      return currentItem;
    }
    return null;
  }).filter((item): item is AssociationItem => item !== null);

  return {
    associationsToDelete: associationsToDelete.map((item) => item.id),
    associationsToUpdateOrAdd
  };
};