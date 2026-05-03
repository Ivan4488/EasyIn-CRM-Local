import { Property } from "~/stores/propertiesStore"

export const getPropertiesDiff = (
  oldProperties: Property[],
  newProperties: Property[],
) => {
  const diff: {
    modified: { old: Property; new: Property }[];
  } = {
    modified: [],
  };

  // Create maps for faster lookup
  const oldMap = new Map(oldProperties.map(prop => [prop.id, prop]));

  // Find modified properties
  for (const newProp of newProperties) {
    const oldProp = oldMap.get(newProp.id);
    if (oldProp && JSON.stringify(oldProp) !== JSON.stringify(newProp)) {
      diff.modified.push({ old: oldProp, new: newProp });
    }
  }

  return diff.modified.map(({ new: newProp }) => newProp);
};