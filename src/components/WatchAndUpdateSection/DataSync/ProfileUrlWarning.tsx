import { Info } from "~/icons/ui/Info"

export const ProfileUrlWarning = () => {
  return (
    <div className="border-t border-gray-moderate px-[12px] pt-[12px] pb-[20px] bg-hover-1 flex flex-row items-center gap-[5px]">
      <div>
        <Info className="text-strong-yellow" />
      </div>
      <div className="text-display-14 font-medium text-strong-yellow">
        This feature requires profile url
      </div>
    </div>
  );
};
