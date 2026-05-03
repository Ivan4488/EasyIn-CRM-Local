import classNames from "classnames"
import { Cross } from "~/icons/ui/Cross";

interface Props {
  label: string;
  onDelete: () => void;
  isLocked?: boolean;
}

export const Chip = ({ label, onDelete, isLocked }: Props) => {
  return (
    <div className="px-[8px] py-[2px] h-[26px] rounded-[4px] bg-gray-moderate flex flex-row items-center gap-[8px]">
      <p className={classNames("text-[13px] font-medium", isLocked ? "text-text-weak" : "text-text-strong")}>{label}</p>
      <Cross onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete();}} className="text-b1-stroke w-[12px] h-[12px]" />
    </div>
  );
};
