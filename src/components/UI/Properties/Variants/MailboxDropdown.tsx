import classNames from "classnames";
import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Shared mailbox dropdown shell used by Email + Employee Count variants.
 * Keep base container/column frame behaviour here; avoid per-variant duplication.
 *
 * Standard shell features (always present):
 *  - Teal perimeter border
 *  - Left column is pointer-events-none by default (pass leftColumnClickable={true} to override)
 *
 * Two usage modes:
 *  - leftColumn + rightColumn props: MailboxDropdown owns the two-column grid (used by EmployeeCountListDropdown)
 *  - children: caller owns the layout entirely (used by EmailListDropdown)
 */
interface MailboxDropdownProps {
  isLeft?: boolean;
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  leftColumnClickable?: boolean;
}

export const MailboxDropdown = ({
  isLeft,
  leftColumn,
  rightColumn,
  children,
  onClick,
  leftColumnClickable = false,
}: MailboxDropdownProps) => {
  return (
    <div
      className="bg-[#141414] rounded-[12px] border-[1.5px] border-[#39D0B5] border-solid overflow-hidden relative"
      onClick={onClick}
    >
      {children ? (
        // children mode: caller owns internal layout entirely
        children
      ) : (
        // column mode: MailboxDropdown owns the two-column grid
        <div className={classNames("flex", isLeft && "flex-row-reverse")}>
          <div
            className={classNames(
              "w-[39px] flex-shrink-0 overflow-hidden relative",
              isLeft ? "rounded-r-[12px]" : "rounded-l-[12px]",
              !leftColumnClickable && "pointer-events-none",
            )}
          >
            {leftColumn}
          </div>
          <div className="flex-1 min-w-0">{rightColumn}</div>
        </div>
      )}
    </div>
  );
};

/**
 * Label row rendered above a mailbox dropdown.
 * Shows the property title on the left and a close hint on the right.
 * The entire row is the close target — nothing outside it closes the dropdown.
 */
interface MailboxLabelRowProps {
  title: string;
  onClose: () => void;
}

export const MailboxLabelRow = ({ title, onClose }: MailboxLabelRowProps) => {
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
        className="text-[11px] select-none"
        style={{
          color: hovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
          transition: "color 0.15s ease",
        }}
      >
        click here to close
      </span>
    </div>
  );
};
