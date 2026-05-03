import classNames from "classnames";
import { forwardRef } from "react";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "../PropertiesLockTypeEdit/LocksDescription";
import { HiddenLine } from "../PropertiesLockTypeEdit/HiddenLine";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
export const NumberInput = forwardRef<Ref, InputProps>(
  ({ className, id, error, disabled, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const label = propertiesStore.getPropertyById(id)?.title;
    const placeholder = propertiesStore.getPropertyById(id)?.placeholder;
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType =
      propertiesStore.activeEditingLockTypePropertyId === id;

    const value = usePropertiesStore.getState().getPropertyById(id)
      ?.stringValue;

    const validateNumber = (rawValue: string) => {
      if (rawValue === "" || !rawValue) {
        return;
      }

      const normalized = rawValue.replace(/,/g, "").trim();
      const parsed = Number(normalized);
      const isValid = Number.isFinite(parsed);

      propertiesStore.setPropertyValidation({
        id,
        isValid,
        error: isValid ? undefined : "Invalid number",
      });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      propertiesStore.setPropertyStringValue(id, e.target.value);
      validateNumber(e.target.value);
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
          <PropertiesMailbox propertyId={id} />
          <PropertiesMenu
            propertyId={id}
            disableLock={!propertiesStore.getShowMailbox()}
          />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
