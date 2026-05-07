import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertyLockType } from "../RightMenuPropertiesList/hooks/useProperties";
import { hasLinkedInDataMapForAutomation } from "~/utils/hasLinkedInDataMapForAutomation";

export const LocksDescription = ({
  propertyId,
  disableLock,
}: {
  propertyId: string;
  disableLock?: boolean;
}) => {
  const propertiesStore = usePropertiesStore();
  const property = propertiesStore.properties.find(
    (property) => property.id === propertyId
  );
  const lockType = property?.lockType;
  const displayLockType =
    lockType === PropertyLockType.ONE_CLICK_UPDATE
      ? PropertyLockType.WATCH_AND_UPDATE
      : lockType;

  const hasLinkedInDataMap = hasLinkedInDataMapForAutomation(property);
  const automationOptionDisabled =
    Boolean(disableLock) || !hasLinkedInDataMap;

  const items = [
    {
      value: PropertyLockType.HIDDEN_FULLY_LOCKED,
      title: "Hidden & fully protected",
      subtitle: "Locked from changes; hidden in the standard UI.",
    },
    {
      value: PropertyLockType.VISIBLE_FULLY_LOCKED,
      title: "Visible & fully protected",
      subtitle: "Locked from changes; visible in the UI.",
    },
    {
      value: PropertyLockType.PERSONAL_DEFAULT,
      title: "Personal default",
      subtitle:
        "Locked from changes; only affects you. No need to reselect—saves time.",
    },
    {
      value: PropertyLockType.FILL_AND_PROTECT,
      title: "Fill & protect",
      subtitle:
        "LinkedIn fills this field if it's empty. Once set, updates only come from you — no automatic overwrites.",
    },
    {
      value: PropertyLockType.REVIEW_MODE,
      title: "Review mode",
      subtitle:
        "When manually updating, you'll see a preview of what will change before it's saved.",
      isDisabled: automationOptionDisabled,
    },
    {
      value: PropertyLockType.WATCH_AND_UPDATE,
      title: "Watch & update",
      subtitle: "Automatically watches and updates. No action needed.",
      isDisabled: automationOptionDisabled,
    },
  ];

  return (
    <div className="bg-gradient h-[120px] pr-[12px] py-[8px] flex flex-col gap-[8px] pl-[50px] absolute top-[31px] z-[-2] border-r border-l border-b border-gray-moderate rounded-br-[7px] rounded-bl-[7px] w-[255px]">
      <div className="text-display-12 font-[400] text-white mt-[7px]">
        {items.find((item) => item.value === displayLockType)?.title}
      </div>
      <div className="text-display-12 font-[400] text-text-weak">
        {items.find((item) => item.value === displayLockType)?.subtitle}
      </div>
    </div>
  );
};
