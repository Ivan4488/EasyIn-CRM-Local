import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/Popover/Popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/UI/Popover/Command";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "../../PropertiesLockTypeEdit/LocksDescription";
import { HiddenLine } from "../../PropertiesLockTypeEdit/HiddenLine";
import { loadLanguagesData, LanguageData } from "~/constants/languages";
import { Chip } from "~/components/UI/Properties/Variants/MultiSelect/Chip";
import { Checkbox } from "~/components/UI/Checkbox/Checkbox";
import { Arrow } from "~/icons/ui/Arrow";

interface Props {
  id: string;
}

export const LanguageMultiSelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [propertyHeight, setPropertyHeight] = useState(0);
  const propertiesStore = usePropertiesStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const selectedValues = property?.selectedValues || [];
  const placeholder = property?.placeholder || "";
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  // Load languages data on mount
  useEffect(() => {
    const loadLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const data = await loadLanguagesData();
        setLanguages(data);
      } catch (error) {
        console.error("Failed to load languages:", error);
      } finally {
        setIsLoadingLanguages(false);
      }
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      setPropertyHeight(buttonRef.current.clientHeight);
    }
  }, [selectedValues]);

  const onAdd = (value: string) => {
    propertiesStore.selectPropertyValue(id, value);
  };

  const onDelete = (value: string) => {
    propertiesStore.removePropertyValue(id, value);
  };

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {title}
      </label>

      <Popover open={open} onOpenChange={(open) => setOpen(open)}>
        <div className="relative" style={{ height: propertyHeight ? `${propertyHeight + 2}px` : "38px" }}>
          {isValueHidden && !isEditingLockType && (
            <HiddenLine className="!w-[150px]" />
          )}

          <PopoverTrigger asChild className="flex w-fit" disabled={isLocked}>
            <button
              ref={buttonRef}
              role="combobox"
              aria-expanded={open}
              className={classNames(
                "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                isEditingLockType ? "pointer-events-none" : "",
                isLocked || isEditingLockType ? "pointer-events-none" : "",
                "flex items-center justify-between pr-[12px] min-h-[38px] w-full font-semibold bg-black-moderate border border-gray-moderate border-solid text-text-weak hover:border-hover-2"
              )}
              disabled={isLocked || isEditingLockType}
            >
              <div className="flex flex-row flex-wrap gap-[8px] py-[5px]">
                {isEditingLockType ? (
                  <span className="text-text-weak text-display-15 font-[400]">
                    Choose
                  </span>
                ) : isValueHidden ? (
                  <></>
                ) : (
                  <>
                    {selectedValues.length === 0 && (
                      <span className="text-text-weak/40 text-display-15 font-[400]">
                        {placeholder}
                      </span>
                    )}
                    {selectedValues.map((value) => (
                      <Chip
                        isLocked={isLocked}
                        key={value}
                        label={value}
                        onDelete={() => onDelete(value)}
                      />
                    ))}
                  </>
                )}
              </div>

              <Arrow
                onClick={() => {
                  setOpen(!open);
                }}
                className={classNames(
                  "ml-[4px] transition-all min-w-[8px] w-[8px] text-text-weak",
                  open ? "rotate-180" : ""
                )}
              />
            </button>
          </PopoverTrigger>

          <PropertiesMailbox
            propertyId={id}
            propertyHeight={isEditingLockType ? 36 : propertyHeight - 2}
          />
          <PropertiesMenu
            propertyId={id}
            propertyHeight={!isEditingLockType ? propertyHeight + 2 : 38}
          />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>

        <PopoverContent className="w-[255px]" alignOffset={-38} align="start">
          <Command>
            <CommandInput placeholder="Search languages..." />
            <CommandGroup className="[&_[cmdk-group-items]]:gap-[0px] max-h-[200px] min-h-[200px] overflow-y-auto">
              {languages.map((language) => {
                const isSelected = selectedValues.includes(language.name);
                return (
                  <CommandItem
                    key={language.code}
                    value={language.name}
                    onSelect={() => {
                      if (isSelected) {
                        onDelete(language.name);
                      } else {
                        onAdd(language.name);
                      }
                    }}
                    className={classNames(
                      "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group"
                    )}
                  >
                    <Checkbox
                      isChecked={isSelected}
                      onChange={() => {
                        void 0;
                      }}
                    />
                    {language.name}
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

