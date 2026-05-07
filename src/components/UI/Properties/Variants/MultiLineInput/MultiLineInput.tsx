import classNames from "classnames";
import { forwardRef, useState, useEffect, useRef } from "react";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertiesMenu } from "../../PropertiesMenu/PropertiesMenu";
import { PropertiesMailbox } from "../../PropertiesMailbox/PropertiesMailbox";
import { LocksDescription } from "../../PropertiesLockTypeEdit/LocksDescription";
import { HiddenLine } from "../../PropertiesLockTypeEdit/HiddenLine";
import styles from "./MultiLineInput.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  error?: string;
  containerClassName?: string;
}

type Ref = HTMLTextAreaElement;

// eslint-disable-next-line react/display-name
export const MultiLineInput = forwardRef<Ref, InputProps>(
  ({ containerClassName, error, className, id, ...props }, ref) => {
    const propertiesStore = usePropertiesStore();
    const label = propertiesStore.getPropertyById(id)?.title;
    const placeholder = propertiesStore.getPropertyById(id)?.placeholder;
    const isLocked = propertiesStore.isPropertyLocked(id);
    const isValueHidden = propertiesStore.isPropertyValueHidden(id);
    const isEditingLockType =
      propertiesStore.activeEditingLockTypePropertyId === id;

    const value = propertiesStore.getPropertyById(id)?.stringValue;
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      propertiesStore.setPropertyStringValue(id, e.target.value);
    };

    // State for storing clientHeight of the textarea
    const [textareaHeight, setTextareaHeight] = useState(0);

    // Ref to access the textarea element
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const saveHeightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

    // Update the textarea height state whenever the component renders or the value changes
    useEffect(() => {
      if (textareaRef.current) {
        setTextareaHeight(textareaRef.current.clientHeight);
      }
    }, [value]);

    // Load saved textarea height from localStorage (per property id)
    useEffect(() => {
      const textareaElement = textareaRef.current;
      if (!textareaElement) return;
      if (typeof window === "undefined") return;

      try {
        const storageKey = `propertyTextareaHeight:${id}`;
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!Number.isNaN(parsed) && parsed > 0) {
            textareaElement.style.height = isEditingLockType
              ? "18px"
              : `${parsed}px`;
            setTextareaHeight(parsed);
          }
        }
      } catch (_) {
        // noop: localStorage might be unavailable (privacy mode) – fail silently
      }
    }, [id]);

    // Effect hook to set up the ResizeObserver
    useEffect(() => {
      if (isEditingLockType) return;

      const textareaElement = textareaRef.current;

      if (!textareaElement) return;

      // Create a ResizeObserver instance and update state on resize
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === textareaElement) {
            const newHeight = Math.round(entry.contentRect.height);
            setTextareaHeight(newHeight);

            // Persist the latest height to localStorage with a small debounce
            if (typeof window !== "undefined") {
              if (saveHeightTimeoutRef.current) {
                clearTimeout(saveHeightTimeoutRef.current);
              }
              const storageKey = `propertyTextareaHeight:${id}`;
              saveHeightTimeoutRef.current = setTimeout(() => {
                try {
                  window.localStorage.setItem(storageKey, String(newHeight));
                } catch (_) {
                  // ignore storage errors
                }
              }, 150);
            }
          }
        }
      });

      // Observe the textarea for resizing
      resizeObserver.observe(textareaElement);

      // Cleanup the observer on component unmount
      return () => {
        if (saveHeightTimeoutRef.current) {
          clearTimeout(saveHeightTimeoutRef.current);
        }
        resizeObserver.unobserve(textareaElement);
        resizeObserver.disconnect();
      };
    }, [id]);

    return (
      <div className={`${containerClassName || ""} w-full`}>
        <div className="mb-[6px]">
          <label
            htmlFor={label}
            className="text-display-14 text-text-weak font-semibold"
          >
            {label}
          </label>
        </div>

        <div
          className="relative"
          style={{ height: `${textareaHeight + 20}px` }}
        >
          {isValueHidden && !isEditingLockType && <HiddenLine />}

          <div
            className={classNames(
              "w-[187px] ml-[39px] pl-[12px] z-[2] absolute top-[0px] left-[0px]",
              isEditingLockType ? "pointer-events-none" : "",
              !isEditingLockType && !error && "hover:ring-hover-2",
              error ? "ring-strong-error" : "focus:ring-strong-green",
              "pr-[8px] transition py-[10px] bg-b1-black focus:ring-1 focus:ring-inset disabled:bg-gray-7 outline-none ring-1 ring-inset ring-gray-moderate "
            )}
          >
            <textarea
              ref={textareaRef}
              id={label}
              className={classNames(
                className,
                styles.scrollbar,
                `resize-y textarea-resize block w-full bg-b1-black border-0 text-display-14 font-[400] text-white transition placeholder:text-text-weak/40  disabled:text-text-weak min-h-[18px] h-[18px] leading-5 focus:ring-0 focus:border-0 focus:outline-none`
              )}
              placeholder={isEditingLockType ? "Choose" : placeholder}
              {...props}
              value={
                isEditingLockType ? "Choose" : isValueHidden ? "" : value ?? ""
              }
              onChange={onInputChange}
              disabled={isLocked || isEditingLockType}
            />
          </div>
          <PropertiesMailbox
            propertyId={id}
            propertyHeight={textareaHeight + 18}
          />
          <PropertiesMenu
            propertyId={id}
            propertyHeight={isEditingLockType ? 38 : textareaHeight + 20}
            disableLock={!propertiesStore.getShowMailbox()}
          />
          {isEditingLockType && <LocksDescription propertyId={id} />}
        </div>
      </div>
    );
  }
);
