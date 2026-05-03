import classNames from "classnames";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { AddCircle } from "~/icons/ui/AddCircle";
import { Zap } from "~/icons/ui/Zap";
import { Dots } from "~/icons/ui/Dots";
import { Combobox, ComboboxItem } from "~/components/UI/Combobox/Combobox";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { usePaginationStore } from "~/stores/paginationStore";
import { useSelectorStore } from "~/stores/select";

type MenuContext = "main" | "contacts";
export type MenuItemId = `${string}/${MenuContext}`;

export interface MenuItemConfig {
  id: MenuItemId;
  title: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isMultiSelectable?: boolean;
  isAddable?: boolean;
  isWithZigzag?: boolean;
  dotsMenuItems?: ComboboxItem[];
  onDotsMenuChange?: (value: string) => void;
  url?: string;
  noUrlAction?: boolean;
  rightControl?: React.ReactNode;
  customContent?: React.ReactNode;
  pathname?: string;
}

const getBaseMenuItemId = (id: string): string => {
  return id.split("/")[0] || "";
};

export interface MenuItemProps extends MenuItemConfig {
  pathname?: string;
}

export const MenuItem = ({
  id,
  title,
  Icon,
  isAddable,
  isWithZigzag,
  dotsMenuItems,
  onDotsMenuChange,
  pathname,
  isMultiSelectable,
  url,
  noUrlAction,
  rightControl,
  customContent,
}: MenuItemProps) => {
  if (customContent) return <>{customContent}</>;

  const navigate = useNavigate();
  const location = useLocation();
  const leftMenuStore = useLeftMenuStore();
  const selectorStore = useSelectorStore();
  const { setPage } = usePaginationStore();
  const [isDotsOpen, setIsDotsOpen] = React.useState(false);

  const isActive = leftMenuStore.isItemActive(id) || location.pathname === url;
  const isAddActivated = location.pathname.includes(pathname || `/create/${getBaseMenuItemId(id)}`);
  const isRightButtonPresent = isAddable || isWithZigzag || !!dotsMenuItems || !!rightControl;
  const redirectUrl = url || "/";

  const onItemChoose = (id: MenuItemId) => {
    selectorStore.clearSelection();
    selectorStore.setIsSelectAll(false);
    setPage(1);

    if (url) {
      leftMenuStore.setActiveItems([]);
      navigate(url);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
    }

    if (leftMenuStore.isItemActive(id)) {
      leftMenuStore.deactivateItem(id);
      return;
    }

    leftMenuStore.activateItem(id, isMultiSelectable);
  };

  const MenuItemContent = (
    <button
      className={classNames(
        "flex w-full text-display-16 font-semibold flex-row gap-[6px] items-center transition-text rounded-tl-[12px] rounded-bl-[12px] px-[16px] py-[6px]",
        "hover:bg-hover-1",
        isActive ? "text-strong-green" : "text-text-weak",
        !isRightButtonPresent && "rounded-r-[12px]"
      )}
      onClick={() => onItemChoose(id)}
    >
      <div className="w-[43px] h-[40px] flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <div className="text-display-16 font-semibold">{title}</div>
    </button>
  );

  return (
    <div
      className={classNames(
        "flex flex-row items-center justify-between group rounded-[12px]"
      )}
    >
      {MenuItemContent}

      {isAddable && (
        <button
          onClick={() => navigate(isAddActivated ? redirectUrl : `/create/${getBaseMenuItemId(id)}`)}
          className={classNames(
            "group-hover:visible px-[16px] py-[15px] rounded-r-[12px]",
            isAddActivated && "visible text-strong-green",
            !isAddActivated && "invisible text-text-weak",
            "hover:bg-hover-1"
          )}
        >
          <AddCircle />
        </button>
      )}

      {isWithZigzag && (
        <button
          onClick={() => navigate(isAddActivated ? redirectUrl : pathname || redirectUrl)}
          className={classNames(
            "group-hover:visible px-[16px] py-[15px] rounded-r-[12px]",
            isAddActivated && "visible text-strong-green stroke-strong-green",
            !isAddActivated && "invisible text-text-weak",
            "hover:bg-hover-1"
          )}
        >
          <Zap />
        </button>
      )}

      {rightControl && (
        <div className="group-hover:visible invisible text-text-weak rounded-r-[12px]">
          {rightControl}
        </div>
      )}

      {!rightControl && dotsMenuItems && onDotsMenuChange && (
        <div className={classNames(
          "text-text-weak rounded-r-[12px]",
          isDotsOpen ? "visible" : "invisible group-hover:visible"
        )}>
          <Combobox
            items={dotsMenuItems}
            value=""
            onChange={onDotsMenuChange}
            name=""
            align="end"
            trigger={
              <div className="px-[16px] py-[24px] cursor-pointer rounded-r-[12px] hover:bg-hover-1">
                <Dots className="rotate-90" />
              </div>
            }
            hoverBg={false}
            noHoverTrigger
            onOpenChange={setIsDotsOpen}
          />
        </div>
      )}
    </div>
  );
};
