import { useEffect, useMemo, useRef, useState } from "react";
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
import { UK_REGIONS, UkRegion } from "~/constants/ukCeremonialCounties";

interface Props {
  id: string;
}

const UNAVAILABLE_LABEL = "Unavailable";
const UK_COUNTRY_NAME = "United Kingdom";

export const RegionSelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const propertiesStore = usePropertiesStore();
  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const selectedRegion = property?.stringValue;
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const placeholder = isValueHidden ? "" : property?.placeholder || "";
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  const ref = useRef<HTMLDivElement>(null);

  const properties = propertiesStore.properties;
  const countryProperty = properties.find(
    (p) => p.title === "Country of Residence" || p.title === "Company country"
  );
  const selectedCountry = countryProperty?.stringValue;

  const previousCountryRef = useRef<string | undefined>(selectedCountry);

  const availableRegions = useMemo(() => {
    if (selectedCountry === UK_COUNTRY_NAME) {
      return UK_REGIONS;
    }

    return [];
  }, [selectedCountry]);

  useEffect(() => {
    const previousCountry = previousCountryRef.current;
    if (
      selectedCountry === UK_COUNTRY_NAME &&
      previousCountry !== UK_COUNTRY_NAME &&
      selectedRegion
    ) {
      propertiesStore.setPropertyStringValue(id, undefined);
    }
    previousCountryRef.current = selectedCountry;
  }, [
    id,
    propertiesStore,
    selectedCountry,
    selectedRegion,
  ]);

  useEffect(() => {
    const previousCountry = previousCountryRef.current;
    const countryChanged = selectedCountry !== previousCountry;

    if (selectedCountry !== UK_COUNTRY_NAME) {
      // Only auto-set Unavailable when the country actively transitions away from UK.
      // Do NOT overwrite on initial mount - that would dirty the store on load and
      // falsely trigger the Cancel/Update buttons.
      if (countryChanged && selectedRegion !== UNAVAILABLE_LABEL) {
        propertiesStore.setPropertyStringValue(id, UNAVAILABLE_LABEL);
      }
      return;
    }

    if (selectedRegion === UNAVAILABLE_LABEL) {
      propertiesStore.setPropertyStringValue(id, undefined);
      return;
    }

    if (selectedRegion && !availableRegions.includes(selectedRegion as UkRegion)) {
      propertiesStore.setPropertyStringValue(id, UNAVAILABLE_LABEL);
    }
  }, [
    availableRegions,
    id,
    propertiesStore,
    selectedCountry,
    selectedRegion,
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
    if (!selectedRegion) {
      if (selectedCountry === UK_COUNTRY_NAME) {
        return placeholder || "";
      }
      return placeholder || UNAVAILABLE_LABEL;
    }
    return selectedRegion;
  };

  const isDisabled = isLocked || selectedRegion === UNAVAILABLE_LABEL;

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {title}
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
                !isValueHidden && !selectedRegion && "text-text-weak"
              )}
            >
              <span
                className={classNames(
                  "text-display-15 truncate",
                  isDisabled || !selectedRegion || isValueHidden || isEditingLockType
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
            <CommandInput placeholder="Search regions..." />
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

              {availableRegions.map((region) => (
                <CommandItem
                  key={region}
                  value={region}
                  onSelect={() => onSelect(region)}
                  className={classNames(
                    "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group text-white",
                    selectedRegion === region && "text-strong-green"
                  )}
                >
                  {region}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
