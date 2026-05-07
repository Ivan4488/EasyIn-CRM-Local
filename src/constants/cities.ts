import {
  loadCountriesData,
  loadStatesData,
  StateData,
} from "./countries";
import { isFuzzyMatch } from "../utils/fuzzyMatch";

type CityRecord = {
  name: string;
  id?: number;
};

type StateRecord = {
  id?: number;
  code?: string;
  cities: CityRecord[];
};

type CountryCitiesRecord = {
  id: number;
  states: StateRecord[];
};

let citiesDataCache: CountryCitiesRecord[] | null = null;

const loadCitiesData = async (): Promise<CountryCitiesRecord[]> => {
  if (citiesDataCache) {
    return citiesDataCache;
  }

  const data = await import("./citiesminified.json");
  citiesDataCache = data.default as CountryCitiesRecord[];
  return citiesDataCache;
};

const findMatchingState = (
  states: StateData[],
  target: string
): StateData | undefined => {
  const normalizedTarget = target?.trim();
  if (!normalizedTarget) {
    return undefined;
  }

  const directMatch = states.find(
    (state) =>
      state.name === normalizedTarget ||
      state.code === normalizedTarget ||
      state.state_code === normalizedTarget
  );
  if (directMatch) {
    return directMatch;
  }

  return states.find(
    (state) =>
      isFuzzyMatch(normalizedTarget, state.name, 0.85) ||
      isFuzzyMatch(normalizedTarget, state.code, 0.9) ||
      isFuzzyMatch(normalizedTarget, state.state_code || '', 0.9)
  );
};

const extractCityNames = (cities: CityRecord[]): string[] => {
  const uniqueNames = new Set<string>();
  for (const city of cities) {
    if (city?.name) {
      uniqueNames.add(city.name);
    }
  }
  return Array.from(uniqueNames).sort((left, right) =>
    left.localeCompare(right)
  );
};

export const getCitiesByCountryName = async (
  countryName: string,
  stateName?: string
): Promise<string[]> => {
  if (!countryName) {
    return [];
  }

  const [countries, citiesData] = await Promise.all([
    loadCountriesData(),
    loadCitiesData(),
  ]);

  const country = countries.find((entry) => entry.name === countryName);
  if (!country) {
    return [];
  }

  const countryCities = citiesData.find((entry) => entry.id === country.id);
  if (!countryCities) {
    return [];
  }

  if (!stateName) {
    const allCities = countryCities.states.reduce<CityRecord[]>(
      (acc, state) => acc.concat(state.cities),
      []
    );
    return extractCityNames(allCities);
  }

  const states = await loadStatesData();
  const statesInCountry = states.filter(
    (state) => state.country_code === country.iso2
  );
  const matchingState = findMatchingState(statesInCountry, stateName);
  if (!matchingState) {
    return [];
  }

  const stateCities = countryCities.states.find((state) => {
    if (matchingState.id && state.id) {
      return state.id === matchingState.id;
    }

    if (state.code && matchingState.code) {
      return state.code === matchingState.code;
    }

    if (state.code && matchingState.state_code) {
      return (
        state.code === matchingState.state_code ||
        state.code === `${matchingState.country_code}-${matchingState.state_code}`
      );
    }

    return false;
  });
  if (!stateCities) {
    return [];
  }

  return extractCityNames(stateCities.cities);
};
