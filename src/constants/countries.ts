// https://github.com/venkatmcajj/react-country-state-city/blob/master/data/countriesminified.json
export interface CountryOption {
  code: string;
  name: string;
}

export interface CountryData {
  id: number;
  name: string;
  iso2: string;
}

export interface StateData {
  country_code: string;
  name: string;
  code: string;
  id?: number;
  state_code?: string;
  latitude?: string;
  longitude?: string;
  type?: string | null;
  hasCities?: boolean;
  region?: string;
}

export interface CountryStatesData {
  id: number;
  states: RawStateData[];
}

type RawStateData = {
  id: number;
  name: string;
  state_code: string;
  latitude?: string;
  longitude?: string;
  type?: string | null;
  hasCities?: boolean;
  region?: string;
};

type RawCountryStates = {
  id: number;
  states: RawStateData[];
};

// Dynamic imports for full data (loaded only when needed)
let countriesDataCache: CountryData[] | null = null;
let statesDataCache: StateData[] | null = null;

const mapStatesMinifiedToStateData = (
  rawCountries: RawCountryStates[],
  countryIdToIso2: Map<number, string>
): StateData[] => {
  const flattened: StateData[] = [];

  for (const country of rawCountries) {
    const iso2 = countryIdToIso2.get(country.id);

    if (!iso2) {
      continue;
    }

    for (const state of country.states) {
      const trimmedStateCode = state.state_code?.trim();
      const hasHyphen = trimmedStateCode?.includes("-");
      const code = trimmedStateCode
        ? hasHyphen
          ? trimmedStateCode
          : `${iso2}-${trimmedStateCode}`
        : `${iso2}-${state.id}`;

      flattened.push({
        country_code: iso2,
        name: state.name,
        code,
        id: state.id,
        state_code: trimmedStateCode || undefined,
        latitude: state.latitude,
        longitude: state.longitude,
        type: state.type ?? null,
        hasCities: state.hasCities,
        region: state.region,
      });
    }
  }

  return flattened;
};

export const loadCountriesData = async (): Promise<CountryData[]> => {
  if (countriesDataCache) return countriesDataCache;
  const data = await import("./countries.json");
  countriesDataCache = data.default;
  return countriesDataCache;
};

export const loadStatesData = async (): Promise<StateData[]> => {
  if (statesDataCache) return statesDataCache;
  const countriesData = await loadCountriesData();
  const countryIdToIso2 = new Map<number, string>(
    countriesData.map((country) => [country.id, country.iso2])
  );
  const data = await import("./statesminified.json");
  const flattenedStates = mapStatesMinifiedToStateData(
    data.default as RawCountryStates[],
    countryIdToIso2
  );
  statesDataCache = flattenedStates;
  return statesDataCache;
};

export const getStatesByCountryName = async (
  countryName: string
): Promise<StateData[]> => {
  const [countriesData, statesData] = await Promise.all([
    loadCountriesData(),
    loadStatesData(),
  ]);

  const country = countriesData.find((c) => c.name === countryName);
  if (!country) return [];

  return statesData.filter((state) => state.country_code === country.iso2);
};

// Helper functions that work with loaded data
export const getCountryCodes = async (): Promise<string[]> => {
  const countries = await loadCountriesData();
  return countries.map(c => c.iso2);
};

export const getCountryNames = async (): Promise<string[]> => {
  const countries = await loadCountriesData();
  return countries.map(c => c.name);
};

export const getCountryNameToCode = async (): Promise<Record<string, string>> => {
  const countries = await loadCountriesData();
  return countries.reduce<Record<string, string>>((acc, country) => {
    acc[country.name] = country.iso2;
    return acc;
  }, {});
};

export const getCountryCodeToName = async (): Promise<Record<string, string>> => {
  const countries = await loadCountriesData();
  return countries.reduce<Record<string, string>>((acc, country) => {
    acc[country.iso2] = country.name;
    return acc;
  }, {});
};

// Backward compatibility exports (deprecated - use async versions above)
export const COUNTRY_CODES: string[] = [];
export const COUNTRY_NAMES: string[] = [];
export const COUNTRY_NAME_TO_CODE: Record<string, string> = {};
export const COUNTRY_CODE_TO_NAME: Record<string, string> = {};
