import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MailboxDropdown } from "./MailboxDropdown";
import { useToast } from "~/components/UI/hooks/use-toast";

export type EmployeeCountEntry = {
  id: string;
  label: string;
  value: string | number | undefined;
  source: string;
  isPrimary: boolean;
  sortOrder: number;
  kind?: "low" | "high" | "range" | "linkedin";
  numericValue?: number | null;
};

interface EmployeeCountListDropdownProps {
  entries: EmployeeCountEntry[];
  onSetPrimary: (id: string) => void;
  onAddCustomCount?: (value: string) => void;
  onDeleteEntry?: (id: string) => void;
}

const VARIANT_META: Record<
  string,
  { label: string; icon: "low" | "high" | "range" | "linkedin" }
> = {
  "Employee count low": { label: "Low", icon: "low" },
  "Employee count high": { label: "High", icon: "high" },
  "Full range": { label: "Range", icon: "range" },
  "Employees on LinkedIn": { label: "LinkedIn", icon: "linkedin" },
};

const getVariantMeta = (label: string) =>
  VARIANT_META[label] ?? { label, icon: "range" as const };

const isUserAddedEntry = (entry: EmployeeCountEntry) =>
  entry.source === "User" || entry.label.startsWith("Additional");

export const EmployeeCountListDropdown = ({
  entries,
  onSetPrimary,
  onAddCustomCount,
  onDeleteEntry,
}: EmployeeCountListDropdownProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [isAddingCustomCount, setIsAddingCustomCount] = useState(false);
  const [newCustomCount, setNewCustomCount] = useState("");
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);

  const sortedEntries = [...entries].sort((a, b) => a.sortOrder - b.sortOrder);
  const activeEntries = sortedEntries;

  useEffect(() => {
    if (!openMenuId) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [openMenuId]);

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
      setOpenMenuId(id);
    }
  };

  const handleCopyValue = (e: React.MouseEvent, entry: EmployeeCountEntry) => {
    e.stopPropagation();
    if (entry.value != null) {
      navigator.clipboard.writeText(entry.value.toString());
    }
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleSetPrimaryFromMenu = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    onSetPrimary(entryId);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleSubmitCustomCount = () => {
    const trimmed = newCustomCount.trim();
    if (!trimmed) return;
    const normalized = trimmed.replace(/,/g, "");
    if (!Number.isFinite(Number(normalized))) {
      toast({ title: "Error", variant: "destructive", description: "Invalid number" });
      return;
    }
    onAddCustomCount?.(trimmed);
    setNewCustomCount("");
    setIsAddingCustomCount(false);
  };

  const handleCustomCountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitCustomCount();
    } else if (e.key === "Escape") {
      setNewCustomCount("");
      setIsAddingCustomCount(false);
    }
  };

  const formatValue = (value: string | number | undefined): string => {
    if (value == null) return "—";
    if (typeof value === "number") return value.toLocaleString();
    return value;
  };

  const leftColumn = (
    <>
      {activeEntries.map((entry, index) => {
        const meta = getVariantMeta(entry.label);
        const hasValue = entry.value != null;
        const isUserAdded = isUserAddedEntry(entry);

        return (
          <div
            key={entry.id}
            className={classNames(
              "h-[37px] flex items-center justify-center",
              "cursor-default select-none",
              "bg-[#3E5552]",
              index < activeEntries.length - 1 &&
                "border-b border-gray-moderate border-solid",
            )}
          >
            <div
              className={classNames(
                "w-[20px] h-[20px] rounded-full flex items-center justify-center",
                "text-[10px] font-semibold transition-colors",
                hasValue
                ? "bg-black/30 text-white/60"
                : "bg-black/20 text-white/30",
              )}
            >
              {isUserAdded ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : meta.icon === "low" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : meta.icon === "high" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V12M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : meta.icon === "range" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 8L4.8 5.25M1.5 8L4.8 10.75M14.5 8L11.2 5.25M14.5 8L11.2 10.75M4.8 8H11.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.4707 11.1244C12.4707 12.0209 11.6972 12.7476 10.7429 12.7476C9.78869 12.7476 9.01514 12.0209 9.01514 11.1244C9.01514 10.228 9.78869 9.50136 10.7429 9.50136C11.6972 9.50136 12.4707 10.228 12.4707 11.1244Z" fill="currentColor"/>
                  <path d="M9.25134 13.9406H12.2048V22.9302H9.25134V13.9406Z" fill="currentColor"/>
                  <path d="M16.9597 13.9406H14.0063V22.9302H16.9597C16.9597 22.9302 16.9597 20.1002 16.9597 18.3307C16.9597 17.2686 17.3208 16.2019 18.7613 16.2019C20.3894 16.2019 20.3795 17.5918 20.372 18.6686C20.3621 20.076 20.3857 21.5124 20.3857 22.9302H23.3392V18.1857C23.3142 15.1562 22.5283 13.7603 19.9427 13.7603C18.4072 13.7603 17.4555 14.4605 16.9597 15.094V13.9406Z" fill="currentColor"/>
                </svg>
              )}
            </div>
          </div>
        );
      })}

      <div
        className={classNames(
          "h-[38px] flex items-center justify-center",
          "transition-colors",
          activeEntries.length > 0 && "border-t border-gray-moderate border-solid",
          isAddingCustomCount && !(newCustomCount.trim() && Number.isFinite(Number(newCustomCount.replace(/,/g, "").trim())))
            ? "bg-[#2A3B39] cursor-default"
            : "bg-[#3E5552] cursor-pointer hover:bg-[#1D1E20]",
        )}
        onClick={() => {
          if (isAddingCustomCount && newCustomCount.trim()) {
            handleSubmitCustomCount();
          } else {
            setIsAddingCustomCount(true);
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 3.5V12.5M3.5 8H12.5"
            stroke={isAddingCustomCount && newCustomCount.trim() && Number.isFinite(Number(newCustomCount.replace(/,/g, "").trim())) ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );

  const rightColumn = (
    <>
      {activeEntries.map((entry, index) => {
        const meta = getVariantMeta(entry.label);
        const hasValue = entry.value != null;

        return (
          <div
            key={entry.id}
            className={classNames(
              "group h-[37px] flex items-center px-[14px]",
              "cursor-pointer",
              "hover:bg-[#1D1E20] transition-colors",
              index < activeEntries.length - 1 &&
                "border-b border-gray-moderate border-solid",
            )}
            onClick={() => hasValue && onSetPrimary(entry.id)}
          >
            <div className="flex flex-col gap-[1px] overflow-hidden flex-1">
              <div className="flex items-center gap-[6px]">
                <span className="text-[11px] text-white/40 truncate leading-none">
                  {meta.label}
                </span>
                {entry.isPrimary && (
                  <span className="px-[6px] py-0 text-[9px] font-semibold uppercase bg-[#39D0B5] text-black rounded-[4px] tracking-wide leading-[11px]">
                    Primary
                  </span>
                )}
              </div>
              <span
                className={classNames(
                  "text-[13px] leading-none truncate",
                  hasValue ? "text-white/75" : "text-white/25",
                )}
                title={hasValue ? formatValue(entry.value) : undefined}
              >
                {formatValue(entry.value)}
              </span>
            </div>

            {hasValue && (
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-[8px] p-[4px] hover:bg-white/10 rounded flex-shrink-0"
                onClick={(e) => handleMenuToggle(e, entry.id)}
              >
                <svg
                  width="3"
                  height="13"
                  viewBox="0 0 3 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#9CA3AF" />
                  <circle cx="1.5" cy="6.5" r="1.5" fill="#9CA3AF" />
                  <circle cx="1.5" cy="11.5" r="1.5" fill="#9CA3AF" />
                </svg>
              </button>
            )}
          </div>
        );
      })}

      <div
        className={classNames(
          "h-[38px] flex items-center pr-[14px] pl-[14px]",
          !isAddingCustomCount && "cursor-pointer hover:bg-[#1D1E20]",
          "transition-colors",
          activeEntries.length > 0 && "border-t border-gray-moderate border-solid",
        )}
        onClick={() => !isAddingCustomCount && setIsAddingCustomCount(true)}
      >
        {isAddingCustomCount ? (
          <input
            type="text"
            value={newCustomCount}
            onChange={(e) => setNewCustomCount(e.target.value)}
            onKeyDown={handleCustomCountKeyDown}
            placeholder="Additional count"
            autoFocus
            className="w-full bg-transparent text-[15px] text-white/75 placeholder:text-white/40 outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-[15px] text-white/40">Additional count</span>
        )}
      </div>
    </>
  );

  return (
    <>
      <MailboxDropdown
        onClick={(e) => e.stopPropagation()}
        leftColumnClickable={true}
        leftColumn={leftColumn}
        rightColumn={rightColumn}
      />

      {openMenuId &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] bg-[#1E1F21] border border-[#3A3C3E] rounded-[8px] py-[4px] shadow-lg flex flex-col whitespace-nowrap"
            style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
          >
            {(() => {
              const entry = activeEntries.find((e) => e.id === openMenuId);
              if (!entry) return null;
              return (
                <>
                  <button
                    className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                    onClick={(e) => handleCopyValue(e, entry)}
                  >
                    Copy value
                  </button>
                  {!entry.isPrimary && (
                    <button
                      className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                      onClick={(e) => handleSetPrimaryFromMenu(e, openMenuId)}
                    >
                      Set as Primary
                    </button>
                  )}
                  {isUserAddedEntry(entry) && (
                    <button
                      className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#F87171] hover:bg-white/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry?.(entry.id);
                        setOpenMenuId(null);
                        setMenuPosition(null);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </>
              );
            })()}
          </div>,
          document.body,
        )}
    </>
  );
};
