import { useState, useRef, useEffect } from "react";
import { Dots } from "~/icons/ui/Dots";
import { GreenDot } from "~/icons/ui/GreenDot";
import { BlueDot } from "~/icons/ui/BlueDot";

type MismatchOrigin = "source" | "target";

interface PropertyMismatchProps {
  propertyName: string;
  sourceValue: string;
  targetValue: string;
  selectedOrigin: MismatchOrigin;
  onSelect: (origin: MismatchOrigin) => void;
  onValueEdit?: (value: string) => void;
}

// ── Source icons — mirrors App's CRM / LinkedIn icons ────────────────────────
// target = existing contact = green (CRM-style)
// source = incoming duplicate = blue (LinkedIn-style)

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18.3416 8.15648C18.6716 8.11443 19.0049 8.20615 19.2674 8.41039L21.9676 10.5139H21.9685C22.5129 10.9383 22.6094 11.7244 22.1853 12.2688C21.7609 12.813 20.9758 12.9095 20.4314 12.4856L20.241 12.3371C20.0641 16.7371 16.4431 20.2501 11.9998 20.2502C10.56 20.2502 9.20299 19.8796 8.02226 19.2287C7.41804 18.8956 7.19718 18.1361 7.53007 17.5315C7.86322 16.9272 8.62371 16.7063 9.22831 17.0393L9.54179 17.1994C10.286 17.552 11.1186 17.7502 11.9998 17.7502C15.0244 17.7501 17.5014 15.4144 17.7303 12.4485L17.491 12.761C17.0707 13.3081 16.2857 13.4119 15.7381 12.9914C15.1908 12.5708 15.0882 11.7858 15.5086 11.2385L17.5086 8.635L17.5164 8.62425H17.5174L17.5818 8.55004L17.5887 8.54125H17.5896C17.787 8.33129 18.0521 8.19345 18.3416 8.15648ZM18.4051 8.65257C18.2322 8.67465 18.0729 8.75737 17.9539 8.88402L17.8973 8.95043L15.9051 11.5432C15.6527 11.8717 15.7146 12.3426 16.0428 12.595C16.371 12.847 16.8421 12.7849 17.0945 12.4563L17.7937 11.5452C17.8575 11.4622 17.9663 11.4282 18.0662 11.4592C18.1663 11.4905 18.2368 11.5811 18.242 11.6858C18.2471 11.7892 18.2498 11.8944 18.2498 12.0002C18.2496 15.4517 15.4513 18.2501 11.9998 18.2502C10.906 18.2502 9.87968 17.9689 8.9871 17.4768C8.62454 17.2771 8.16757 17.4099 7.96757 17.7727C7.76816 18.1352 7.9008 18.5913 8.26347 18.7912C9.37224 19.4024 10.6467 19.7502 11.9998 19.7502C16.2798 19.7501 19.7496 16.2802 19.7498 12.0002C19.7498 11.9426 19.7465 11.9105 19.7449 11.8352C19.7429 11.7388 19.7964 11.649 19.8826 11.6057C19.9687 11.5625 20.0722 11.5731 20.1482 11.6321L20.7381 12.0911C21.0648 12.3456 21.5363 12.2875 21.7908 11.9612C22.0454 11.6344 21.9873 11.1629 21.6609 10.9084L18.9607 8.80492C18.8032 8.68224 18.603 8.62743 18.4051 8.65257Z"
      fill="url(#target_dim_grad)" fillOpacity="0.45"
    />
    <path
      d="M6.79205 11.4932C7.18229 11.1024 7.81628 11.1019 8.20708 11.4922C8.59765 11.8823 8.59789 12.5155 8.20806 12.9062L6.09869 15.0186C5.74559 15.3722 5.18549 15.411 4.78716 15.1094L2.39556 13.2969C1.9557 12.9632 1.86966 12.3355 2.20318 11.8955C2.53684 11.4556 3.16451 11.3696 3.60455 11.7031L4.00005 12.0029V12C4.00005 7.58172 7.58178 4 12.0001 4C13.0496 4 14.0546 4.20309 14.9756 4.57227C15.4879 4.77794 15.7367 5.35962 15.5313 5.87207C15.3258 6.38462 14.7441 6.63307 14.2315 6.42773C13.5432 6.15182 12.7904 6 12.0001 6C8.68635 6 6.00005 8.68629 6.00005 12C6.00005 12.0937 6.00266 12.1868 6.00689 12.2793L6.79205 11.4932Z"
      fill="url(#target_arrow_grad)"
    />
    <defs>
      <linearGradient id="target_dim_grad" x1="26.118" y1="20.0001" x2="-5.72547" y2="20.0001" gradientUnits="userSpaceOnUse">
        <stop stopColor="#AFEA84" />
        <stop offset="1" stopColor="#FFFC63" />
      </linearGradient>
      <linearGradient id="target_arrow_grad" x1="15.6034" y1="4" x2="12.7855" y2="17.5543" gradientUnits="userSpaceOnUse">
        <stop stopColor="#03C091" />
        <stop offset="1" stopColor="#34FFCC" />
      </linearGradient>
    </defs>
  </svg>
);

const SourceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18.3419 8.15648C18.672 8.11443 19.0052 8.20615 19.2677 8.41039L21.9679 10.5139H21.9689C22.5132 10.9383 22.6097 11.7244 22.1857 12.2688C21.7612 12.813 20.9761 12.9095 20.4318 12.4856L20.2413 12.3371C20.0644 16.7371 16.4434 20.2501 12.0001 20.2502C10.5603 20.2502 9.20331 19.8796 8.02257 19.2287C7.41836 18.8956 7.19749 18.1361 7.53038 17.5315C7.86353 16.9272 8.62402 16.7063 9.22863 17.0393L9.5421 17.1994C10.2863 17.552 11.1189 17.7502 12.0001 17.7502C15.0247 17.7501 17.5017 15.4144 17.7306 12.4485L17.4913 12.761C17.071 13.3081 16.286 13.4119 15.7384 12.9914C15.1911 12.5708 15.0885 11.7858 15.5089 11.2385L17.5089 8.635L17.5167 8.62425H17.5177L17.5821 8.55004L17.589 8.54125H17.59C17.7874 8.33129 18.0524 8.19345 18.3419 8.15648ZM18.4054 8.65257C18.2325 8.67465 18.0733 8.75737 17.9542 8.88402L17.8976 8.95043L15.9054 11.5432C15.6531 11.8717 15.7149 12.3426 16.0431 12.595C16.3713 12.847 16.8424 12.7849 17.0948 12.4563L17.7941 11.5452C17.8578 11.4622 17.9666 11.4282 18.0665 11.4592C18.1666 11.4905 18.2371 11.5811 18.2423 11.6858C18.2474 11.7892 18.2501 11.8944 18.2501 12.0002C18.2499 15.4517 15.4516 18.2501 12.0001 18.2502C10.9063 18.2502 9.88 17.9689 8.98742 17.4768C8.62486 17.2771 8.16788 17.4099 7.96788 17.7727C7.76847 18.1352 7.90111 18.5913 8.26378 18.7912C9.37255 19.4024 10.647 19.7502 12.0001 19.7502C16.2801 19.7501 19.7499 16.2802 19.7501 12.0002C19.7501 11.9426 19.7468 11.9105 19.7452 11.8352C19.7432 11.7388 19.7968 11.649 19.8829 11.6057C19.969 11.5625 20.0725 11.5731 20.1485 11.6321L20.7384 12.0911C21.0651 12.3456 21.5366 12.2875 21.7911 11.9612C22.0457 11.6344 21.9877 11.1629 21.6612 10.9084L18.961 8.80492C18.8035 8.68224 18.6033 8.62743 18.4054 8.65257Z"
      fill="url(#source_dim_grad)" fillOpacity="0.45"
    />
    <path
      d="M6.79199 11.4932C7.18224 11.1024 7.81623 11.1019 8.20703 11.4922C8.5976 11.8823 8.59784 12.5155 8.20801 12.9062L6.09863 15.0186C5.74554 15.3722 5.18544 15.411 4.78711 15.1094L2.39551 13.2969C1.95564 12.9632 1.8696 12.3355 2.20312 11.8955C2.53679 11.4556 3.16446 11.3696 3.60449 11.7031L4 12.0029V12C4 7.58172 7.58172 4 12 4C13.0495 4 14.0546 4.20309 14.9756 4.57227C15.4879 4.77794 15.7367 5.35962 15.5312 5.87207C15.3258 6.38462 14.744 6.63307 14.2314 6.42773C13.5431 6.15182 12.7903 6 12 6C8.68629 6 6 8.68629 6 12C6 12.0937 6.00261 12.1868 6.00684 12.2793L6.79199 11.4932Z"
      fill="url(#source_arrow_grad)"
    />
    <defs>
      <linearGradient id="source_dim_grad" x1="26.118" y1="20.0001" x2="-5.72547" y2="20.0001" gradientUnits="userSpaceOnUse">
        <stop stopColor="#AFEA84" />
        <stop offset="1" stopColor="#FFFC63" />
      </linearGradient>
      <linearGradient id="source_arrow_grad" x1="8.80162" y1="4" x2="8.80162" y2="21.4395" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00C4FF" />
        <stop offset="1" stopColor="#2285FF" />
      </linearGradient>
    </defs>
  </svg>
);

// ── MailboxLabelRow — mirrors App's MailboxDropdown export ────────────────────
const MailboxLabelRow = ({ title, onClose }: { title: string; onClose: () => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-row items-center justify-between mb-[6px] cursor-pointer"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <label className="text-display-14 font-semibold text-text-weak cursor-pointer select-none">
        {title}
      </label>
      <span
        className="text-[11px] select-none transition-colors duration-150"
        style={{ color: hovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}
      >
        click here to close
      </span>
    </div>
  );
};

// ── Active source icon (collapsed row) ───────────────────────────────────────
const ActiveSourceIcon = ({ origin }: { origin: MismatchOrigin }) =>
  origin === "target" ? <TargetIcon /> : <SourceIcon />;

// ── Main component ────────────────────────────────────────────────────────────
export const PropertyMismatch = ({
  propertyName,
  sourceValue,
  targetValue,
  selectedOrigin,
  onSelect,
  onValueEdit,
}: PropertyMismatchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLabel = selectedOrigin === "target" ? targetValue : sourceValue;

  const close = () => { setIsOpen(false); setIsEditing(false); };

  const handleSelect = (origin: MismatchOrigin) => {
    onSelect(origin);
    close();
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(currentLabel);
    setIsEditing(true);
  };

  const commitEdit = () => {
    if (onValueEdit && editValue !== currentLabel) {
      onValueEdit(editValue);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // rows[0] = current selected, rows[1] = target (green), rows[2] = source (blue)
  const expandedRows = [
    { key: "current" as const,                label: currentLabel },
    { key: "target"  as MismatchOrigin,        label: targetValue  },
    { key: "source"  as MismatchOrigin,        label: sourceValue  },
  ];

  // ── Collapsed ──────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="flex flex-col w-full">
        <label className="text-display-14 font-semibold text-text-weak mb-[6px]">
          {propertyName}
        </label>
        <div
          className="group relative grid overflow-hidden bg-black-moderate rounded-[8px] transition-all duration-[120ms] ease-out"
          style={{ gridTemplateColumns: "41px 1fr 26px" }}
        >
          {/* Border overlay */}
          <div className="absolute inset-0 rounded-[8px] pointer-events-none z-[2] border border-solid border-gray-moderate transition-all duration-[120ms] ease-out group-hover:border-[#4A4C4E]" />

          {/* Mailbox icon — click opens dropdown */}
          <div
            className="relative flex items-center justify-center h-[38px] cursor-pointer transition-all duration-[120ms] ease-out hover:brightness-125"
            style={{ background: "linear-gradient(215deg, rgba(76,155,141,0.15) -61.92%, rgba(76,155,141,0) 123.07%)" }}
            onClick={() => setIsOpen(true)}
          >
            <ActiveSourceIcon origin={selectedOrigin} />
            {/* Teal wedge — matches App's PropertiesMailbox */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 13,
              height: 13,
              background: "#39D0B5",
              clipPath: "polygon(0 40%, 0 100%, 100% 100%)",
              pointerEvents: "none",
              borderBottomLeftRadius: 7,
            }} />
          </div>

          {/* Value text — click to inline edit */}
          <div
            className="flex items-center pl-[10px] text-display-15 font-normal text-white cursor-text truncate hover:text-white/80 transition-colors duration-[120ms]"
            onClick={startEditing}
          >
            {currentLabel || "\u00A0"}
          </div>

          {/* Dots button — opens dropdown */}
          <button
            className="w-[26px] h-[38px] flex items-center justify-center bg-transparent border-l border-solid border-gray-moderate cursor-pointer p-0 transition-[background] duration-[120ms] ease-out hover:bg-white/[0.06] flex-shrink-0"
            onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
          >
            <Dots className="w-[12px] rotate-90" />
          </button>
        </div>

        {/* Inline edit input — shown below the row when editing */}
        {isEditing && (
          <div className="mt-[4px] relative">
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="w-full bg-black-moderate text-white text-display-15 font-normal rounded-[8px] px-[10px] h-[38px] outline-none"
              style={{ border: "1px solid #39D0B5" }}
            />
          </div>
        )}
      </div>
    );
  }

  // ── Expanded ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full">
      <MailboxLabelRow title={propertyName} onClose={close} />
      <div
        className="relative grid overflow-hidden bg-black-section rounded-[8px]"
        style={{ gridTemplateColumns: "41px 1fr" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Teal perimeter border — absolute overlay, zero layout impact */}
        <div className="absolute inset-0 rounded-[8px] pointer-events-none z-[2] border-[1.5px] border-solid border-[#39D0B5]" />

        {/* Mailbox column */}
        <div
          className="flex flex-col rounded-l-[8px]"
          style={{
            background: "linear-gradient(0deg, rgba(173,178,178,0.06) 0%, rgba(173,178,178,0.06) 100%), linear-gradient(215deg, rgba(76,155,141,0.15) -61.92%, rgba(76,155,141,0) 123.07%)",
          }}
        >
          {expandedRows.map((row, index) => (
            <div
              key={row.key}
              className="h-[38px] flex items-center justify-center transition-all duration-[120ms] ease-out relative cursor-pointer"
              style={index !== 0 ? {
                background: hoveredRow === index
                  ? "linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)), #3E5552"
                  : "#3E5552",
              } : undefined}
              onClick={() => index === 0 ? close() : handleSelect(row.key as MismatchOrigin)}
              onMouseEnter={() => index !== 0 && setHoveredRow(index)}
              onMouseLeave={() => index !== 0 && setHoveredRow(null)}
            >
              {index === 0 ? (
                <ActiveSourceIcon origin={selectedOrigin} />
              ) : index === 1 ? (
                <GreenDot />
              ) : (
                <BlueDot />
              )}

              {index < expandedRows.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "#3A3C3E" }} />
              )}
            </div>
          ))}
        </div>

        {/* Content column */}
        <div className="flex flex-col">
          {expandedRows.map((row, index) => (
            <div
              key={row.key}
              className={`h-[38px] flex items-center pl-[10px] text-display-15 font-normal transition-all duration-[120ms] ease-out relative truncate ${
                index === 0 ? "bg-black-moderate text-white cursor-pointer" : "text-white/75 cursor-pointer"
              }`}
              style={{ background: index !== 0 && hoveredRow === index ? "#1D1E20" : undefined }}
              onClick={() => index === 0 ? close() : handleSelect(row.key as MismatchOrigin)}
              onMouseEnter={() => index !== 0 && setHoveredRow(index)}
              onMouseLeave={() => index !== 0 && setHoveredRow(null)}
            >
              {row.label || "\u00A0"}

              {index < expandedRows.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "#3A3C3E" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
