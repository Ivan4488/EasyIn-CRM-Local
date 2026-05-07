import { useLeftMenuStore } from "~/stores/leftMenu";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Dots } from "~/icons/ui/Dots";
import { Combobox } from "~/components/UI/Combobox/Combobox";
import { Collapsable } from "~/components/UI/Collapsable/Collapsable";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { useWatchAndUpdateSectionStore } from "~/stores/watchAndUpdateSectionStore";
import classNames from "classnames";
import { usePropertiesStore } from "~/stores/propertiesStore";

export interface MenuSectionConfig {
  id: string;
  title: string;
  defaultActive?: boolean;
  children?: React.ReactNode;
  onMenuChangeCallback?: (value: string) => void;
}

export const MenuSectionWatchAndUpdate = ({
  id,
  title,
  defaultActive,
  children,
  onMenuChangeCallback,
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

  const {
    isActive: isAutoUpdateActive,
    setIsActive: setIsAutoUpdateActive,
  } = useWatchAndUpdateSectionStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(!isActive);
    }, 150);

    return () => clearTimeout(timer);
  }, [isActive]);

  const onMenuChange = (value: string) => {
    if (value === "collapse") {
      setIsActive(!isActive);

      return;
    }

    if (value === "switch") {
      setIsAutoUpdateActive(!isAutoUpdateActive);
      return;
    }

    onMenuChangeCallback?.(value);
  };

  const propertiesStore = usePropertiesStore();

  const profileUrlPropertyId = rightMenuNavigationStore.profileUrlPropertyId;
  const profileUrlProperty = propertiesStore.getPropertyById(
    profileUrlPropertyId || ""
  );

  const isProfileUrlPropertySet = !!profileUrlProperty?.stringValue;
  const menuItems = [
    { value: `collapse`, label: isCollapsed ? "Expand" : "Collapse" },
    {
      value: "switch",
      label: isAutoUpdateActive ? "Turn off" : "Turn on",
      isDisabled: !isProfileUrlPropertySet,
    },
  ];

  if (
    rightMenuNavigationStore.fullHeightSection !== id &&
    rightMenuNavigationStore.fullHeightSection !== undefined
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[4px]" key={id}>
      <div className="px-[12px] py-[12px] flex flex-row justify-between text-text-weak w-full">
        <div className="flex flex-row justify-start items-center">
          <div
            className={classNames("text-display-12 font-bold ", {
              "text-text-disabled": !isAutoUpdateActive,
              "text-text-weak": isAutoUpdateActive,
            })}
          >
            {title}
          </div>
        </div>

        <Combobox
          noHoverTrigger={!isAutoUpdateActive}
          hoverBg={isAutoUpdateActive}
          items={menuItems}
          align="end"
          value="none"
          onChange={onMenuChange}
          name="menu"
          trigger={
            isAutoUpdateActive ? (
              <Dots className="w-[12px] h-[4px]" />
            ) : (
              <div className="h-[26px] flex flex-row gap-[8px] px-[12px] py-[4px] bg-hover-1 text-text-weak rounded-[4px] justify-end items-center border border-solid border-gray-moderate hover:border-hover-2">
                <div className="text-display-12 font-semibold">
                  {isAutoUpdateActive ? "ON" : "OFF"}
                </div>
                <Dots className="w-[12px] h-[4px]" />
              </div>
            )
          }
        />
      </div>

      <AnimatePresence mode="wait">
        {isActive && (
          <Collapsable defaultOpen={defaultActive} key={`section-${id}`}>
            {children}
          </Collapsable>
        )}
      </AnimatePresence>
    </div>
  );
};
