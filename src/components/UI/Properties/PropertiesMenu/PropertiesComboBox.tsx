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
import { ComboboxItem } from "../../Combobox/Combobox";
import { CollapsibleList } from "../../Combobox/CollapsibleList";

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  align?: "start" | "end";
  name?: string;
  trigger?: React.ReactNode;
  height?: number;
}

export const PropertiesComboBox = ({
  items,
  value,
  onChange,
  align,
  name,
  trigger,
  height,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [side, setSide] = React.useState<"top" | "bottom">("bottom");
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Calculate available space and determine side
  const calculateSide = React.useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Estimate popover height (approximate based on items)
    const estimatedPopoverHeight = Math.min(items.length * 36 + 16, 200); // 36px per item + padding, max 200px

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    // If there's not enough space below but enough above, show it above
    if (
      spaceBelow < estimatedPopoverHeight &&
      spaceAbove >= estimatedPopoverHeight
    ) {
      setSide("top");
    } else {
      setSide("bottom");
    }
  }, [items.length]);

  // Recalculate side when opening
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      calculateSide();
    }
    setOpen(newOpen);
  };

  // Find the selected item
  const selectedItem = items.find(
    (item) => item.type !== "separator" && item.type !== "collapsible-list" && item.value === value
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        asChild
        className="flex w-fit"
        style={{
          height: height ? `${height}px` : "38px",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          className={classNames(
            "flex items-center px-[8px] rounded-r-[8px] text-display-12 font-bold py-[5px] hover:bg-hover-1 border border-solid border-gray-moderate text-text-weak",
            open && "opacity-50"
          )}
        >
          {trigger ? (
            <>{trigger}</>
          ) : (
            <>
              {name && <span className="mr-2">{name}</span>}
              {selectedItem && "label" in selectedItem
                ? selectedItem.label
                : null}

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
        className="w-[217px]"
        side={side}
        align={align}
        sideOffset={6}
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandGroup>
            {items.map((item, index) => {
              switch (item.type) {
                case "separator":
                  return (
                    <div
                      key={`separator-${index}`}
                      className="h-px bg-gray-moderate"
                    />
                  );
                case "collapsible-list":
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
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={classNames(
                        "font-semibold cursor-pointer",
                        value === item.value && "text-strong-green",
                        item.isDisabled &&
                          "opacity-50 cursor-not-allowed pointer-events-none"
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
