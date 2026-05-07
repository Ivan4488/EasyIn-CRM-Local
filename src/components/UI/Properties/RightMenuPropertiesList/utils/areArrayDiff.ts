export function areArraysDifferent<T>(arr1: T[], arr2: T[]): boolean {
  // Check if the arrays have different lengths
  if (arr1.length !== arr2.length) return true;

  // Create a deep comparison function for the objects in the arrays
  const areObjectsEqual = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  // Compare each element in both arrays
  for (let i = 0; i < arr1.length; i++) {
    if (!areObjectsEqual(arr1[i], arr2[i])) {
      return true;
    }
  }

  // If all elements are equal, return false (arrays are identical)
  return false;
}
