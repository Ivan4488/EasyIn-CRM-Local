import classNames from "classnames";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/UI/Select/select";
import { AddCircle } from "~/icons/ui/AddCircle";
import {
  Property,
  usePropertiesStore,
} from "~/stores/propertiesStore";

interface SelectItem {
  value: string;
  label: string;
}

interface Props {
  items: Property[];
}

export const PropertiesSelect = ({ items }: Props) => {
  const [open, setOpen] = useState(false);

  const isAdded = (id: string) => {
    return usePropertiesStore
      .getState()
      .isPropertyInActiveProperties(id);
  };

  const [key, setKey] = useState<number>(0);

  const onAdd = (value: string) => {
    setKey((prev) => prev + 1);
    const property = items.find((item) => item.id === value);
    if (!property) {
      return;
    }

    console.log(isAdded(property.id), "is added");

    if (isAdded(property.id)) {
      return;
    }

    usePropertiesStore.getState().addPropertyToActive(property);
  };

  useEffect(() => {
    if (open) {
      document.body.style.setProperty("overflow-y", "hidden", "important");
    } else {
      document.body.style.removeProperty("overflow-y");
    }
  }, [open]);

  return (
    <div className="flex flex-col gap-[6px] text-text-weak">
      <Select
        onOpenChange={(open) => setOpen(open)}
        open={open}
        value={key.toString()}
        onValueChange={(value) => onAdd(value)}
      >
        <SelectTrigger
          className={classNames(
            "w-full !text-text-weak",
            open ? "ring-strong-green" : ""
          )}
          open={open}
        >
          <div className="w-full flex flex-row justify-start gap-[12px]">
            <AddCircle className="fill-black-moderate text-text-weak" />

            <p>Add properties</p>
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {items.map((item) => {
              return (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  className="data-[state=checked]:text-white group cursor-pointer"
                  onClick={() => onAdd(item.id)}
                >
                  <div
                    className={classNames(
                      "flex flex-row items-center justify-between gap-[8px]",
                      isAdded(item.id) ? "text-text-disabled" : ""
                    )}
                  >
                    <div className="flex flex-row items-center gap-[8px]">
                      {isAdded(item.id) && <Check className="w-[18px]" />}
                      {item.title}
                    </div>

                    {isAdded(item.id) ? (
                      <p className="group-hover:block hidden text-text-weak text-[12px] font-medium">
                        Added
                      </p>
                    ) : (
                      <p className="group-hover:block hidden text-strong-green text-[12px] font-medium">
                        Add
                      </p>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
