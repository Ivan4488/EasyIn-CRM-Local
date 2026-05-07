import classNames from "classnames";
import { useWatchAndUpdateSectionStore } from "~/stores/watchAndUpdateSectionStore";

interface SyncItemProps {
  title: string;
}

export const SyncItem = ({ title }: SyncItemProps) => {
  const section = title.toLowerCase().includes("conversation")
    ? "conversation"
    : "properties";
  const {
    togglesMapConversation,
    togglesMapProperties,
    isActive,
  } = useWatchAndUpdateSectionStore();

  const colorMap = {
    active: "bg-strong-green",
    partly: "bg-strong-yellow",
    off: "bg-strong-error",
    inactive: "bg-gray-moderate",
  };

  const getPartlyOffCount = () => {
    if (section === "conversation") {
      return Object.values(togglesMapConversation).filter((value) => !value)
        .length;
    }
    return Object.values(togglesMapProperties).filter((value) => !value).length;
  };

  const totalCount =
    section === "conversation"
      ? Object.values(togglesMapConversation).length
      : Object.values(togglesMapProperties).length;

  const getStatus = () => {
    if (!isActive) return "inactive";

    const isSectionFullyActive =
      section === "conversation"
        ? Object.values(togglesMapConversation).every((value) => value)
        : Object.values(togglesMapProperties).every((value) => value);

    if (isSectionFullyActive) return "active";

    const isSectionPartlyActive =
      section === "conversation"
        ? Object.values(togglesMapConversation).some((value) => value)
        : Object.values(togglesMapProperties).some((value) => value);

    return isSectionPartlyActive ? "partly" : "off";
  };

  const status = getStatus();
  const getColor = () => {
    return colorMap[status];
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-[10px] items-center">
        <div
          className={classNames("w-[12px] h-[12px] rounded-full", getColor())}
        />
        <div className={classNames("text-display-14", {
          "text-text-disabled": !isActive,
          "text-text-weak": isActive,
        })}>{title}</div>
      </div>

      {status === "off" && (
        <div className="rounded-[4px] px-[8px] py-[6px] text-display-14 text-text-weak font-bold bg-[#3C4041] h-[22px] flex items-center justify-center">
          OFF
        </div>
      )}
      {status === "partly" && (
        <div className="rounded-[4px] px-[8px] py-[6px] text-display-14 text-text-weak font-bold bg-[#3C4041] h-[22px] flex items-center justify-center">
          {getPartlyOffCount()}/{totalCount}
        </div>
      )}
    </div>
  );
};
