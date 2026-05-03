import classNames from "classnames";
import * as React from "react";

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
import { Arrow } from "~/icons/ui/Arrow";
import { CollapsibleList } from "./CollapsibleList"

type CollapsibleListItem = {
  value: string;
  title: string;
  subtitle?: string;
  isDisabled?: boolean;
}

export type ComboboxItem = 
  | {
      type?: 'item';
      value: string;
      label: string;
      isDisabled?: boolean;
    }
  | {
      type: 'separator';
    }
  | {
    type: 'collapsible-list';
    value: string;
    label: string;
    isDisabled?: boolean;
    items: CollapsibleListItem[];
  }

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  hoverBg?: boolean;
  onChange: (value: string) => void;
  align?: "start" | "end";
  name?: string;
  trigger?: React.ReactNode;
  disabled?: boolean;
  noHoverTrigger?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Combobox = ({
  items,
  value,
  hoverBg = true,
  onChange,
  align,
  name,
  trigger,
  noHoverTrigger = false,
  disabled = false,
  onOpenChange,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  // Find the selected item
  const selectedItem = items.find(
    (item) => item.type !== 'separator' && item.type !== 'collapsible-list' && item.value === value
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        asChild
        className="flex w-fit"
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="combobox"
          aria-expanded={open}
          className={classNames(
            "flex items-center rounded text-display-12 font-bold text-text-weak",
            open && "opacity-50 bg-hover-1 hover:border-hover-1",
            noHoverTrigger
              ? ""
              : hoverBg
                ? disabled
                  ? ""
                  : "hover:bg-hover-1 px-[8px] py-[5px]"
              : "hover:border-hover-2 border border-transparent"
          )}
        >
          {trigger ? (
            <>{trigger}</>
          ) : (
            <>
              {name && <span className="mr-2">{name}</span>}
              {selectedItem && 'label' in selectedItem ? selectedItem.label : null}

              <Arrow
                className={classNames(
                  "ml-[4px] transition-all w-[8px]",
                  open ? "rotate-180" : ""
                )}
              />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[154px]"
        side="bottom"
        align={align}
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandGroup>
            {items.map((item, index) => {
              switch (item.type) {
                case 'separator':
                  return (
                    <div key={`separator-${index}`} className="h-px bg-gray-moderate" />
                  );
                case 'collapsible-list':
                  return (
                    <CollapsibleList 
                      key={item.value}
                      item={item} 
                      value={value}
                      onChange={onChange}
                      onClose={() => setOpen(false)}
                    />
                  );
                default:
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      disabled={item.isDisabled}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={classNames(
                        "font-semibold cursor-pointer",
                        value === item.value && "text-strong-green"
                      )}
                    >
                      {item.label}
                    </CommandItem>
                  );
              }
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
