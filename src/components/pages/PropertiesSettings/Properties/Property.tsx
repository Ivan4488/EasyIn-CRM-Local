import { TooltipArrow } from "@radix-ui/react-tooltip";
import classNames from "classnames";
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/UI/Tooltip/tooltip";
import { Check } from "~/icons/ui/Check";
import { useSelectorStore } from "~/stores/select";

interface Props {
  name: string;
  id: string;
  onEdit: () => void;
  isRequired: boolean;
  isSystemControlled?: boolean;
}

const selectorKey = "properties";

export const Property = ({
  name,
  id,
  onEdit,
  isRequired,
  isSystemControlled = false,
}: Props) => {
  const selectedItem = { id, type: name };
  const isSelected = useSelectorStore((state) =>
    state.isSelected(selectedItem, selectorKey)
  );

  const onSelectHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      useSelectorStore.getState().deselectItem(selectedItem, selectorKey);
    } else {
      useSelectorStore.getState().selectItem(selectedItem, selectorKey);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const isLockedFromSettings = isRequired || isSystemControlled;

  const tooltipText = isSystemControlled
    ? "This property is controlled by EasyIn. You can't remove or edit it."
    : "This property is required by the system. You can't remove or edit it.";

  return (
    <TooltipProvider delayDuration={0} >
      <Tooltip
        onOpenChange={(open) => setIsOpen(isLockedFromSettings && open)}
        open={isOpen}
      >
        <TooltipTrigger className="cursor-default">
          <div
            className={classNames(
              "border border-gray-moderate bg-black-moderate rounded-[12px] h-[38px] flex flex-row items-center justify-start relative",
              isLockedFromSettings &&
                "pointer-events-none after:content-[''] after:absolute after:inset-0 after:bg-black-weak/50 after:rounded-[12px]"
            )}
          >
            <div className="flex flex-row h-[38px] items-center w-fit">
              <div
                onClick={onSelectHandler}
                className={classNames(
                  "flex h-[36px] group w-[36px] items-center text-gray-moderate justify-center rounded-bl-[12px] rounded-tl-[12px] bg-b1-black bg-gradient-2 p-[12px] cursor-pointer",
                  isSelected && "bg-strong-green",
                  !isSelected && "hover:bg-hover-1 hover:text-hover-2",
                  isLockedFromSettings && "pointer-events-none"
                )}
              >
                {!isSelected && (
                  <div
                    className={classNames(
                      "group-hover:hidden block",
                      isLockedFromSettings && "pointer-events-none"
                    )}
                  >
                    <Check />
                  </div>
                )}
                {!isSelected && (
                  <div
                    className={classNames(
                      "group-hover:block hidden",
                      isLockedFromSettings && "pointer-events-none"
                    )}
                  >
                    <Check />
                  </div>
                )}

                {isSelected && (
                  <div
                    className={classNames(
                      "text-black-moderate",
                      isLockedFromSettings && "pointer-events-none"
                    )}
                  >
                    <Check />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onEdit}
              className={classNames(
                "w-full h-[38px] rounded-r-[12px] text-[15px] flex flex-row items-center justify-between px-[12px] group hover:bg-hover-1",
                isLockedFromSettings
                  ? "pointer-events-none text-disabled"
                  : "text-text-strong"
              )}
            >
              <p>{name}</p>
              <div className="flex items-center">
                <div
                  className={classNames(
                    "mr-2 cursor-pointer font-[500] text-[15px]",
                    isLockedFromSettings
                      ? "pointer-events-none text-disabled"
                      : "text-text-weak group-hover:text-hover-2"
                  )}
                >
                  Edit
                </div>
              </div>
            </button>
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <p>{tooltipText}</p>
          <TooltipArrow className="fill-gray-moderate" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
