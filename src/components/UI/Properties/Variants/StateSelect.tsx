import { useEffect, useState, useRef } from "react";
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
import { getStatesByCountryName, StateData } from "~/constants/countries";
import { getStateLabelForCountry } from "~/constants/stateLabels";
import { isFuzzyMatch } from "~/utils/fuzzyMatch";

interface Props {
  id: string;
}

const UK_COUNTRY_NAME = "United Kingdom";
const UNAVAILABLE_REGION = "Unavailable";

export const StateSelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [availableStates, setAvailableStates] = useState<StateData[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const propertiesStore = usePropertiesStore();
  const ref = useRef<HTMLDivElement>(null);
  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const selectedState = property?.stringValue;
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const placeholder = isValueHidden
    ? ""
    : selectedState ?? property?.placeholder;
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  // Get the country property to filter states
  const properties = propertiesStore.properties;
  const countryProperty = properties.find(
    (p) => p.title === "Country of Residence" || p.title === "Company country"
  );
  const selectedCountry = countryProperty?.stringValue;
  const regionProperty = properties.find(
    (p) => p.title === "Region of Residence" || p.title === "Company region"
  );
  const selectedRegion = regionProperty?.stringValue;

  const shouldSelectRegionFirst =
    selectedCountry === UK_COUNTRY_NAME &&
    (!selectedRegion || selectedRegion === UNAVAILABLE_REGION);
  const defaultStateLabel = title ?? "State";
  const stateLabel = getStateLabelForCountry(selectedCountry, defaultStateLabel);

  // Load states when select is opened or country changes
  useEffect(() => {
    if (!selectedCountry || shouldSelectRegionFirst) {
      setAvailableStates([]);
      return;
    }

    const loadStates = async () => {
      setIsLoadingStates(true);
      try {
        const states = await getStatesByCountryName(selectedCountry);
        const filteredStates =
          selectedCountry === UK_COUNTRY_NAME && selectedRegion
            ? states.filter((state) => state.region === selectedRegion)
            : states;
        setAvailableStates(filteredStates);
      } catch (error) {
        console.error("Failed to load states:", error);
        setAvailableStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };

    loadStates();
  }, [selectedCountry, selectedRegion, shouldSelectRegionFirst]);

  // Clear state value if no country is selected or if state doesn't belong to current country
  useEffect(() => {
    if (!selectedCountry) {
      if (selectedState) {
        propertiesStore.setPropertyStringValue(id, undefined);
      }
      return;
    }

    if (shouldSelectRegionFirst) {
      if (selectedState) {
        propertiesStore.setPropertyStringValue(id, undefined);
      }
      return;
    }

    // If a state is selected but it doesn't belong to the current country, clear it
    // Use fuzzy matching to avoid missing states due to slight name variations
    if (selectedState && availableStates.length > 0) {
      const isStateValid = availableStates.some((s) =>
        isFuzzyMatch(selectedState, s.name, 0.8)
      );
      if (!isStateValid) {
        propertiesStore.setPropertyStringValue(id, undefined);
      }
    }
  }, [selectedCountry, selectedState, availableStates, id, propertiesStore, shouldSelectRegionFirst]);


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
    if (shouldSelectRegionFirst) {
      return "Select region first";
    }
    if (!selectedState) {
      return placeholder;
    }
    return selectedState;
  };

  const isDisabled = isLocked || !selectedCountry || shouldSelectRegionFirst;

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {stateLabel}
      </label>

      <Popover
        open={open && !isDisabled}
        onOpenChange={(open) => !isDisabled && setOpen(open)}
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
                !isValueHidden && !selectedState && "text-text-weak"
              )}
            >
              <span
                className={classNames(
                  "text-display-15 truncate",
                  isDisabled || !selectedState || isValueHidden || isEditingLockType
                    ? "text-text-weak font-[400]"
                    : "text-white font-[400]"
                )}
              >
                {!selectedCountry ? "Select country first" : getDisplayValue()}
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

        <PopoverContent className="w-[255px] max-h-[200px] min-h-[200px] overflow-y-auto" alignOffset={-38} align="start">
          <Command>
            <CommandInput placeholder="Search states..." />
            <CommandGroup className="[&_[cmdk-group-items]]:gap-[0px]">
              <CommandItem
                key="none"
                value="none"
                onSelect={() => onSelect("none")}
                className={classNames(
                  "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group italic text-white"
                )}
              >
                None
              </CommandItem>

              {isLoadingStates && (
                <CommandItem
                  key="loading"
                  value=""
                  disabled
                  className={classNames(
                    "font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                  )}
                >
                  Loading states...
                </CommandItem>
              )}

              {!(!isValueHidden && !isEditingLockType) &&
                !selectedCountry &&
                !isLoadingStates && (
                <CommandItem
                  key="no-country"
                  value=""
                  disabled
                  className={classNames(
                    "font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                  )}
                >
                  Please select a country first
                </CommandItem>
              )}

              {!isLoadingStates &&
                shouldSelectRegionFirst && (
                  <CommandItem
                    key="no-region"
                    value=""
                    disabled
                    className={classNames(
                      "font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                    )}
                  >
                    Select region first
                  </CommandItem>
                )}

              {!isLoadingStates &&
                availableStates.length === 0 &&
                selectedCountry &&
                !shouldSelectRegionFirst && (
                <CommandItem
                  key="no-states"
                  value=""
                  disabled
                  className={classNames(
                    "font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                  )}
                >
                  No states available
                </CommandItem>
              )}

              {!isLoadingStates && availableStates.map((state) => {
                return (
                  <CommandItem
                    key={state.code}
                    value={state.name}
                    onSelect={() => onSelect(state.name)}
                    className={classNames(
                      "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group text-white",
                      selectedState && isFuzzyMatch(selectedState, state.name, 0.8) && "text-strong-green"
                    )}
                  >
                    {state.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
