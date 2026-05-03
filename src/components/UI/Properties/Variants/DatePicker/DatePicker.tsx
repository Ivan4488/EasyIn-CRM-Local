"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../Popover/Popover";
import { Calendar } from "../../../Calendar/calendar";
import classNames from "classnames";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { HiddenLine } from "../../PropertiesLockTypeEdit/HiddenLine";
import { Checkbox } from "~/components/UI/Checkbox/Checkbox";
import { BIRTHDAY_PLACEHOLDER_YEAR } from "~/utils/birthday";

interface Props {
  id: string;
}

export const DatePicker = ({ id }: Props) => {
  const propertiesStore = usePropertiesStore();
  const property = usePropertiesStore.getState().getPropertyById(id);
  const title = property?.title;
  const date = property?.dateValue;

  const isYearUnknown = date ? date.getFullYear() === BIRTHDAY_PLACEHOLDER_YEAR : false;

  // Create a display date with current year for calendar visualization when year is unknown
  const displayDate = date && isYearUnknown
    ? new Date(new Date().getFullYear(), date.getMonth(), date.getDate())
    : date;

  const formattedDate = date
    ? isYearUnknown
      ? format(date, "MMM d")
      : format(date, "PPP")
    : undefined;
  const isLocked = propertiesStore.isPropertyLocked(id);
  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const isEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === id;

  const { setPropertyDateValue } = usePropertiesStore.getState();

  const handleYearUnknownChange = (checked: boolean) => {
    if (!date) return;
    
    if (checked) {
      // Set year to placeholder year
      const newDate = new Date(date);
      newDate.setFullYear(BIRTHDAY_PLACEHOLDER_YEAR);
      setPropertyDateValue(id, newDate);
    } else {
      // Set year to current year
      const newDate = new Date(date);
      newDate.setFullYear(new Date().getFullYear());
      setPropertyDateValue(id, newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || isLocked || isEditingLockType) return;
    
    // If year unknown is checked, store with placeholder year
    if (isYearUnknown) {
      const storedDate = new Date(BIRTHDAY_PLACEHOLDER_YEAR, selectedDate.getMonth(), selectedDate.getDate());
      setPropertyDateValue(id, storedDate);
    } else {
      setPropertyDateValue(id, selectedDate);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-display-14 text-text-weak font-semibold mb-[6px]">
        {title}
      </label>
      <Popover>
        <div className="relative group h-[38px]">
          {isValueHidden && !isEditingLockType && <HiddenLine />}

          <PopoverTrigger
            className="hover:ring-hover-2 data-[state=open]:ring-strong-green cursor-pointer flex w-fit"
            asChild
            disabled={isLocked || isEditingLockType}
          >
            <div
              className={classNames(
                "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                date && !isValueHidden ? "text-white" : "text-gray-2/40",
                isEditingLockType ? "pointer-events-none" : "",
                "flex flex-row items-center h-[38px] ring-1 ring-inset ring-gray-moderate hover:ring-hover-2 focus:ring-strong-green pr-[12px] bg-black-moderate",
                isLocked || isEditingLockType
                  ? "!text-text-weak pointer-events-none"
                  : ""
              )}
            >
              <p>
                {isEditingLockType ? (
                  "Choose"
                ) : isValueHidden ? (
                  ""
                ) : date ? (
                  formattedDate
                ) : (
                  <></>
                )}
              </p>
            </div>
          </PopoverTrigger>
          <PropertiesMailbox propertyId={id} propertyHeight={38} />
          <PropertiesMenu
            propertyId={id}
            disableLock={!propertiesStore.getShowMailbox()}
          />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
        <PopoverContent
          className="w-full p-0"
          alignOffset={-50}
          align="start"
        >
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={handleDateSelect}
            initialFocus
            hideYear={isYearUnknown}
          />
          {date && (
            <div className="flex items-center gap-2 px-3 pb-3 pt-1 border-t border-gray-moderate mt-2">
              <Checkbox
                isChecked={isYearUnknown}
                onChange={handleYearUnknownChange}
              />
              <span
                className="text-sm text-text-weak cursor-pointer select-none"
                onClick={() => handleYearUnknownChange(!isYearUnknown)}
              >
                Year unknown
              </span>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
