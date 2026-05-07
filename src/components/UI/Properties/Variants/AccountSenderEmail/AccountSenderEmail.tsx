import classNames from "classnames";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
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
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";
import { parseEmailValue } from "../utils/parseEmailValue";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
  tooltipText?: string;
}

type Ref = HTMLInputElement;

const INPUT_PL = 12;
const MIN_LEFT = 22;

// eslint-disable-next-line react/display-name
export const AccountSenderEmail = forwardRef<Ref, InputProps>(
  ({ className, id, error, disabled, tooltipText, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const rightMenuNavigationStore = useRightMenuNavigationStore();

    const property = propertiesStore.getPropertyById(id);
    const label = property?.title;
    const placeholder = property?.placeholder;
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType = propertiesStore.activeEditingLockTypePropertyId === id;
    const localPart = property?.stringValue ? parseEmailValue(property.stringValue) : "";

    const domainPropertyId = rightMenuNavigationStore.domainPropertyId;
    const emailSuffix = domainPropertyId
      ? propertiesStore.getPropertyById(domainPropertyId)?.stringValue ?? ""
      : "";

    const inputRef = useRef<HTMLInputElement | null>(null) as React.MutableRefObject<HTMLInputElement | null>;
    const mirrorRef = useRef<HTMLSpanElement>(null);
    const [suffixLeft, setSuffixLeft] = useState(MIN_LEFT);

    useEffect(() => {
      rightMenuNavigationStore.setAccountEmailPropertyId(id);
    }, [id]);

    const reposition = useCallback(() => {
      if (!mirrorRef.current || !inputRef.current) return;
      const natural = INPUT_PL + mirrorRef.current.offsetWidth - inputRef.current.scrollLeft;
      setSuffixLeft(Math.max(MIN_LEFT, natural));
    }, []);

    useEffect(() => {
      if (mirrorRef.current) mirrorRef.current.textContent = localPart;
      reposition();
    }, [localPart, emailSuffix, reposition]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const full = e.target.value + (emailSuffix ? `@${emailSuffix}` : "");
      propertiesStore.setPropertyStringValue(id, full);
    };

    const onMenuChange = (val: string) => {
      if (val === "send-test-email") {
        rightMenuNavigationStore.setMiddleSection("account-sender-email");
      }
    };

    const setRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const isDisabled = disabled || isLocked || isEditingLockType || isValueHidden;
    const displayLocal = isEditingLockType ? "Choose" : isValueHidden ? "" : localPart;

    return (
      <div
        className={classNames(
          className,
          "w-full",
          disabled ? "opacity-50 pointer-events-none text-gray-moderate" : ""
        )}
      >
        <div className="flex flex-row items-center gap-[6px] mb-[6px]">
          <label htmlFor={label} className="text-display-14 font-semibold text-text-weak">
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

          <div className="!w-[186px] ml-[39px] h-[38px] absolute top-0 left-0 z-[3] overflow-hidden pointer-events-none">
            <span
              className="absolute bg-b1-black whitespace-nowrap select-none top-[1px] h-[36px] flex items-center"
              style={{ left: suffixLeft }}
            >
              <span className="leading-none text-white/50 font-[600] text-[15px]">@</span>
              <span
                className={classNames(
                  "text-display-15 font-[400] pr-[4px]",
                  !emailSuffix ? "text-text-weak/30 italic" : "text-text-weak/60"
                )}
              >
                {!emailSuffix ? "fill domain first" : emailSuffix}
              </span>
            </span>
          </div>

          <input
            ref={setRef}
            id={label}
            disabled={isDisabled}
            value={displayLocal}
            onChange={onInputChange}
            onScroll={reposition}
            className={classNames(
              "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px] h-[38px]",
              isEditingLockType ? "pointer-events-none" : "",
              error ? "ring-strong-error" : "focus:ring-strong-green hover:ring-hover-2",
              "block w-full border-0 bg-b1-black py-[8px] text-display-15 font-[400] text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-text-weak"
            )}
            placeholder={isEditingLockType ? "Choose" : placeholder}
            autoComplete="off"
            spellCheck={false}
            {...props}
          />

          <span
            ref={mirrorRef}
            aria-hidden
            className="absolute whitespace-pre text-display-15 font-[400]"
            style={{ visibility: "hidden", left: -9999, top: 0 }}
          />

          <PropertiesMailbox propertyId={id} />

          <PropertiesMenu
            propertyId={id}
            topAdditionalItems={[{ value: "send-test-email", label: "Send test email" }]}
            onMenuChange={onMenuChange}
            disableLock={!propertiesStore.getShowMailbox()}
          />

          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
