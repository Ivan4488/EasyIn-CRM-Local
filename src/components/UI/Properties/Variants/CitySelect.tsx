import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Popover/Popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../Popover/Command";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "../PropertiesLockTypeEdit/LocksDescription";
import { HiddenLine } from "../PropertiesLockTypeEdit/HiddenLine";
import { getCitiesByCountryName } from "~/constants/cities";

const normalizeCityName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

interface Props {
  id: string;
}

export const CitySelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const propertiesStore = usePropertiesStore();
  const ref = useRef<HTMLDivElement>(null);

  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const selectedCity = property?.stringValue;
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const placeholder = isValueHidden
    ? ""
    : selectedCity ?? property?.placeholder;
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  const properties = propertiesStore.properties;
  const countryProperty = properties.find(
    (p) => p.title === "Country of Residence" || p.title === "Company country"
  );
  const selectedCountry = countryProperty?.stringValue;
  const stateProperty = properties.find(
    (p) => p.title === "State of Residence" || p.title === "Company state"
  );
  const selectedState = stateProperty?.stringValue;

  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setAvailableCities([]);
      setIsLoadingCities(false);
      return;
    }

    let isActive = true;
    const loadCities = async () => {
      setIsLoadingCities(true);
      try {
        const cities = await getCitiesByCountryName(
          selectedCountry,
          selectedState
        );
        if (isActive) {
          setAvailableCities(cities);
        }
      } catch (error) {
        console.error("Failed to load cities:", error);
        if (isActive) {
          setAvailableCities([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingCities(false);
        }
      }
    };

    loadCities();

    return () => {
      isActive = false;
    };
  }, [selectedCountry, selectedState]);

  const prevCountryRef = useRef(selectedCountry);
  const prevStateRef = useRef(selectedState);

  useEffect(() => {
    const countryWasCleared = !!prevCountryRef.current && !selectedCountry;
    const stateWasCleared = !!prevStateRef.current && !selectedState;
    prevCountryRef.current = selectedCountry;
    prevStateRef.current = selectedState;

    // Only clear city when user actively clears country/state
    // (not on initial data load when they were never set)
    if ((!selectedCountry || !selectedState) && selectedCity) {
      if (countryWasCleared || stateWasCleared) {
        propertiesStore.setPropertyStringValue(id, undefined);
      }
      return;
    }

    if (
      selectedCity &&
      availableCities.length > 0 &&
      !availableCities.includes(selectedCity)
    ) {
      const normalizedTarget = normalizeCityName(selectedCity);
      const matchedCity = availableCities.find(
        (city) => normalizeCityName(city) === normalizedTarget
      );

      if (matchedCity && matchedCity !== selectedCity) {
        propertiesStore.setPropertyStringValue(id, matchedCity);
      }
      // If no match found, keep the existing city value rather than clearing it.
      // The backend may have city names not present in the local dataset.
    }
  }, [
    availableCities,
    id,
    propertiesStore,
    selectedCity,
    selectedCountry,
    selectedState,
  ]);

  const onSelect = (value: string) => {
    if (value === "none") {
      propertiesStore.setPropertyStringValue(id, undefined);
    } else {
      propertiesStore.setPropertyStringValue(id, value);
    }
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (isEditingLockType) {
      return "Choose";
    }
    if (isValueHidden) {
      return "";
    }
    if (!selectedCountry) {
      return "Select country first";
    }
    if (!selectedState) {
      return "Select state first";
    }
    if (!selectedCity) {
      return placeholder;
    }
    return selectedCity;
  };

  const isDisabled = isLocked || !selectedCountry || !selectedState;

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {title}
      </label>

      <Popover
        open={open && !isDisabled}
        onOpenChange={(openState) => !isDisabled && setOpen(openState)}
      >
        <div className="relative h-[38px]" ref={ref}>
          {isValueHidden && !isEditingLockType && (
            <HiddenLine className="!w-[145px]" />
          )}

          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={open}
              disabled={isDisabled}
              className={classNames(
                "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                isEditingLockType ? "pointer-events-none" : "",
                "flex items-center justify-between pr-[12px] min-h-[38px] w-full font-semibold bg-black-moderate border border-gray-moderate border-solid text-text-weak hover:border-hover-2",
                isDisabled ? "cursor-not-allowed opacity-50" : "",
                isValueHidden && "text-text-weak",
                !isValueHidden && !selectedCity && "text-text-weak"
              )}
            >
              <span
                className={classNames(
                  "text-display-15 truncate",
                  isDisabled || !selectedCity || isValueHidden || isEditingLockType
                    ? "text-text-weak font-[400]"
                    : "text-white font-[400]"
                )}
              >
                {getDisplayValue()}
              </span>
              <ChevronDown
                size={16}
                className={classNames(
                  "transition-transform ml-[4px] min-w-[16px] text-text-weak",
                  open ? "rotate-180" : ""
                )}
              />
            </button>
          </PopoverTrigger>

          <PropertiesMailbox propertyId={id} propertyHeight={38} />
          {isEditingLockType && <LocksDescription propertyId={id} />}
          <PropertiesMenu
            propertyId={id}
            disableLock={!propertiesStore.getShowMailbox()}
          />
        </div>

        <PopoverContent
          className="w-[255px] max-h-[200px] min-h-[200px] overflow-y-auto"
          alignOffset={-38}
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search cities..." />
            <CommandGroup className="[&_[cmdk-group-items]]:gap-[0px]">
              <CommandItem
                key="none"
                value="none"
                onSelect={() => onSelect("none")}
                className="font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group italic text-white"
              >
                None
              </CommandItem>

              {isLoadingCities && (
                <CommandItem
                  key="loading"
                  value=""
                  disabled
                  className="font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                >
                  Loading cities...
                </CommandItem>
              )}

              {!isLoadingCities && selectedCountry && !selectedState && (
                <CommandItem
                  key="no-state"
                  value=""
                  disabled
                  className="font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                >
                  Select state first
                </CommandItem>
              )}

              {!isLoadingCities &&
                selectedCountry &&
                selectedState &&
                availableCities.length === 0 && (
                  <CommandItem
                    key="no-cities"
                    value=""
                    disabled
                    className="font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                  >
                    No cities available
                  </CommandItem>
                )}

              {!isLoadingCities &&
                availableCities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={() => onSelect(city)}
                    className={classNames(
                      "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group text-white",
                      selectedCity === city && "text-strong-green"
                    )}
                  >
                    {city}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
