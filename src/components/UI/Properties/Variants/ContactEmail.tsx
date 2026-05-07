import classNames from "classnames";
import { forwardRef, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/tooltip";
import { Info } from "~/icons/ui/Info";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../PropertiesMenu/PropertiesMenu";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore"
import { z } from "zod"
import { PropertiesMailbox } from "../PropertiesMailbox/PropertiesMailbox"
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
  tooltipText?: string;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
export const ContactEmail = forwardRef<Ref, InputProps>(
  ({ className, id, error, disabled, tooltipText, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const label = propertiesStore.getPropertyById(id)?.title;
    const placeholder = propertiesStore.getPropertyById(id)?.placeholder;

    const rightMenuNavigationStore = useRightMenuNavigationStore();
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType =
      propertiesStore.activeEditingLockTypePropertyId === id;

    const value = propertiesStore.getPropertyById(id)?.stringValue;
    const [initialValue, setInitialValue] = useState<string | null>(null);
    const isValueChanged = initialValue !== null && (value ?? "") !== initialValue;
    const warningText = isValueChanged && propertiesStore.propertiesContext === "team" ?
      "After changing the email address, you will receive an email with a link to confirm the change." : undefined;

    const validateContactEmail = (value: string) => {
      if (value === "" || !value) {
        return;
      }

      const isValid = z.string().email().safeParse(value).success;

      propertiesStore.setPropertyValidation({
        id,
        isValid,
        error: isValid ? undefined : "Invalid email address",
      });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      propertiesStore.setPropertyStringValue(id, e.target.value);
      validateContactEmail(e.target.value);
    };

    useEffect(() => {
      rightMenuNavigationStore.setContactEmailPropertyId(id);
      setInitialValue(null);
    }, [id]);

    useEffect(() => {
      if (propertiesStore.isPropertiesLoading || initialValue !== null) {
        return;
      }
      setInitialValue(value ?? "");
    }, [initialValue, propertiesStore.isPropertiesLoading, value]);

    return (
      <div
        className={classNames(
          className,
          "w-full",
          disabled ? "opacity-50 pointer-events-none text-gray-moderate" : ""
        )}
      >
        <div className="flex flex-row items-center gap-[6px] mb-[6px]">
          <label
            htmlFor={label}
            className="text-display-14 font-semibold text-text-weak"
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
        <div className="relative h-[38px]">
          {isValueHidden && !isEditingLockType && <HiddenLine />}
          <input
            ref={ref}
            id={label}
            disabled={
              disabled || isLocked || isEditingLockType || isValueHidden
            }
            value={
              isEditingLockType ? "Choose" : isValueHidden ? "" : value ?? ""
            }
            onChange={onInputChange}
            className={classNames(
              "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
              isEditingLockType
                ? "pointer-events-none"
                : "",
              error
                ? "ring-strong-error"
                : "focus:ring-strong-green hover:ring-hover-2",
              `block w-full border-0 bg-b1-black px-[12px] py-[8px] text-display-15 font-[400] text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-text-weak`
            )}
            placeholder={placeholder}
            {...props}
          />
          <PropertiesMailbox propertyId={id} propertyHeight={38} warningText={warningText}/>
          <PropertiesMenu propertyId={id} disableLock={!propertiesStore.getShowMailbox()}/>
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
