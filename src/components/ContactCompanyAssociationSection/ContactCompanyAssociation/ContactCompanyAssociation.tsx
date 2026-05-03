import classNames from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react"

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
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Company } from "~/icons/records/Company";
import { Contact } from "~/icons/records/Contact";
import { AddCircle } from "~/icons/ui/AddCircle";
import { Arrow } from "~/icons/ui/Arrow";
import { useAssociationStore } from "~/stores/associationStore"
import {
  PropertiesContext,
  usePropertiesStore,
} from "~/stores/propertiesStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore"

export interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const getIcon = (type: PropertiesContext) => {
  switch (type) {
    case "companies":
      return <Contact />;
    case "contacts":
      return <Company />;
  }
};

export const ContactCompanyAssociation = ({
  items,
  value,
  onChange,
  placeholder = "Add association",
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const { propertiesContext } = usePropertiesStore();
  const [search, setSearch] = useState("");
  const { associatedItems } = useAssociationStore();
  const { setPropertiesSection } = useRightMenuNavigationStore();

  const router = useRouter();

  if (value) {
    return (
      <div
        className="relative flex h-[38px] w-full rounded-[8px] border-0 bg-b1-black outline-none ring-1 ring-inset ring-gray-moderate"
        style={{ overflow: "visible" }}
      >
        {/* Left zone — icon, future click target */}
        <div
          className="flex-shrink-0 flex items-center justify-center text-text-weak border-r border-gray-moderate"
          style={{
            width: 38,
            height: 38,
            borderRadius: "7px 0 0 7px",
            background: "linear-gradient(215deg, rgba(76,155,141,0.15) 0%, rgba(76,155,141,0) 100%)",
          }}
        >
          {getIcon(propertiesContext)}
        </div>

        {/* Right zone — name + arrow, hover and click here */}
        <div
          className="flex items-center min-w-0 flex-1 px-[10px] cursor-pointer hover:bg-hover-1 rounded-r-[7px]"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const link = `/${propertiesContext === "companies" ? "contacts" : "companies"}/${value}`;
            setPropertiesSection("default");
            router.push(link);
          }}
        >
          <p className="truncate text-display-15 font-[600] text-text-weak flex-1">
            {items.find((item) => item.value === value)?.label}
          </p>
          <Arrow className="w-[8px] flex-shrink-0 text-text-weak rotate-90" />
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="button"
          aria-expanded={open}
          className={classNames(
            "relative flex h-[38px] w-full items-center data-[state=open]:ring-strong-green justify-between hover:ring-hover-2 data-[placeholder]:text-text-weak/40 text-white rounded-[8px] border-0 bg-b1-black px-[12px] py-[8px] text-display-15 font-[400] outline-none ring-1 ring-inset ring-gray-moderate transition focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-gray-3"
          )}
        >
          <div className="flex items-center gap-[12px] text-display-15 font-[600] text-text-weak">
            <AddCircle className="w-[20px] h-[20px] fill-b1-black" />
            <p>{placeholder}</p>
          </div>
          <Arrow
            className={classNames(
              "ml-[4px] transition-all w-[8px] right-[10px] absolute text-text-weak",
              open ? "rotate-180" : ""
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[256px]"
        side="bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full px-[8px]">
          <div className="py-[8px] px-[4px]">
            <input
              className="block w-full rounded-[8px] border-0 bg-b1-black px-[12px] py-[7px] text-body-2 text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-gray-3 focus:ring-strong-green hover:ring-hover-2"
              placeholder="Type a name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandGroup>
            <Scrollbar className="max-h-[260px]">
              {items.filter(item => item.label.toLowerCase().includes(search.toLowerCase())).map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  disabled={associatedItems.some((associatedItem) => associatedItem.id === item.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={classNames(
                    "font-semibold cursor-pointer py-[8px] px-[12px]"
                  )}
                >
                  {item.label}
                </CommandItem>
              ))}
            </Scrollbar>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
