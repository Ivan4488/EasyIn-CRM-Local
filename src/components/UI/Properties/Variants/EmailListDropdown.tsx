import classNames from "classnames";
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";
import { DomainWarning } from "~/icons/ui/DomainWarning";
import { isCompanyDomainValid } from "~/utils/domainValidation";
import { useToast } from "~/components/UI/hooks/use-toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../../Tooltip/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { MailboxDropdown } from "./MailboxDropdown";

const getEmailDomainInvalid = (email?: string): boolean => {
  if (!email) return false;
  const domain = email.split("@")[1];
  if (!domain) return false;
  return !isCompanyDomainValid(domain).valid;
};

type EmailAction = 'do-not-use' | 'bad-email' | null;

interface EmailEntry {
  id?: string;
  email: string;
  source: string;
  isPrimary?: boolean;
  action?: EmailAction;
  companyName?: string;
}

interface EmailListDropdownProps {
  emails: EmailEntry[];
  companyDomain?: string;
  companyName?: string;
  onSetPrimary?: (id: string) => void;
  onAddEmail: (email: string) => void;
  onSetAction?: (id: string, action: EmailAction) => void;
  onEditEmail?: (id: string, newEmail: string) => void;
  onDeleteEmail?: (id: string) => void;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getSourceTooltip = (source: string, hasEmail: boolean, isPrimary?: boolean, isCompanySlot?: boolean): string => {
  if (source === "LinkedIn") return "LinkedIn sourced email";
  if (source === "Domain 1" || source === "Domain 2") {
    return hasEmail
      ? `${source} sourced email`
      : "Domain emails will be available within the CRM a few minutes after creation";
  }
  if (isCompanySlot) {
    return hasEmail
      ? `${source} sourced email`
      : "Domain emails will be available within the CRM a few minutes after creation";
  }
  if (source === "Additional") return hasEmail ? "Additional email you supplied" : "Additional email";
  return "Email";
};

export const EmailListDropdown = ({ emails, companyDomain, companyName, onSetPrimary, onAddEmail, onSetAction, onEditEmail, onDeleteEmail }: EmailListDropdownProps) => {
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [showExcluded, setShowExcluded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close menu on click outside
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

  const handleSubmitEmail = () => {
    const trimmed = newEmail.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      toast({ title: "Error", variant: "destructive", description: "Invalid email address" });
      return;
    }
    onAddEmail(trimmed);
    setNewEmail("");
    setIsAddingEmail(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitEmail();
    } else if (e.key === "Escape") {
      setNewEmail("");
      setIsAddingEmail(false);
    }
  };

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
      setOpenMenuId(id);
    }
  };

  const handleSetPrimaryFromMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSetPrimary?.(id);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleSetAction = (e: React.MouseEvent, id: string, action: EmailAction) => {
    e.stopPropagation();
    onSetAction?.(id, action);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleStartEdit = (e: React.MouseEvent, id: string, currentEmail: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(currentEmail);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const handleSubmitEdit = () => {
    const trimmed = editValue.trim();
    if (editingId && trimmed) {
      if (!isValidEmail(trimmed)) {
        toast({ title: "Error", variant: "destructive", description: "Invalid email address" });
        return;
      }
      onEditEmail?.(editingId, trimmed);
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitEdit();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditValue("");
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteEmail?.(id);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  // Build dynamic slots based on email data
  type SlotDef = { key: string; label: string; initial: string; isCompanySlot: boolean };

  const dynamicSlots = useMemo((): SlotDef[] => {
    const slots: SlotDef[] = [];

    // 1. LinkedIn (always first)
    slots.push({ key: "LinkedIn", label: "LinkedIn", initial: "L", isCompanySlot: false });

    // 2. Company slots from email entries
    const companyNamesFromEmails = new Set<string>();
    emails.forEach((e) => {
      if (e.source === "Company" && e.companyName) {
        companyNamesFromEmails.add(e.companyName);
      }
    });
    companyNamesFromEmails.forEach((name) => {
      slots.push({
        key: `Company:${name}`,
        label: name,
        initial: name.charAt(0).toUpperCase(),
        isCompanySlot: true,
      });
    });

    // 3. Legacy Domain 1/Domain 2 — only if old-format emails exist
    const hasLegacyDomain1 = emails.some((e) => {
      const s = e.source.toLowerCase();
      return s === "domain" || s === "domain1" || s === "domain 1";
    });
    const hasLegacyDomain2 = emails.some((e) => {
      const s = e.source.toLowerCase();
      return s === "domain2" || s === "domain 2";
    });
    if (hasLegacyDomain1) {
      slots.push({ key: "Domain 1", label: "Domain 1", initial: "D1", isCompanySlot: false });
    }
    if (hasLegacyDomain2) {
      slots.push({ key: "Domain 2", label: "Domain 2", initial: "D2", isCompanySlot: false });
    }

    // 4. Additional (always last)
    slots.push({ key: "Additional", label: "Additional", initial: "A", isCompanySlot: false });

    return slots;
  }, [emails]);

  // Create a map of emails by slot key for quick lookup
  const emailsBySource = useMemo(() => {
    const acc: Record<string, EmailEntry[]> = {};
    emails.forEach((email) => {
      let key: string;
      if (email.source === "Company" && email.companyName) {
        key = `Company:${email.companyName}`;
      } else {
        // Normalize legacy source names
        const lowerSource = email.source.toLowerCase();
        if (lowerSource === "domain" || lowerSource === "domain1" || lowerSource === "domain 1") {
          key = "Domain 1";
        } else if (lowerSource === "domain2" || lowerSource === "domain 2") {
          key = "Domain 2";
        } else {
          key = email.source;
        }
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key]!.push({ ...email, source: key === email.source ? email.source : key });
    });
    return acc;
  }, [emails]);

  // Build the display rows from dynamic slots
  const displayRows: { source: string; initial: string; email: EmailEntry | null; isCompanySlot: boolean }[] = [];

  dynamicSlots.forEach((slot) => {
    const sourceEmails = emailsBySource[slot.key] || [];
    if (sourceEmails.length > 0) {
      sourceEmails.forEach((email) => {
        displayRows.push({
          source: slot.label,
          initial: slot.initial,
          email,
          isCompanySlot: slot.isCompanySlot,
        });
      });
    } else {
      displayRows.push({
        source: slot.label,
        initial: slot.initial,
        email: null,
        isCompanySlot: slot.isCompanySlot,
      });
    }
  });

  // Add any emails from sources not in our dynamic slots
  const knownKeys = new Set(dynamicSlots.map((s) => s.key));
  Object.entries(emailsBySource).forEach(([key, sourceEmails]) => {
    if (!knownKeys.has(key)) {
      sourceEmails.forEach((email) => {
        displayRows.push({
          source: key,
          initial: key.charAt(0).toUpperCase(),
          email,
          isCompanySlot: false,
        });
      });
    }
  });

  // Split into active and excluded rows
  const activeRows = displayRows.filter((row) => !row.email?.action);
  const excludedRows = displayRows.filter((row) => !!row.email?.action);
  const excludedCount = excludedRows.length;

  // All rows for the menu lookup
  const allEmailRows = [...activeRows, ...excludedRows];

  return (
    <>
      <MailboxDropdown onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-[39px_1fr]">
        {/* Left Column - Avatars */}
        <div className="rounded-l-[12px] overflow-hidden relative">
          {/* Active rows */}
          {activeRows.map((row, index) => (
            <TooltipProvider key={row.email?.id || `${row.source}-${index}`} delayDuration={0}>
              <Tooltip disableHoverableContent>
                <TooltipTrigger asChild>
                  <div
                    className={classNames(
                      "h-[37px] flex items-center justify-center",
                      "cursor-default select-none",
                      "bg-[#3E5552]",
                      index < activeRows.length - 1 && "border-b border-gray-moderate"
                    )}
                  >
                    {(() => {
                      const isDomainBad = getEmailDomainInvalid(row.email?.email);
                      const isEmptySlot = ((row.source === "Domain 1" || row.source === "Domain 2") && !row.email?.email) || (row.isCompanySlot && !row.email?.email);
                      const isCurrentCompanySlot = row.isCompanySlot && !!companyName && row.email?.companyName === companyName;
                      const isCompanyDomainBad = isCurrentCompanySlot && (!companyDomain || !isCompanyDomainValid(companyDomain).valid);
                      if (isDomainBad || isCompanyDomainBad) {
                        return <DomainWarning className="w-[16px] h-[16px] text-[#FFD063]" />;
                      }
                      if (isEmptySlot) {
                        return <Clock className="w-[16px] h-[16px] text-white/60" />;
                      }
                      return (
                        <div
                          className={classNames(
                            "w-[20px] h-[20px] rounded-full flex items-center justify-center",
                            "text-[10px] font-semibold transition-colors",
                            row.email ? "bg-black/30 text-white/60" : "bg-black/20 text-white/30"
                          )}
                        >
                          {row.initial}
                        </div>
                      );
                    })()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" alignOffset={0} sideOffset={4} className="max-w-[220px]">
                  {(() => {
                    if (getEmailDomainInvalid(row.email?.email)) return "This email uses a domain that doesn't look like a company website";
                    const isCurrentCompanySlot = row.isCompanySlot && !!companyName && row.email?.companyName === companyName;
                    if (isCurrentCompanySlot && !companyDomain) return "Company domain is missing";
                    if (isCurrentCompanySlot && companyDomain && !isCompanyDomainValid(companyDomain).valid) return "This domain doesn't look like a company website";
                    return getSourceTooltip(row.source, !!row.email?.email, row.email?.isPrimary, row.isCompanySlot);
                  })()}
                  <TooltipArrow className="fill-gray-moderate" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {/* Add Email Row - Left */}
          <div
            className={classNames(
              "h-[38px] flex items-center justify-center",
              "transition-colors",
              activeRows.length > 0 && "border-t border-gray-moderate",
              isAddingEmail && !(newEmail.trim() && isValidEmail(newEmail.trim()))
                ? "bg-[#2A3B39] cursor-default"
                : "bg-[#3E5552] cursor-pointer hover:bg-[#1D1E20]"
            )}
            onClick={() => {
              if (isAddingEmail && newEmail.trim() && isValidEmail(newEmail.trim())) {
                handleSubmitEmail();
              } else {
                setIsAddingEmail(true);
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.5V12.5M3.5 8H12.5" stroke={isAddingEmail && newEmail.trim() && isValidEmail(newEmail.trim()) ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.15)"} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Excluded toggle - Left */}
          {excludedCount > 0 && (
            <div
              className={classNames(
                "h-[37px] flex items-center justify-center cursor-pointer",
                "transition-colors",
                "border-t border-gray-moderate"
              )}
              style={{ background: showExcluded ? 'rgba(255, 208, 99, 0.08)' : '#3E5552' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowExcluded(!showExcluded);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 10L5 7M8 10L11 7"
                  stroke={showExcluded ? "rgba(255, 208, 99, 0.7)" : "rgba(255, 255, 255, 0.4)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform={showExcluded ? "rotate(180 8 8)" : undefined}
                />
              </svg>
            </div>
          )}
          {/* Excluded rows - Left */}
          {showExcluded && excludedRows.map((row, index) => (
            <div
              key={row.email?.id || `excluded-${row.source}-${index}`}
              className={classNames(
                "h-[37px] flex items-center justify-center opacity-50",
                "transition-colors",
                index < excludedRows.length - 1 && "border-b border-gray-moderate"
              )}
              style={{ background: 'rgba(255, 208, 99, 0.05)' }}
            >
              <div
                className={classNames(
                  "w-[20px] h-[20px] rounded-full flex items-center justify-center",
                  "text-[10px] font-semibold transition-colors",
                  row.email?.action === 'bad-email'
                    ? "bg-[#F87171]/30 text-[#F87171]"
                    : "bg-black/30 text-white/60"
                )}
              >
                {row.initial}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Email Details */}
        <div className="min-w-0">
          {/* Active rows */}
          {activeRows.map((row, index) => (
            <div
              key={row.email?.id || `${row.source}-${index}`}
              className={classNames(
                "group h-[37px] flex items-center px-[14px]",
                "cursor-pointer",
                "hover:bg-[#1D1E20] transition-colors",
                index < activeRows.length - 1 && "border-b border-gray-moderate"
              )}
              onClick={() => row.email?.id && onSetPrimary?.(row.email.id)}
            >
              <div className="flex flex-col gap-[1px] overflow-hidden flex-1">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[11px] text-white/40 truncate leading-none">
                    {row.source}
                  </span>
                  {row.email?.isPrimary && (
                    <span className="px-[6px] py-0 text-[9px] font-semibold uppercase bg-[#39D0B5] text-black rounded-[4px] tracking-wide leading-[11px]">
                      Primary
                    </span>
                  )}
                </div>
                {editingId === row.email?.id ? (
                  <input
                    type="email"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={handleSubmitEdit}
                    autoFocus
                    className="w-full bg-transparent text-[15px] text-white/75 placeholder:text-white/40 outline-none leading-none p-0 border-0 m-0 h-[15px]"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className={classNames(
                      "text-[15px] leading-none truncate",
                      row.email ? "text-white/75" : "text-white/25"
                    )}
                    title={row.email?.email || undefined}
                  >
                    {row.email?.email || "—"}
                  </span>
                )}
              </div>
              {/* 3-dot menu button */}
              {row.email && row.email.id && editingId !== row.email.id && (
                <button
                  ref={(el) => { buttonRefs.current[row.email!.id!] = el; }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-[8px] p-[4px] hover:bg-white/10 rounded flex-shrink-0"
                  onClick={(e) => handleMenuToggle(e, row.email!.id!)}
                >
                  <svg width="3" height="13" viewBox="0 0 3 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="#9CA3AF"/>
                    <circle cx="1.5" cy="6.5" r="1.5" fill="#9CA3AF"/>
                    <circle cx="1.5" cy="11.5" r="1.5" fill="#9CA3AF"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
          {/* Add Email Row - Right */}
          <div
            className={classNames(
              "h-[38px] flex items-center px-[14px]",
              !isAddingEmail && "cursor-pointer hover:bg-[#1D1E20]",
              "transition-colors",
              activeRows.length > 0 && "border-t border-gray-moderate"
            )}
            onClick={() => !isAddingEmail && setIsAddingEmail(true)}
          >
            {isAddingEmail ? (
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter email address"
                autoFocus
                className="w-full bg-transparent text-[15px] text-white/75 placeholder:text-white/40 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-[15px] text-white/40">
                Add email
              </span>
            )}
          </div>
          {/* Excluded toggle - Right */}
          {excludedCount > 0 && (
            <div
              className={classNames(
                "h-[37px] flex items-center px-[14px] cursor-pointer",
                "transition-colors",
                "border-t border-gray-moderate"
              )}
              style={{ background: showExcluded ? 'rgba(255, 208, 99, 0.08)' : undefined }}
              onClick={(e) => {
                e.stopPropagation();
                setShowExcluded(!showExcluded);
              }}
            >
              <span
                className="text-[13px] font-medium uppercase tracking-wide"
                style={{ color: showExcluded ? 'rgba(255, 208, 99, 0.9)' : 'rgba(255, 255, 255, 0.4)' }}
              >
                {showExcluded ? `Excluded (${excludedCount})` : `Show excluded (${excludedCount})`}
              </span>
            </div>
          )}
          {/* Excluded rows - Right */}
          {showExcluded && excludedRows.map((row, index) => (
            <div
              key={row.email?.id || `excluded-${row.source}-${index}`}
              className={classNames(
                "group h-[37px] flex items-center px-[14px] opacity-50",
                "transition-colors",
                index < excludedRows.length - 1 && "border-b border-gray-moderate"
              )}
              style={{ background: 'rgba(255, 208, 99, 0.03)' }}
            >
              <div className="flex flex-col gap-[1px] overflow-hidden flex-1">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[11px] text-white/40 truncate leading-none">
                    {row.source}
                  </span>
                  {row.email?.action === 'bad-email' && (
                    <span className="px-[6px] py-[2px] text-[9px] font-semibold uppercase bg-[#F87171]/20 text-[#F87171] rounded-[4px] tracking-wide">
                      Bad
                    </span>
                  )}
                  {row.email?.action === 'do-not-use' && (
                    <span className="px-[6px] py-[2px] text-[9px] font-semibold uppercase bg-white/10 text-white/50 rounded-[4px] tracking-wide">
                      Excluded
                    </span>
                  )}
                </div>
                <span
                  className="text-[15px] leading-none truncate text-white/75 line-through"
                  title={row.email?.email || undefined}
                >
                  {row.email?.email || "—"}
                </span>
              </div>
              {/* 3-dot menu button */}
              {row.email && row.email.id && (
                <button
                  ref={(el) => { buttonRefs.current[row.email!.id!] = el; }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-[8px] p-[4px] hover:bg-white/10 rounded flex-shrink-0"
                  onClick={(e) => handleMenuToggle(e, row.email!.id!)}
                >
                  <svg width="3" height="13" viewBox="0 0 3 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="#9CA3AF"/>
                    <circle cx="1.5" cy="6.5" r="1.5" fill="#9CA3AF"/>
                    <circle cx="1.5" cy="11.5" r="1.5" fill="#9CA3AF"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      </MailboxDropdown>

      {/* Portal menu */}
      {openMenuId && menuPosition && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-[#1E1F21] border border-[#3A3C3E] rounded-[8px] py-[4px] shadow-lg flex flex-col whitespace-nowrap"
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
          }}
        >
          {(() => {
            const row = allEmailRows.find((r) => r.email?.id === openMenuId);
            if (!row?.email) return null;
            const email = row.email;
            const isExcluded = !!email.action;
            return isExcluded ? (
              <>
                <button
                  className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(email.email);
                    setOpenMenuId(null);
                    setMenuPosition(null);
                  }}
                >
                  Copy email
                </button>
                <button
                  className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#4ADE80] hover:bg-white/10 transition-colors"
                  onClick={(e) => handleSetAction(e, openMenuId, null)}
                >
                  Mark as good
                </button>
                <button
                  className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#F87171] hover:bg-white/10 transition-colors"
                  onClick={(e) => handleDelete(e, openMenuId)}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(email.email);
                    setOpenMenuId(null);
                    setMenuPosition(null);
                  }}
                >
                  Copy email
                </button>
                {!email.isPrimary && (
                  <button
                    className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                    onClick={(e) => handleSetPrimaryFromMenu(e, openMenuId)}
                  >
                    Set as Primary
                  </button>
                )}
                <button
                  className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                  onClick={(e) => handleSetAction(e, openMenuId, email.action === 'do-not-use' ? null : 'do-not-use')}
                >
                  {email.action === 'do-not-use' ? 'Allow use' : 'Do not use'}
                </button>
                {row.source === "Additional" && onEditEmail && (
                  <button
                    className="w-full text-left px-[12px] py-[6px] text-[13px] text-white/80 hover:bg-white/10 transition-colors"
                    onClick={(e) => handleStartEdit(e, openMenuId, email.email)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={classNames(
                    "w-full text-left px-[12px] py-[6px] text-[13px] hover:bg-white/10 transition-colors",
                    email.action === 'bad-email' ? "text-[#4ADE80]" : "text-[#F87171]"
                  )}
                  onClick={(e) => handleSetAction(e, openMenuId, email.action === 'bad-email' ? null : 'bad-email')}
                >
                  {email.action === 'bad-email' ? 'Mark as good' : 'Bad email'}
                </button>
                {row.source === "Additional" && onDeleteEmail && (
                  <button
                    className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#F87171] hover:bg-white/10 transition-colors"
                    onClick={(e) => handleDelete(e, openMenuId)}
                  >
                    Delete
                  </button>
                )}
              </>
            );
          })()}
        </div>,
        document.body
      )}
    </>
  );
};
