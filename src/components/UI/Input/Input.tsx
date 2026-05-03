import classNames from "classnames";
import { forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip/tooltip";
import { Info } from "~/icons/ui/Info";
import { TooltipArrow } from "@radix-ui/react-tooltip";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  tooltipText?: string;
  noErrorPlaceholder?: boolean;
  labelShifted?: boolean;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
export const Input = forwardRef<Ref, InputProps>(
  (
    {
      className,
      label,
      error,
      labelShifted,
      disabled,
      tooltipText,
      noErrorPlaceholder,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={classNames(
          className,
          "w-full",
          disabled ? "opacity-50 pointer-events-none text-gray-moderate" : ""
        )}
      >
        <div className="flex flex-row items-center gap-[6px]">
          <label
            htmlFor={label}
            className={classNames("text-display-16 font-semibold text-text-weak", labelShifted ? "pl-[10px]" : "")}
          >
            {label}
          </label>

          {tooltipText && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="text-text-weak" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                  <TooltipArrow className="fill-gray-moderate" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <input
          ref={ref}
          id={label}
          disabled={disabled}
          className={classNames(
            error
              ? "ring-strong-error"
              : "focus:ring-strong-green hover:ring-hover-2 ",
            `mt-[7px] block w-full rounded-[12px] border-0 bg-b1-black px-[12px] py-[12px] text-body-2 text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-gray-3`
          )}
          {...props}
        ></input>
        {!noErrorPlaceholder && (
          <p
            className={classNames(
              "ml-[12px] mt-[6px] text-display-12 text-strong-error",
              error ? "opacity-100" : "opacity-0"
            )}
          >
            {error ? error : "placeholder error"}
          </p>
        )}
      </div>
    );
  }
);
