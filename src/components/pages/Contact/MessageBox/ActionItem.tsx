import classNames from "classnames";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/UI/Tooltip/tooltip";
import { Tooltip } from "~/components/UI/Tooltip/tooltip";

interface ActionItemProps {
  text: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  disabledText?: string;
}

export const ActionItem = ({
  text,
  onClick,
  isActive,
  isDisabled,
  disabledText,
}: ActionItemProps) => {
  return (
    <button
      className={classNames(
        "w-fit flex flex-col group",
        isDisabled ? "cursor-default" : "cursor-pointer"
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      {isDisabled ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <div
                className={classNames(
                  "text-display-12 font-bold text-text-disabled",
                )}
              >
                {text}
              </div>
            </TooltipTrigger>

            <TooltipContent>{disabledText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          className={classNames(
            "text-display-12 font-bold",
            isActive ? "text-text-moderate" : "text-text-weak"
          )}
        >
          {text}
        </div>
      )}
      <div
        className={classNames(
          "h-[1px] w-full ",
          isDisabled ? "" : "group-hover:visible",
          isActive && !isDisabled
            ? "visible bg-hover-2"
            : "invisible bg-text-moderate"
        )}
      />
    </button>
  );
};
