import { Collapsable } from "../Collapsable/Collapsable";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Combobox, ComboboxItem } from "../Combobox/Combobox";
import { Dots } from "~/icons/ui/Dots";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";

export interface MenuSectionConfig {
  id: string;
  title: string;
  hasFullHeight?: boolean;
  hideIfOtherFullHeight?: boolean;
  defaultActive?: boolean;
  children?: React.ReactNode;
  menuItems?: ComboboxItem[];
  onMenuChangeCallback?: (value: string) => void;
  hideMenu?: boolean;
}

export const MenuSectionCollapsible = ({
  id,
  title,
  defaultActive,
  hideIfOtherFullHeight = false,
  children,
  menuItems,
  onMenuChangeCallback,
  hideMenu = false,
}: MenuSectionConfig) => {
  const leftMenuStore = useLeftMenuStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();

  useEffect(() => {
    if (defaultActive) {
      leftMenuStore.activateSection(id);
    }
  }, [defaultActive]);

  const [isActive, setIsActive] = useState(defaultActive);

  useEffect(() => {
    setIsActive(leftMenuStore.isSectionActive(id));
  }, [leftMenuStore.activeSections]);

  const [isCollapsed, setIsCollapsed] = useState(!isActive);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(!isActive);
    }, 150);

    return () => clearTimeout(timer);
  }, [isActive]);

  const onMenuChange = (value: string) => {
    if (value === "collapse") {
      leftMenuStore.toggleSection(id);

      return;
    }

    if (value === "full-height") {
      if (isFullHeight) {
        rightMenuNavigationStore.setFullHeightSection(undefined);
      } else {
        rightMenuNavigationStore.setFullHeightSection(id);
      }
      return;
    }

    if (value === "switch-height") {
      // Toggle between expanded (mid) and collapsed (min) only.
      // Max height is reserved for internal workflows and not user-triggered.
      leftMenuStore.toggleSection(id);
    }

    onMenuChangeCallback?.(value);
  };

  const isFullHeight = rightMenuNavigationStore.fullHeightSection === id;
  const isEditingAssociations = rightMenuNavigationStore.associationSection === "edit";

  let isHidden = false;
  if (
    !isFullHeight &&
    rightMenuNavigationStore.fullHeightSection !== undefined &&
    hideIfOtherFullHeight
  ) {
    isHidden = true;
  }

  return (
    <div className="flex flex-col gap-[4px]" key={id}>
      <AnimatePresence mode="wait" initial={false}>
        {!isHidden && (
          <Collapsable key={`section-title-${id}`} fade>
            <div className="px-[12px] py-[12px] flex flex-row justify-between text-text-weak w-full">
              <div className="flex flex-row justify-start items-center truncate">
                <div className="text-display-12 font-bold text-text-weak truncate pr-[8px] tracking-[1px]">
                  {title}
                </div>
              </div>

              {!isEditingAssociations && !hideMenu && <Combobox
                noHoverTrigger
                items={[
                  { value: `switch-height`, label: isActive ? "Hide" : "Show" },
                  ...(menuItems ?? []),
                ]}
                align="end"
                value="none"
                onChange={onMenuChange}
                name="menu"
                trigger={
                  isCollapsed ? (
                    <div className="h-[26px] flex flex-row gap-[8px] w-fit px-[10px] py-[4px] bg-hover-1 text-text-weak rounded-[4px] justify-end items-center border border-solid border-gray-moderate hover:border-hover-2">
                      <div className="text-display-12 font-semibold">Hidden</div>
                      <Dots className="w-[12px] h-[4px]" />
                    </div>
                  ) : (
                    <div className="h-[26px] flex flex-row items-center gap-[8px] px-[10px] py-[4px] hover:bg-hover-1 rounded-[4px] border border-solid border-transparent">
                      <Dots className="w-[12px] h-[4px]" />
                    </div>
                  )
                }
              />}
            </div>
          </Collapsable>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {isActive && !isHidden && (
          <Collapsable key={`section-${id}`} fade shiftY={-4}>
            {children}
          </Collapsable>
        )}
      </AnimatePresence>
    </div>
  );
};
