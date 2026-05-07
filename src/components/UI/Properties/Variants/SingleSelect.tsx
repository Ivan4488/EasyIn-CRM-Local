import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Select/select";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "../PropertiesLockTypeEdit/LocksDescription";
import classNames from "classnames";
import { HiddenLine } from "../PropertiesLockTypeEdit/HiddenLine";
import { projectOptionValue } from "~/utils/projection/projectOptionValue";

interface SelectItem {
  value: string;
  label: string;
}

interface Props {
  id: string;
}

export const SingleSelect = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const propertiesStore = usePropertiesStore();
  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const values = property?.values;
  const selectedValue = property?.selectedValues?.[0];
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const placeholder = isValueHidden
    ? ""
    : selectedValue ?? property?.placeholder;
  const [resetKey, setResetKey] = useState(0);
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  useEffect(() => {
    if (!selectedValue) {
      setResetKey((resetKey) => resetKey + 1);
    }
  }, [selectedValue]);

  const onSelect = (value: string) => {
    if (value === "none") {
      propertiesStore.clearPropertyValues(id);
      setResetKey((resetKey) => resetKey + 1);
    } else {
      propertiesStore.selectPropertyValue(id, value);
    }
  };

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-display-14 font-semibold text-text-weak">
        {title}
      </label>

      <Select
        onOpenChange={(open) => setOpen(open)}
        onValueChange={onSelect}
        value={isValueHidden ? undefined : selectedValue}
        key={resetKey}
        disabled={isLocked}
      >
        <div className="relative h-[38px]">
          {isValueHidden && !isEditingLockType && (
            <HiddenLine className="!w-[150px]" />
          )}
          <SelectTrigger
            className={classNames(
              "w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px] rounded-none",
              isEditingLockType ? "pointer-events-none" : ""
            )}
            open={open}
            menu={
              <PropertiesMenu
                propertyId={id}
                disableLock={!propertiesStore.getShowMailbox()}
              />
            }
            mailbox={
              <>
                <PropertiesMailbox propertyId={id} propertyHeight={38} />
                {isEditingLockType && <LocksDescription propertyId={id} />}
              </>
            }
          >
            <SelectValue
              placeholder={isEditingLockType ? "Choose" : placeholder}
            />
          </SelectTrigger>
        </div>
        <SelectContent
          className="w-[255px] max-h-[200px] min-h-[200px] overflow-y-auto"
          alignOffset={-38}
          hideScrollButtons
        >
          <SelectGroup>
            <SelectItem key="none" value="none" className="italic">
              None
            </SelectItem>

            {values?.map((value) => {
              const displayValue = projectOptionValue(
                value.value,
                property?.valueProjection
              );
              return (
                <SelectItem key={value.value} value={value.id}>
                  {displayValue}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
