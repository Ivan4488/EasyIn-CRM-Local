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
import { loadCountriesData, CountryData } from "~/constants/countries";

interface Props {
  id: string;
}

export const CountrySelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const propertiesStore = usePropertiesStore();
  const ref = useRef<HTMLDivElement>(null);
  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const selectedCountry = property?.stringValue;
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const placeholder = isValueHidden
    ? ""
    : selectedCountry ?? property?.placeholder;
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  // Load countries data on mount
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const data = await loadCountriesData();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);


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
    if (isValueHidden || !selectedCountry) {
      return placeholder;
    }
    
    // Handle projection locally
    const country = countries.find(c => c.name === selectedCountry);
    if (!country) return selectedCountry;
    
    if (property?.valueProjection?.dataset === "country") {
      if (property.valueProjection.format === "alpha_2") {
        return country.iso2;
      }
    }
    return selectedCountry;
  };

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {title}
      </label>

      <Popover
        open={open && !isLocked}
        onOpenChange={(open) => !isLocked && setOpen(open)}
      >
        <div className="relative h-[38px]" ref={ref}>
          {isValueHidden && !isEditingLockType && (
            <HiddenLine className="!w-[150px]" />
          )}

          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={open}
              disabled={isLocked}
              className={classNames(
                "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                isEditingLockType ? "pointer-events-none" : "",
                "flex items-center justify-between pr-[12px] min-h-[38px] w-full font-semibold bg-black-moderate border border-gray-moderate border-solid text-text-weak hover:border-hover-2",
                isLocked ? "cursor-not-allowed" : "",
                isValueHidden && "text-text-weak",
                !isValueHidden && !selectedCountry && "text-text-weak"
              )}
            >
              <span
                className={classNames(
                  "text-display-15 truncate",
                  isLocked || !selectedCountry || isValueHidden || isEditingLockType
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

        <PopoverContent className="w-[255px] max-h-[200px] min-h-[200px] overflow-y-auto" alignOffset={-38} align="start">
          <Command>
            <CommandInput placeholder="Search countries..." />
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

              {isLoadingCountries && (
                <CommandItem
                  key="loading"
                  value=""
                  disabled
                  className={classNames(
                    "font-semibold text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] italic text-text-weak"
                  )}
                >
                  Loading countries...
                </CommandItem>
              )}

              {!isLoadingCountries && countries.map((country) => {
                // Handle projection locally
                let displayValue = country.name;
                if (property?.valueProjection?.dataset === "country") {
                  if (property.valueProjection.format === "alpha_2") {
                    displayValue = country.iso2;
                  }
                }

                return (
                  <CommandItem
                    key={country.iso2}
                    value={country.name}
                    onSelect={() => onSelect(country.name)}
                    className={classNames(
                      "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group text-white",
                      selectedCountry === country.name && "text-strong-green"
                    )}
                  >
                    {displayValue}
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

