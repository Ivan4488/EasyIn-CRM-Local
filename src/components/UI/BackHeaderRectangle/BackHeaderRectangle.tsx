import { Avatar } from "../Avatar/Avatar";
import { BackButton } from "../Buttons/BackButton";
import { RoundClose } from "../Buttons/CloseResponse";
import { Dots } from "~/icons/ui/Dots";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover";
import { useState } from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface BackHeaderRectangleProps {
  title: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Dedicated handler for the RoundClose button. When provided, fires instead of
   *  (and independently of) the outer div onClick, so the close button always
   *  performs a full close without triggering back-navigation first. */
  onClose?: () => void;
  Icon: React.FC;
  avatar?: string;
  AvatarIcon?: React.FC;
  isRoundClose?: boolean;
  roundCloseTitle?: string;
  menuItems?: MenuItem[];
}

export const BackHeaderRectangle = ({
  title,
  onClick,
  onClose,
  Icon,
  avatar,
  AvatarIcon,
  isRoundClose,
  roundCloseTitle,
  menuItems,
}: BackHeaderRectangleProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = (itemOnClick: () => void) => {
    itemOnClick();
    setIsMenuOpen(false);
  };

  // When onClose is provided (close mode), the entire bar is one unified click
  // target — clicking anywhere fires onClose. No split between bar and badge.
  const handleBarClick = onClose ?? onClick;

  return (
    <div className="h-[94px] shrink-0 border-b-gray-moderate border-solid border-b bg-[#1d2122] flex flex-row cursor-pointer">
      {/* Left zone — icon only, no hover, future click target */}
      <div className="flex h-full text-text-weak w-[48px] items-center justify-center shrink-0 bg-gradient-2 p-[12px]">
        <Icon />
      </div>

      {/* Right zone — title + close, hover and click here */}
      <div
        onClick={handleBarClick}
        className="hover:bg-[#282b2c] group flex items-center justify-between w-full px-[20px] pr-[32px] cursor-pointer"
      >
        <div className="flex items-center justify-start gap-[20px]">
          {AvatarIcon ? (
            <div className="w-[32px] h-[32px] flex items-center justify-center border-2 border-solid border-gray-moderate rounded-full text-text-weak">
              <AvatarIcon />
            </div>
          ) : (
            <Avatar alt={title} src={avatar} />
          )}
          <p className="text-display-18 font-bold">{title}</p>
        </div>

        <div className="flex items-center gap-[8px]">
          {isRoundClose ? (
            <RoundClose title={roundCloseTitle} />
          ) : (
            <BackButton />
          )}
        </div>
      </div>

      {menuItems && (
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center flex-row pr-[12px] pl-[12px] hover:bg-[#282b2c] border-l-gray-moderate border-solid border-l-[1px]"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <div className="p-[4px] rounded text-text-weak">
                <Dots className="rotate-90" />
              </div>
            </button>
          </PopoverTrigger>
          
          <PopoverContent
            className="w-[154px] p-[4px]"
            side="bottom"
            align="end"
            sideOffset={-20}
            alignOffset={20}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className={`px-[12px] py-[8px] text-left text-display-12 font-semibold rounded hover:bg-hover-1 ${
                    item.disabled
                      ? "text-text-disabled cursor-not-allowed"
                      : "text-text-strong cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.disabled) {
                      handleMenuItemClick(item.onClick);
                    }
                  }}
                  disabled={item.disabled}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
