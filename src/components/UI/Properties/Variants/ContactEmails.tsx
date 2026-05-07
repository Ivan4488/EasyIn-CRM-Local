import classNames from "classnames";
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
import { PropertiesMailbox } from "../PropertiesMailbox/PropertiesMailbox";
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";

interface Props {
  id: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  tooltipText?: string;
}

export const ContactEmails = ({ className, id, error, disabled, tooltipText }: Props) => {
  const propertiesStore = usePropertiesStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const label = propertiesStore.getPropertyById(id)?.title;
  const placeholder = propertiesStore.getPropertyById(id)?.placeholder;

  const isValueHidden = propertiesStore.isPropertyValueHidden(id);
  const isEditingLockType = propertiesStore.activeEditingLockTypePropertyId === id;

  const property = propertiesStore.getPropertyById(id);
  const emails = Array.isArray(property?.jsonValue) ? (property!.jsonValue as { email: string; isPrimary?: boolean; action?: string | null }[]) : [];
  const primaryEmail = emails.find((e) => e.isPrimary && !e.action);
  const value = primaryEmail?.email || property?.stringValue;

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
          id={label}
          readOnly
          onClick={() => {
            if (!isEditingLockType) rightMenuNavigationStore.setContactEmailsModalPropertyId(id);
          }}
          value={isEditingLockType ? "Choose" : isValueHidden ? "" : value ?? ""}
          className={classNames(
            "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
            isEditingLockType ? "pointer-events-none" : "cursor-pointer",
            error ? "ring-strong-error" : "focus:ring-strong-green hover:ring-hover-2",
            "block w-full border-0 bg-b1-black py-[8px] text-display-15 font-[400] text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset"
          )}
          placeholder={isEditingLockType ? "Choose" : placeholder}
        />
        {!isEditingLockType && (
          <div style={{
            position: "absolute",
            bottom: 1,
            left: 40,
            width: 9,
            height: 9,
            background: "#39D0B5",
            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }} />
        )}
        <PropertiesMailbox propertyId={id} propertyHeight={38} />
        <PropertiesMenu propertyId={id} disableLock={!propertiesStore.getShowMailbox()} />
        {isEditingLockType && <LocksDescription propertyId={id} />}
      </div>
    </div>
  );
};
