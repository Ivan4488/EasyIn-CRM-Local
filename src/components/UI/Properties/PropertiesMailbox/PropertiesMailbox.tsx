import { useEffect } from "react";
import { Levels } from "./Levels";
import { CalendarIcon, Clock } from "lucide-react";
import { DomainWarning } from "~/icons/ui/DomainWarning";
import { isCompanyDomainValid } from "~/utils/domainValidation";
import { Picture } from "~/icons/ui/Picture";
import classNames from "classnames";
import { LockLevelIcon } from "./LockLevelIcon";
import { EmailSourceAvatar } from "./EmailSourceAvatar";
import { EmployeeCountSourceIcon } from "./EmployeeCountSourceIcon";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { Arrow } from "~/icons/ui/Arrow";
import { PropertyLockType } from "../RightMenuPropertiesList/hooks/useProperties";
import { hasLinkedInDataMapForAutomation } from "~/utils/hasLinkedInDataMapForAutomation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Tooltip/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";

interface Props {
  propertyId: string;
  propertyHeight?: number;
  hoverType?: "date" | "photo";
  warningText?: string;
}

/** Lock picker order (yellow â†’ teal). One-click is merged with auto in UI; legacy DB value still maps here. */
const LOCK_TYPE_NAV_ORDER: PropertyLockType[] = [
  PropertyLockType.WATCH_AND_UPDATE,
  PropertyLockType.REVIEW_MODE,
  PropertyLockType.FILL_AND_PROTECT,
  PropertyLockType.PERSONAL_DEFAULT,
  PropertyLockType.VISIBLE_FULLY_LOCKED,
  PropertyLockType.HIDDEN_FULLY_LOCKED,
];

const getLockTypeNavIndex = (lockType?: PropertyLockType) => {
  if (!lockType) return 0;
  const normalized =
    lockType === PropertyLockType.ONE_CLICK_UPDATE
      ? PropertyLockType.WATCH_AND_UPDATE
      : lockType;
  const idx = LOCK_TYPE_NAV_ORDER.indexOf(normalized);
  return idx === -1 ? 0 : idx;
};

const LockArrows = ({
  lockType,
  propertyId,
  nextLockTypeKey,
  previousLockTypeKey,
}: {
  lockType?: PropertyLockType;
  propertyId: string;
  nextLockTypeKey?: string;
  previousLockTypeKey?: string;
}) => {
  const propertiesStore = usePropertiesStore();
  const property = propertiesStore.getPropertyById(propertyId);
  const hasLinkedInMapping = hasLinkedInDataMapForAutomation(property);
  const isRightArrowDisabled =
    lockType === PropertyLockType.HIDDEN_FULLY_LOCKED;
  const isLeftArrowDisabled =
    lockType === PropertyLockType.WATCH_AND_UPDATE ||
    lockType === PropertyLockType.ONE_CLICK_UPDATE ||
    (!hasLinkedInMapping &&
      (lockType === PropertyLockType.FILL_AND_PROTECT ||
        lockType === PropertyLockType.REVIEW_MODE));

  return (
    <div className="border-strong-green rounded-bl-[7px] w-[39px] border-b border-r border-l absolute left-[0] top-[38px]">
      <div className="h-[1px] absolute top-[-1px] z-[-1] left-[0px] w-[37px] bg-gray-moderate "></div>

      <button
        disabled={isLeftArrowDisabled}
        className={classNames(
          "h-[36px] w-[38px] bg-gradient flex items-center justify-center cursor-pointer",
          isLeftArrowDisabled && "opacity-50"
        )}
        onClick={() => {
          propertiesStore.setPropertyLockType(
            propertyId,
            previousLockTypeKey as PropertyLockType
          );
        }}
      >
        <Arrow className="w-[8px] h-[8px] text-text-weak -rotate-90" />
      </button>

      <div className="h-[1px] absolute top-[36px] z-[-1] left-[0px] w-[37px] bg-gray-moderate "></div>

      <button
        disabled={isRightArrowDisabled}
        className={classNames(
          "h-[36px] w-[38px] bg-gradient rounded-bl-[7px] flex items-center justify-center cursor-pointer",
          isRightArrowDisabled && "opacity-50"
        )}
        onClick={() => {
          propertiesStore.setPropertyLockType(
            propertyId,
            nextLockTypeKey as PropertyLockType
          );
        }}
      >
        <Arrow className="w-[8px] h-[8px] text-text-weak rotate-90" />
      </button>
    </div>
  );
};

const getEmailSourceTooltip = (source: string, email?: string): string | undefined => {
  const s = source.toLowerCase();
  if (s === "linkedin") return "LinkedIn sourced email";
  if (s === "company") {
    return email ? "Company sourced email" : "Domain emails will be available within the CRM a few minutes after creation";
  }
  if (s.startsWith("domain")) return "Domain sourced email";
  if (s === "additional") return "Additional email";
  return undefined;
};

const AUTO_CLOSE_MS = 30000;

export const PropertiesMailbox = ({
  propertyId,
  propertyHeight,
  hoverType,
  warningText,
}: Props) => {
  const propertiesStore = usePropertiesStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const isActiveEditingLockType =
    propertiesStore.activeEditingLockTypePropertyId === propertyId;

  const property = propertiesStore.getPropertyById(propertyId);
  const lockType = property?.lockType;
  const currentIndex = getLockTypeNavIndex(lockType);
  const nextIndex = Math.min(
    currentIndex + 1,
    LOCK_TYPE_NAV_ORDER.length - 1
  );
  const previousIndex = Math.max(currentIndex - 1, 0);
  const nextLockTypeKey = LOCK_TYPE_NAV_ORDER[nextIndex];
  const previousLockTypeKey = LOCK_TYPE_NAV_ORDER[previousIndex];

  const isDomainEmpty =
    property?.title === "Company domain" && !property?.stringValue;

  const isDomainInvalid =
    property?.title === "Company domain" &&
    !!property?.stringValue &&
    !isCompanyDomainValid(property.stringValue).valid;

  const isPropertyEmpty = !property?.stringValue;
  const isEmailProperty = property?.type === "CONTACT_EMAILS";
  const emailPrimary = (() => {
    if (!isEmailProperty) return undefined;
    const emails = Array.isArray(property?.jsonValue) ? property.jsonValue as Array<{source?: string; isPrimary?: boolean; email?: string; companyName?: string; action?: string | null}> : [];
    const usable = emails.filter((e) => !e.action);
    return usable.find((e) => e.isPrimary);
  })();

  const domainProperty = propertiesStore.properties.find(
    (p) => p.title === "Company domain"
  );
  const companyNameProperty = propertiesStore.properties.find(
    (p) => p.title === "Company Name"
  );

  const isPrimaryFromCurrentCompany =
    !!emailPrimary?.companyName &&
    !!companyNameProperty?.stringValue &&
    emailPrimary.companyName === companyNameProperty.stringValue;

  const isContactDomainInvalid =
    isEmailProperty &&
    isPrimaryFromCurrentCompany &&
    !!domainProperty?.stringValue &&
    !isCompanyDomainValid(domainProperty.stringValue).valid;

  const isContactDomainEmpty =
    isEmailProperty &&
    isPrimaryFromCurrentCompany &&
    !domainProperty?.stringValue;

  const effectiveSource = emailPrimary?.source ?? "LinkedIn";
  const isEmptyCompanyPrimary = effectiveSource.toLowerCase() === "company" && !emailPrimary?.email;
  const shouldShowClock = (() => {
    if (!isEmailProperty || !property?.isInternallyManaged || !isPropertyEmpty) return false;
    // Primary is an empty company email â†’ show clock (discovery in progress)
    if (isEmptyCompanyPrimary) return true;
    return false;
  })();

  // Tooltip state from store
  const tooltipOpenPropertyId = useRightMenuNavigationStore(
    (state) => state.tooltipOpenPropertyId
  );
  const tooltipOpenReason = useRightMenuNavigationStore(
    (state) => state.tooltipOpenReason
  );
  const openTooltip = useRightMenuNavigationStore((state) => state.openTooltip);
  const closeTooltip = useRightMenuNavigationStore((state) => state.closeTooltip);

  const isTooltipOpen = tooltipOpenPropertyId === propertyId;

  // Auto-close tooltip after timeout when opened by click
  useEffect(() => {
    if (!isTooltipOpen || tooltipOpenReason !== "click") return;
    const timeoutId = window.setTimeout(() => closeTooltip(), AUTO_CLOSE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isTooltipOpen, tooltipOpenReason, closeTooltip]);

  const getTooltipText = () => {
    if (warningText) {
      return warningText;
    }
    if (isDomainEmpty) {
      return "Company domain is missing";
    }
    if (isDomainInvalid) {
      return "This domain doesn't look like a company website";
    }
    if (property?.isInternallyManaged && isEmailProperty) {
      return getEmailSourceTooltip(effectiveSource, emailPrimary?.email);
    }
    if (property?.isInternallyManaged) {
      return "EasyIn updates this property automatically, leaving it blank if no suitable email is found.";
    }
    if (property?.isReadOnly) {
      return "This property is read-only.";
    }
    switch (lockType) {
      case PropertyLockType.HIDDEN_FULLY_LOCKED:
        return "Hidden by Admin";
      case PropertyLockType.VISIBLE_FULLY_LOCKED:
        return "Locked by Admin";
      case PropertyLockType.PERSONAL_DEFAULT:
        return "Self protected";
      default:
        return undefined;
    }
  };

  const tooltipText = getTooltipText();
  const shouldShowTooltip = Boolean(tooltipText) && !isActiveEditingLockType;

  const handleMouseEnter = () => {
    if (shouldShowTooltip) {
      openTooltip(propertyId, "hover");
    }
  };

  const handleMouseLeave = () => {
    closeTooltip("hover");
  };

  const renderMailboxIcon = () => {
    if (isDomainEmpty || isDomainInvalid || warningText) {
      return <DomainWarning className="w-[16px] h-[16px] text-[#FFD063]" />;
    }
    if (shouldShowClock) {
      if (isContactDomainInvalid || isContactDomainEmpty) {
        return <DomainWarning className="w-[16px] h-[16px] text-[#FFD063]" />;
      }

      return <Clock className="w-[16px] h-[16px] text-white/60" />;
    }
    if (property?.type === "CONTACT_EMAILS") {
      return <EmailSourceAvatar source={effectiveSource} companyName={emailPrimary?.companyName} />;
    }
    if (property?.type === "COMPANY_EMPLOYEE_COUNT") {
      return <EmployeeCountSourceIcon propertyId={propertyId} />;
    }
    return (
      <LockLevelIcon
        propertyId={propertyId}
        isInternallyManaged={property?.isInternallyManaged}
        isReadOnly={property?.isReadOnly}
      />
    );
  };

  const mailboxIcon = (
    <div
      className={classNames(
        "absolute top-[0px] z-[0] left-[1px] bg-b1-black overflow-hidden",
        isActiveEditingLockType
          ? "rounded-bl-0 rounded-tl-[7px] h-[37px]"
          : classNames("rounded-l-[7px] h-full border border-gray-moderate border-solid")
      )}
    >
      <div
        onClick={(e) => { e.stopPropagation(); }}
        className={classNames(
          "bg-gradient  flex items-center justify-center transition-opacity duration-200",
          hoverType && !isActiveEditingLockType
            ? "group-hover:opacity-0"
            : "",
          isActiveEditingLockType
            ? "rounded-bl-0 rounded-tl-[7px] h-[37px] border-r border-strong-green w-[38px]"
            : "rounded-l-[6px] h-full w-[37px]"
        )}
      >
        {renderMailboxIcon()}
      </div>
      {isActiveEditingLockType ? (
        <Levels propertyHeight={propertyHeight} propertyId={propertyId} />
      ) : null}

      {hoverType && !isActiveEditingLockType ? (
        <div
          className={classNames(
            "absolute top-0 left-0 h-full bg-strong-green pointer-events-auto transition-all duration-200 z-[30] opacity-100",
            isActiveEditingLockType
              ? "rounded-bl-0 rounded-tl-[7px]"
              : "rounded-l-[7px]",
            "w-[6px] group-hover:w-[38px] hover:w-[38px]"
          )}
        >
          <div className="w-full h-full flex items-center justify-center">
            {hoverType === "date" ? (
              <CalendarIcon className="w-[16px] h-[16px] text-b1-black opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200" />
            ) : hoverType === "photo" ? (
              <Picture className="stroke-b1-black opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200" />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip
        disableHoverableContent
        open={shouldShowTooltip && isTooltipOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeTooltip();
          }
        }}
      >
        <div
          className="rounded-bl-[7px] group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isActiveEditingLockType && (
            <div className="border-strong-green border-t border-l border-r rounded-tl-[7px] w-[39px] h-[38px] absolute top-[0px] left-[0px] z-[10]" />
          )}

          <TooltipTrigger asChild>{mailboxIcon}</TooltipTrigger>

          {isActiveEditingLockType && (
            <LockArrows
              lockType={lockType}
              propertyId={propertyId}
              nextLockTypeKey={nextLockTypeKey}
              previousLockTypeKey={previousLockTypeKey}
            />
          )}
        </div>
        <TooltipContent
          side="top"
          align="start"
          sideOffset={4}
          className="max-w-[200px] text-center"
        >
          <p>{tooltipText}</p>
          <TooltipArrow className="fill-gray-moderate" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

