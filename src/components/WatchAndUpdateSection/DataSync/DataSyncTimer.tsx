import { DataSyncGradient } from "./DataSyncGradient"

export const DataSyncTimer = () => {
  return (
    <div className="border-t border-gray-moderate px-[12px] pt-[12px] pb-[20px] bg-gradient-2">
      <div className="flex flex-row justify-between items-center mb-[20px]">
        <span className="text-display-12 font-medium text-text-weak">
          Next update
        </span>
        <span className="text-display-12 font-semibold">34:21</span>
      </div>

      <DataSyncGradient percentage={40} />
    </div>
  );
};
