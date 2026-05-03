import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select/select";
import { PropertyType } from "~/stores/propertiesStore";
import { isPropertyConvertible } from "~/lib/utils/isPropertyConvertible";
import classNames from "classnames"

interface SelectItem {
  value: string;
  label: string;
}

interface Props {
  items: SelectItem[];
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
  currentType?: PropertyType;
  isEditProperty?: boolean;
  disabled?: boolean;
}

export const Selector = ({
  items,
  label,
  placeholder,
  onChange,
  value,
  currentType,
  isEditProperty,
  disabled,
}: Props) => {
  const [open, setOpen] = useState(false);

  const isConvertible = (value: string) => {
    return currentType
      ? isPropertyConvertible(currentType, value as PropertyType)
      : true;
  };

  return (
    <div className={classNames("flex flex-col gap-[6px]", disabled ? "opacity-50 pointer-events-none text-gray-moderate" : "")}>
      <label className="text-display-16 font-semibold text-text-weak px-[12px]">
        {label}
      </label>

      <Select
        onOpenChange={(open) => setOpen(open)}
        onValueChange={onChange}
        value={value}
        disabled={disabled}
      >
        <SelectTrigger
          className="w-full h-[48px] rounded-[12px]"
          height={48}
          open={open}
          disabled={disabled}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-[8px]">
          <SelectGroup>
            {items.map((item) => {
              return (
                <SelectItem
                  value={item.value}
                  key={item.value}
                  disabled={
                    (!isConvertible(item.value) && isEditProperty) ||
                    item.value === "STATE_SELECT" ||
                    item.value === "REGION_SELECT" ||
                    item.value === "CITY_SELECT"
                  }
                >
                  {item.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
