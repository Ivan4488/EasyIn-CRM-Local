/**
 * Calculates the Levenshtein distance between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns The edit distance between the strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: (number | undefined)[][] = new Array(len2 + 1);

  // Initialize matrix
  for (let i = 0; i <= len2; i++) {
    matrix[i] = new Array(len1 + 1);
    matrix[i]![0] = i;
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0]![j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        (matrix[i - 1]![j] as number) + 1,     // deletion
        (matrix[i]![j - 1] as number) + 1,     // insertion
        (matrix[i - 1]![j - 1] as number) + cost // substitution
      );
    }
  }

  return matrix[len2]![len1] as number;
}

/**
 * Normalizes a string for better fuzzy matching
 * @param str String to normalize
 * @returns Normalized string
 */
function normalizeString(str: string): string {
  return str
    .normalize("NFD") // Break accented characters into base + diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Checks if two strings are fuzzy matches based on various criteria
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @param threshold Similarity threshold (0-1, where 1 is exact match)
 * @returns True if strings are considered fuzzy matches
 */
export function isFuzzyMatch(str1: string, str2: string, threshold = 0.8): boolean {
  if (!str1 || !str2) return false;

  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);

  // Exact match (case insensitive, normalized)
  if (normalized1 === normalized2) return true;

  // Contains substring match
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;

  // Calculate Levenshtein distance similarity
  const maxLength = Math.max(normalized1.length, normalized2.length);
  if (maxLength === 0) return true;

  const distance = levenshteinDistance(normalized1, normalized2);
  const similarity = 1 - (distance / maxLength);

  return similarity >= threshold;
}

/**
 * Finds the best fuzzy match from an array of options
 * @param target Target string to match
 * @param options Array of strings to search in
 * @param threshold Similarity threshold
 * @returns Best matching string or null if no match found
 */
export function findBestFuzzyMatch(target: string, options: string[], threshold = 0.8): string | null {
  if (!target || !options.length) return null;

  let bestMatch: string | null = null;
  let bestSimilarity = 0;

  for (const option of options) {
    if (isFuzzyMatch(target, option, threshold)) {
      const normalizedTarget = normalizeString(target);
      const normalizedOption = normalizeString(option);
      const distance = levenshteinDistance(normalizedTarget, normalizedOption);
      const maxLength = Math.max(normalizedTarget.length, normalizedOption.length);
      const similarity = 1 - (distance / maxLength);

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = option;
      }
    }
  }

  return bestMatch;
}
