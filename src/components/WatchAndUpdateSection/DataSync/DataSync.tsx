import { Combobox } from "~/components/UI/Combobox/Combobox";
import { Dots } from "~/icons/ui/Dots";
import { SyncItem } from "./SyncItem";
import { DataSyncTimer } from "./DataSyncTimer";
import { useWatchAndUpdateSectionStore } from "~/stores/watchAndUpdateSectionStore";
import classNames from "classnames";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { ProfileUrlWarning } from "./ProfileUrlWarning";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useEffect, useState } from "react"

export const DataSync = () => {
  const { isActive, setIsActive } = useWatchAndUpdateSectionStore();
  const [wasActive, setWasActive] = useState(isActive);
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const propertiesStore = usePropertiesStore();
  const onMenuChange = (value: string) => {
    if (value === "settings") {
      rightMenuNavigationStore.setMiddleSection("watch-update-settings");

      return;
    }
  };

  const profileUrlPropertyId = rightMenuNavigationStore.profileUrlPropertyId;
  const profileUrlProperty = propertiesStore.getPropertyById(
    profileUrlPropertyId || ""
  );

  const isProfileUrlPropertySet = !!profileUrlProperty?.stringValue;

  useEffect(() => {
    if (!isProfileUrlPropertySet && isActive) {
      setIsActive(false);
      setWasActive(true);
    } else if (wasActive && isProfileUrlPropertySet && !isActive) {
      setIsActive(true);
      setWasActive(false);
    }
  }, [isProfileUrlPropertySet, wasActive, isActive]);

  return (
    <div className="border border-gray-moderate rounded-[8px]">
      <div className="flex flex-row justify-between items-center px-[16px] pt-[12px]">
        <div
          className={classNames("text-display-14 font-bold", {
            "text-text-disabled": !isActive,
            "text-text-weak": isActive,
          })}
        >
          LinkedIn data
        </div>

        <Combobox
          disabled={!isActive}
          items={[{ value: `settings`, label: "Settings" }]}
          align="end"
          value="none"
          onChange={onMenuChange}
          name="menu"
          trigger={
            <Dots
              className={classNames("w-[12px] h-[4px]", {
                "text-text-disabled": !isActive,
                "text-text-weak": isActive,
              })}
            />
          }
        />
      </div>

      <div className="flex flex-col gap-[16px] my-[16px] px-[16px]">
        <SyncItem title="Conversation" />
        <SyncItem title="Properties" />
      </div>
      {isActive && <DataSyncTimer />}
      {!isProfileUrlPropertySet && <ProfileUrlWarning />}
    </div>
  );
};
