import classNames from "classnames";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/UI/Tooltip/tooltip";
import { Info } from "~/icons/ui/Info";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "~/components/UI/Properties/PropertiesMenu/PropertiesMenu";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { parseEmailValue } from "../utils/parseEmailValue";
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
  tooltipText?: string;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
export const AccountSenderEmail = forwardRef<Ref, InputProps>(
  ({ className, id, error, disabled, tooltipText, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const rightMenuNavigationStore = useRightMenuNavigationStore();
    const label = propertiesStore.getPropertyById(id)?.title;
    const placeholder = propertiesStore.getPropertyById(id)?.placeholder;
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType =
      propertiesStore.activeEditingLockTypePropertyId === id;

    const inputRef = useRef<HTMLInputElement>(null);

    const domainPropertyId = rightMenuNavigationStore.domainPropertyId;
    const domainProperty = domainPropertyId
      ? propertiesStore.getPropertyById(domainPropertyId)
      : undefined;
    const emailSuffix = domainProperty?.stringValue
    const value = propertiesStore.getPropertyById(id)?.stringValue;

    useEffect(() => {
      rightMenuNavigationStore.setAccountEmailPropertyId(id);
    }, [id]);

    const validateEmail = (value: string) => {
      console.log(value);
      if (value === "" || !value) {
        return;
      }

      const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        value || ""
      );
      console.log(isValid);
      propertiesStore.setPropertyValidation({
        id,
        isValid,
        error: isValid ? undefined : "Invalid account sender email",
      });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      propertiesStore.setPropertyStringValue(
        id,
        parseEmailValue(e.target.value) + (emailSuffix ? `@${emailSuffix}` : "")
      );
      validateEmail(
        parseEmailValue(e.target.value) + (emailSuffix ? `@${emailSuffix}` : "")
      );
    };

    const onMenuChangeHandler = (value: string) => {
      if (value === "send-test-email") {
        rightMenuNavigationStore.setMiddleSection("account-sender-email");
      }
    };

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
          <div className="relative flex flex-row h-[38px]">
            <input
              ref={inputRef}
              id={label}
              disabled={disabled || isLocked || isEditingLockType || isValueHidden}
              value={isEditingLockType ? "Choose" : (isValueHidden ? "" : (value ? parseEmailValue(value) : ""))}
              onChange={onInputChange}
              className={classNames(
                "!w-[80px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                error
                  ? "ring-strong-error"
                  : "focus:ring-strong-green hover:ring-hover-2",
                isEditingLockType
                  ? "pointer-events-none"
                  : "",
                `block w-[60%] border-0 bg-b1-black px-[12px] py-[8px] text-display-15 font-[400] text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-text-weak`
              )}
              placeholder={isEditingLockType ? "Choose" : placeholder}
              {...props}
            />

            <span className="flex items-center justify-center text-text-weak ml-[129px] absolute top-[5px] left-[0px]">
              @
            </span>

            <input
              disabled={disabled || isLocked || isEditingLockType || isValueHidden}
              value={isEditingLockType ? "Choose" : (isValueHidden ? "" : emailSuffix)}
              className={classNames(
                "!w-[77px] ml-[149px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
                error
                  ? "ring-strong-error"
                  : "focus:ring-strong-green hover:ring-hover-2",
                isEditingLockType
                  ? "pointer-events-none"
                  : "",
                `block border-0 bg-b1-black px-[12px] py-[8px] text-display-15 font-[400] text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-text-weak`
              )}
            />
            <PropertiesMailbox propertyId={id} />
          </div>

          <PropertiesMenu
            propertyId={id}
            topAdditionalItems={[
              { value: "send-test-email", label: "Send test email" },
            ]}
            onMenuChange={onMenuChangeHandler}
            disableLock={!propertiesStore.getShowMailbox()}
          />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
