import countriesJson from "./countries.json";
import statesMinifiedJson from "./statesminified.json";

export type UkRegion =
  | "England"
  | "Scotland"
  | "Wales"
  | "Northern Ireland"
  | "Crown Dependencies";

export interface UkCountyStateData {
  country_code: string;
  code: string;
  name: string;
  region: UkRegion;
}

type RawCountryStates = {
  id: number;
  states: Array<{
    id: number;
    name: string;
    state_code: string;
    region?: string;
  }>;
};

const KNOWN_REGIONS: readonly UkRegion[] = [
  "England",
  "Scotland",
  "Wales",
  "Northern Ireland",
  "Crown Dependencies",
] as const;

const KNOWN_REGION_SET = new Set<UkRegion>(KNOWN_REGIONS);

const UK_COUNTRY_CODE = "GB";

const countries = countriesJson as Array<{ id: number; iso2: string }>;
const rawStates = statesMinifiedJson as RawCountryStates[];

const ukCountryId =
  countries.find((country) => country.iso2 === UK_COUNTRY_CODE)?.id ?? null;

const ukStatesRaw =
  ukCountryId != null
    ? rawStates.find((country) => country.id === ukCountryId)?.states ?? []
    : [];

type RawUkState = (typeof ukStatesRaw)[number];

const isStateWithKnownRegion = (
  state: RawUkState
): state is RawUkState & { region: UkRegion } =>
  Boolean(state.region) && KNOWN_REGION_SET.has(state.region as UkRegion);

const formatCode = (state: RawUkState): string => {
  const trimmed = state.state_code?.trim();
  if (!trimmed) {
    return `${UK_COUNTRY_CODE}-${state.id}`;
  }
  return trimmed.includes("-") ? trimmed : `${UK_COUNTRY_CODE}-${trimmed}`;
};

const ukCountiesFromStates: UkCountyStateData[] = ukStatesRaw
  .filter(isStateWithKnownRegion)
  .map((state) => ({
    country_code: UK_COUNTRY_CODE,
    code: formatCode(state),
    name: state.name,
    region: state.region,
  }));

const createEmptyRegionMap = (): Record<UkRegion, UkCountyStateData[]> =>
  KNOWN_REGIONS.reduce<Record<UkRegion, UkCountyStateData[]>>(
    (acc, region) => {
      acc[region] = [];
      return acc;
    },
    {} as Record<UkRegion, UkCountyStateData[]>
  );

export const UK_REGION_STATE_MAP: Record<UkRegion, UkCountyStateData[]> =
  ukCountiesFromStates.reduce((acc, state) => {
    if (!acc[state.region]) {
      acc[state.region] = [];
    }
    acc[state.region].push(state);
    return acc;
  }, createEmptyRegionMap());

export const UK_REGIONS = Object.keys(
  UK_REGION_STATE_MAP
) as UkRegion[];

export const UK_CEREMONIAL_COUNTIES: UkCountyStateData[] =
  UK_REGIONS.flatMap((region) => UK_REGION_STATE_MAP[region]);
