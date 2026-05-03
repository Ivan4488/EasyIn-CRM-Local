import React, { useState } from "react";
import classNames from "classnames";

import {
  Command,
  CommandGroup,
  CommandItem,
} from "~/components/UI/Popover/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/Popover/Popover";

interface ComboboxItem {
  value: string;
  label: string;
  isDisabled?: boolean;
}
export interface ComboboxFilterProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  options: ComboboxItem[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

export const ComboboxFilter = ({
  Icon,
  options,
  defaultValue,
  onChange,
}: ComboboxFilterProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options?.[0]?.value
  );

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="combobox"
          aria-expanded={open}
          className={classNames(
            "flex w-full items-center text-display-16 font-semibold hover:bg-hover-1 flex-row gap-[6px] transition-text rounded-[12px] px-[16px] py-[6px]",
            selectedValue !== defaultValue ? "text-strong-green" : "text-text-weak"
          )}
        >
          <div className="p-[10px]">
            <Icon className="w-[20px] h-[20px]" />
          </div>

          <>{options.find((item) => item.value === selectedValue)?.label}</>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[284px] mt-[4px]"
        side="bottom"
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                disabled={item.isDisabled}
                onSelect={(currentValue) => {
                  handleValueChange(currentValue);
                  setOpen(false);
                }}
                onClick={(e) => e.stopPropagation()}
                className={classNames(
                  "font-semibold cursor-pointer",
                  selectedValue === item.value && "text-strong-green"
                )}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
