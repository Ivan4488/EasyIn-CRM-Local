import { useState } from "react"
import classNames from "classnames"
import { ComboboxItem } from "./Combobox"
import { CommandItem } from "~/components/UI/Popover/Command"
import { Arrow } from "~/icons/ui/Arrow"

interface CollapsibleListProps {
  item: ComboboxItem & { type: 'collapsible-list' }
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export const CollapsibleList = ({ item, value, onChange, onClose }: CollapsibleListProps) => {
  if (item.type !== "collapsible-list") {
    return null;
  }

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleItemSelect = (selectedValue: string) => {
    onChange(selectedValue === value ? "" : selectedValue);
    onClose();
  };

  return (
    <>
      {/* Trigger item */}
      <CommandItem
        onSelect={handleToggle}
        disabled={item.isDisabled}
        className={classNames(
          "font-semibold cursor-pointer justify-between",
          item.isDisabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <span>{item.label}</span>
        <Arrow
          className={classNames(
            "w-[8px] transition-all text-text-weak",
            open ? "" : "rotate-180"
          )}
        />
      </CommandItem>

      {/* Expanded items */}
      {open && item.items.map((subItem) => (
        <CommandItem
          key={subItem.value}
          value={subItem.value}
          disabled={subItem.isDisabled}
          onSelect={() => handleItemSelect(subItem.value)}
          className={classNames(
            "font-semibold cursor-pointer pl-[16px]",
            value === subItem.value && "text-strong-green",
            subItem.isDisabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <div className="flex flex-col">
            <span className="text-display-12">{subItem.title}</span>
            {subItem.subtitle && (
              <span className="text-display-12 text-text-weak">{subItem.subtitle}</span>
            )}
          </div>
        </CommandItem>
      ))}
    </>
  );
};