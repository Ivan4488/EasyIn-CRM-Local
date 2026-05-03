import classNames from "classnames";
import { forwardRef, useEffect } from "react";
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
import { CircleCheck } from "~/icons/ui/CircleCheck";
import { parseEmailValue } from "../utils/parseEmailValue";
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
export const Domain = forwardRef<Ref, InputProps>(
  ({ className, id, error, disabled, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const rightMenuNavigationStore = useRightMenuNavigationStore();
    const label = propertiesStore.getPropertyById(id)?.title;
    const placeholder = propertiesStore.getPropertyById(id)?.placeholder;
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType =
      propertiesStore.activeEditingLockTypePropertyId === id;

    const value = propertiesStore.getPropertyById(id)?.stringValue;

    const isDomainVerified = propertiesStore.getPropertyById(id)
      ?.isDomainVerified;
    const isDomainVerifiedUndefined = isDomainVerified === undefined;

    const accountEmailPropertyId =
      rightMenuNavigationStore.accountEmailPropertyId;
    const accountEmailProperty = accountEmailPropertyId
      ? propertiesStore.getPropertyById(accountEmailPropertyId)
      : undefined;

    const showYellow = !isDomainVerified && value && !isDomainVerifiedUndefined;

    const validateDomain = (value: string) => {
      if (value === "" || !value) {
        return;
      }
      const isValid = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(
        value || ""
      );
      propertiesStore.setPropertyValidation({
        id,
        isValid,
        error: isValid ? undefined : "Invalid domain",
      });
    };

    const handleAccountEmailProperty = (value: string) => {
      if (!accountEmailPropertyId) {
        return;
      }

      const parsedEmail = parseEmailValue(
        accountEmailProperty?.stringValue ?? ""
      );

      if ((value === "" || !value) && accountEmailPropertyId) {
        propertiesStore.setPropertyStringValue(accountEmailPropertyId, "");
        return;
      }

      if ((!parsedEmail || parsedEmail === "info") && accountEmailPropertyId) {
        propertiesStore.setPropertyStringValue(
          accountEmailPropertyId,
          `info@${value}`
        );
      }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      propertiesStore.setPropertyStringValue(id, e.target.value);
      validateDomain(e.target.value);
      handleAccountEmailProperty(e.target.value);
    };


    useEffect(() => {
      rightMenuNavigationStore.setDomainPropertyId(id);
    }, [id]);

    const queryClient = useQueryClient();

    const router = useRouter();
    const accountId = router.query.id as string;

    const onVerifyClick = () => {
      rightMenuNavigationStore.setDomainPropertyId(id);
      rightMenuNavigationStore.setMiddleSection("verify-domain");
      queryClient.invalidateQueries({
        queryKey: ["domain", accountId],
      });
    };

    const onMenuChangeHandler = (value: string) => {
      if (value === "verify") {
        onVerifyClick();
      }
    };

    return (
      <div
        className={classNames(
          className,
          "w-full",
          disabled || isLocked ? "opacity-50 pointer-events-none text-gray-moderate" : ""
        )}
      >
        <div className="flex flex-row items-center gap-[6px] mb-[6px]">
          <label
            htmlFor={label}
            className="text-display-14 font-semibold text-text-weak"
          >
            {label}
          </label>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                {isDomainVerified && !showYellow ? (
                  <CircleCheck className="text-strong-green w-[14px] h-[14px]" />
                ) : (
                  showYellow && <Info className="text-strong-yellow" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {showYellow ? (
                  <div className="flex flex-col gap-[4px]">
                    <p>This domain is not verified.</p>
                    <div className="flex flex-row gap-[4px]">
                      <button className="underline" onClick={onVerifyClick}>
                        Click here
                      </button>{" "}
                      to verify.
                    </div>
                  </div>
                ) : (
                  <div>
                    This domain has been verified and can be used for email
                  </div>
                )}
                <TooltipArrow className="fill-gray-moderate" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative h-[38px]">
          {isValueHidden && !isEditingLockType && <HiddenLine />}
          <input
            ref={ref}
            id={label}
            disabled={disabled || isLocked || isEditingLockType || isValueHidden}
            value={isEditingLockType ? "Choose" : isValueHidden ? "" : value ?? ""}
            onChange={onInputChange}
            className={classNames(
              "!w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
              showYellow
                ? "ring-strong-yellow"
                : "focus:ring-strong-green hover:ring-hover-2",
              isEditingLockType
                ? "pointer-events-none"
                : "",
              `block w-full border-0 bg-b1-black px-[12px] py-[8px] text-display-15 font-[400] text-white outline-none ring-1 ring-inset ring-gray-moderate transition placeholder:text-text-weak/40 focus:ring-1 focus:ring-inset disabled:bg-gray-7 disabled:text-text-weak`
            )}
            placeholder={isEditingLockType ? "Choose" : placeholder}
            {...props}
          ></input>
          <PropertiesMenu
            propertyId={id}
            topAdditionalItems={[{ value: "verify", label: "Verify" }]}
            onMenuChange={onMenuChangeHandler}
            disableLock={!propertiesStore.getShowMailbox()}
          />
          <PropertiesMailbox propertyId={id} />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
