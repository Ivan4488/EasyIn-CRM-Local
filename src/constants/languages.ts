export interface LanguageData {
  code: string;
  name: string;
}

// Static imports for synchronous access
import languagesJson from "./languages.json";

export const languagesData: LanguageData[] = languagesJson;

// Map language code to name
export const LANGUAGE_CODE_TO_NAME: Record<string, string> = languagesData.reduce<Record<string, string>>((acc, language) => {
  acc[language.code] = language.name;
  return acc;
}, {});

// Map language name to code
export const LANGUAGE_NAME_TO_CODE: Record<string, string> = languagesData.reduce<Record<string, string>>((acc, language) => {
  acc[language.name] = language.code;
  return acc;
}, {});

// Async loader for consistency with countries pattern
export const loadLanguagesData = async (): Promise<LanguageData[]> => {
  return languagesData;
};

export const getLanguageCodeToName = async (): Promise<Record<string, string>> => {
  const languages = await loadLanguagesData();
  return languages.reduce<Record<string, string>>((acc, language) => {
    acc[language.code] = language.name;
    return acc;
  }, {});
};

export const getLanguageNameToCode = async (): Promise<Record<string, string>> => {
  const languages = await loadLanguagesData();
  return languages.reduce<Record<string, string>>((acc, language) => {
    acc[language.name] = language.code;
    return acc;
  }, {});
};

