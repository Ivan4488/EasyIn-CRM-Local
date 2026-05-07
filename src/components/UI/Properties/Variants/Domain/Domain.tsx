import classNames from "classnames";
import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "~/components/UI/Properties/PropertiesMenu/PropertiesMenu";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { parseEmailValue } from "../utils/parseEmailValue";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { HiddenLine } from "~/components/UI/Properties/PropertiesLockTypeEdit/HiddenLine";
import { LocksDescription } from "~/components/UI/Properties/PropertiesLockTypeEdit/LocksDescription";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

type Ref = HTMLInputElement;

const PREFIXES = ["crm", "mail", "sales", "send", "support"];

const deriveBareDomain = (val: string, prefixes: string[]): string => {
  if (!val) return "";
  const parts = val.split(".");
  return parts.length >= 3 && !!parts[0] && prefixes.includes(parts[0])
    ? parts.slice(1).join(".")
    : val;
};

const derivePrefix = (val: string, prefixes: string[], fallback: string): string => {
  const parts = val.split(".");
  return parts.length >= 3 && !!parts[0] && prefixes.includes(parts[0]) ? parts[0] : fallback;
};

const buildFull = (prefix: string, bare: string): string => (bare ? `${prefix}.${bare}` : "");

// eslint-disable-next-line react/display-name
export const Domain = forwardRef<Ref, InputProps>(
  ({ className, id, error, disabled, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const rightMenuNavigationStore = useRightMenuNavigationStore();

    const property = propertiesStore.getPropertyById(id);
    const label = property?.title;
    const placeholder = property?.placeholder;
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType = propertiesStore.activeEditingLockTypePropertyId === id;
    const storedValue = property?.stringValue ?? "";

    const isDomainVerified = property?.isDomainVerified;
    const isDomainVerifiedUndefined = isDomainVerified === undefined;
    const showYellow = !isDomainVerified && !!storedValue && !isDomainVerifiedUndefined;

    const [bareDomain, setBareDomain] = useState(() => deriveBareDomain(storedValue, PREFIXES));
    const [prefix, setPrefix] = useState(() => derivePrefix(storedValue, PREFIXES, "crm"));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [badgeWidth, setBadgeWidth] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLButtonElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    const isTyping = useRef(false);

    useEffect(() => {
      rightMenuNavigationStore.setDomainPropertyId(id);
    }, [id]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        const inBadge = dropdownRef.current?.contains(e.target as Node);
        const inPortal = portalRef.current?.contains(e.target as Node);
        if (!inBadge && !inPortal) setDropdownOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
      if (!isTyping.current) {
        setBareDomain(deriveBareDomain(storedValue, PREFIXES));
        setPrefix(derivePrefix(storedValue, PREFIXES, "crm"));
      }
    }, [storedValue]);

    useEffect(() => {
      if (badgeRef.current) setBadgeWidth(badgeRef.current.offsetWidth);
    }, [prefix]);

    const accountEmailPropertyId = rightMenuNavigationStore.accountEmailPropertyId;

    const syncAccountEmail = (fullDomain: string) => {
      if (!accountEmailPropertyId) return;

      const currentLocal = parseEmailValue(
        propertiesStore.getPropertyById(accountEmailPropertyId)?.stringValue ?? ""
      );
      const local = !currentLocal || currentLocal === "info" ? "info" : currentLocal;

      propertiesStore.setPropertyStringValue(
        accountEmailPropertyId,
        fullDomain ? `${local}@${fullDomain}` : ""
      );
    };

    const validateDomain = (value: string) => {
      if (!value) return;
      const isValid = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      propertiesStore.setPropertyValidation({
        id,
        isValid,
        error: isValid ? undefined : "Invalid domain",
      });
    };

    const onBareDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isTyping.current = true;
      const bare = e.target.value;
      setBareDomain(bare);

      const full = buildFull(prefix, bare);
      propertiesStore.setPropertyStringValue(id, full);
      validateDomain(full);
      syncAccountEmail(full);

      setTimeout(() => {
        isTyping.current = false;
      }, 0);
    };

    const onPrefixSelect = (newPrefix: string) => {
      setPrefix(newPrefix);
      setDropdownOpen(false);

      const full = buildFull(newPrefix, bareDomain);
      propertiesStore.setPropertyStringValue(id, full);
      validateDomain(full);
      syncAccountEmail(full);
    };

    const queryClient = useQueryClient();
    const router = useRouter();
    const accountId = router.query.id as string;

    const onVerifyClick = () => {
      rightMenuNavigationStore.setDomainPropertyId(id);
      rightMenuNavigationStore.setMiddleSection("verify-domain");
      queryClient.invalidateQueries({ queryKey: ["domain", accountId] });
    };

    const onMenuChangeHandler = (value: string) => {
      if (value === "verify") onVerifyClick();
    };

    const isDisabled = disabled || isLocked || isEditingLockType || isValueHidden;

    return (
      <div
        className={classNames(
          className,
          "w-full",
          disabled || isLocked ? "opacity-50 pointer-events-none text-gray-moderate" : ""
        )}
      >
        <div className="flex flex-row items-center gap-[6px] mb-[6px]">
          <label htmlFor={label} className="text-display-14 font-semibold text-text-weak">
            {label}
          </label>
        </div>

        <div className="relative h-[38px]">
          {isValueHidden && !isEditingLockType && <HiddenLine />}

          <input
            ref={ref}
            id={label}
            disabled={isDisabled}
            value={isEditingLockType ? "Choose" : isValueHidden ? "" : bareDomain}
            onChange={onBareDomainChange}
            className={classNames(
              "!w-[187px] ml-[39px] z-[2] absolute top-[0px] left-[0px] h-[38px]",
              "block w-full border-0 bg-b1-black py-[8px] pr-[12px] text-display-15 font-[400] text-white outline-none",
              "ring-1 ring-inset ring-gray-moderate transition focus:ring-strong-green hover:ring-hover-2",
              "placeholder:text-text-weak/40",
              isEditingLockType ? "pointer-events-none" : ""
            )}
            style={{
              paddingLeft: badgeWidth > 0 ? `${badgeWidth + 2}px` : `${prefix.length * 8 + 28}px`,
            }}
            placeholder={isEditingLockType ? "Choose" : placeholder ?? "yourdomain.com"}
            autoComplete="off"
            spellCheck={false}
            {...props}
          />

          <div ref={dropdownRef} className="absolute z-[3] left-[40px] top-[1px] h-[36px] flex items-center">
            <button
              ref={badgeRef}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && setDropdownOpen((v) => !v)}
              onMouseDown={(e) => e.stopPropagation()}
              className={classNames(
                "flex items-center h-full bg-b1-black text-text-weak/70 select-none whitespace-nowrap pl-[8px] pr-0 rounded-l-[3px]",
                "text-display-15 font-[500]",
                !isDisabled && "hover:text-white hover:bg-hover-1 cursor-pointer transition-colors"
              )}
            >
              <span>{isEditingLockType ? "crm" : prefix}</span>
              <span className="mx-[1px] text-white/50 font-[600] text-[15px] leading-none">.</span>
            </button>

            {dropdownOpen &&
              createPortal(
                <div
                  ref={portalRef}
                  className="bg-b1-black ring-1 ring-gray-moderate rounded-[6px] overflow-hidden shadow-lg"
                  style={{
                    position: "fixed",
                    zIndex: 9999,
                    top: badgeRef.current ? badgeRef.current.getBoundingClientRect().bottom + 2 : 0,
                    left: badgeRef.current ? badgeRef.current.getBoundingClientRect().left : 0,
                    width: "max-content",
                    minWidth: 100,
                  }}
                >
                  {PREFIXES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onPrefixSelect(p)}
                      className={classNames(
                        "block w-full text-left px-[12px] py-[7px] text-display-15 text-white hover:bg-hover-1 transition whitespace-nowrap",
                        p === prefix && "text-strong-green"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>

          <PropertiesMenu
            propertyId={id}
            topAdditionalItems={[{ value: "verify", label: "Verify" }]}
            onMenuChange={onMenuChangeHandler}
            disableLock={!propertiesStore.getShowMailbox()}
          />

          <PropertiesMailbox propertyId={id} warningText={showYellow ? "Domain not verified" : undefined} />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
