import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../Popover/Popover";
import classNames from "classnames";
import { Arrow } from "~/icons/ui/Arrow";
import { Command, CommandGroup, CommandItem } from "../../../Popover/Command";
import { RefObject, useEffect, useRef, useState } from "react";
import { Chip } from "./Chip";
import { Checkbox } from "../../../Checkbox/Checkbox";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { projectOptionValue } from "~/utils/projection/projectOptionValue";

interface Props {
  id: string;
}

export const MultiSelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);

  const propertiesStore = usePropertiesStore();

  const contactProperty = usePropertiesStore.getState().getPropertyById(id);

  const selectedValues = contactProperty?.selectedValues || [];
  const values = contactProperty?.values || [];
  const title = contactProperty?.title || "";
  const placeholder = contactProperty?.placeholder || "";
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  const [propertyHeight, setPropertyHeight] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);

  const onAdd = (value: string) => {
    propertiesStore.selectPropertyValue(id, value);
  };

  const onDelete = (value: string) => {
    propertiesStore.removePropertyValue(id, value);
  };

  useEffect(() => {
    if (ref.current) {
      setPropertyHeight(ref.current.clientHeight);
    }
  }, [selectedValues]);

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {title}
      </label>

      <Popover open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
        <div
          className="relative"
          style={{ height: propertyHeight ? `${propertyHeight + 2}px` : "38px" }}
        >
          {isValueHidden && !isEditingLockType && (
            <HiddenLine className="!w-[150px]" />
          )}
          <PopoverTrigger
            asChild
            className="flex w-fit"
            disabled={isLocked || isEditingLockType}
          >
            <button
              ref={ref}
              // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
              role="combobox"
              aria-expanded={open}
              disabled={isLocked || isEditingLockType}
              className={classNames(
                "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                isEditingLockType ? "pointer-events-none" : "",
                "flex items-center justify-between pr-[12px] min-h-[38px] w-full font-semibold bg-black-moderate border border-gray-moderate text-text-weak hover:border-hover-2",
                isLocked || isEditingLockType ? "pointer-events-none" : ""
              )}
            >
              <div
                className={classNames(
                  "flex flex-row flex-wrap gap-[8px] py-[5px]"
                )}
              >
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
                    {selectedValues.map((value) => {
                      const option = values.find((item) => item.id === value);
                      const projectedLabel = option
                        ? projectOptionValue(
                            option.value,
                            contactProperty?.valueProjection
                          )
                        : "";
                      return (
                        <Chip
                          isLocked={isLocked}
                          key={value}
                          label={projectedLabel}
                          onDelete={() =>
                            onDelete(
                              values.find((item) => item.id === value)?.id || ""
                            )
                          }
                        />
                      );
                    })}
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
            disableLock={!propertiesStore.getShowMailbox()}
          />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>

        <PopoverContent className="w-[255px]" align="start" alignOffset={-38}>
          <Command>
            <CommandGroup className="[&_[cmdk-group-items]]:gap-[0px] max-h-[200px] min-h-[200px] overflow-y-auto">
              {values.map((value) => {
                const displayValue = projectOptionValue(
                  value.value,
                  contactProperty?.valueProjection
                );
                return (
                  <CommandItem
                    key={value.id}
                    value={value.value}
                    onSelect={() => {
                      if (selectedValues.includes(value.id)) {
                        onDelete(value.id);
                      } else {
                        onAdd(value.id);
                      }
                    }}
                    className={classNames(
                      "font-semibold cursor-pointer text-display-15 px-[12px] py-[8px] flex flex-row items-center gap-[8px] group"
                    )}
                  >
                    <Checkbox
                      isChecked={selectedValues.includes(value.id)}
                      onChange={() => {
                        void 0;
                      }}
                    />
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
