import { Checkbox } from "../Checkbox/Checkbox";

type BulkSelectProps = {
  disabled?: boolean;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  isSelectionActive?: boolean;
};

export const BulkSelect: React.FC<BulkSelectProps> = ({
  isChecked,
  onChange,
  disabled = false,
  isSelectionActive = false,
}) => {
  return (
    <div className="flex flex-row items-center gap-[8px]">
      <Checkbox isChecked={isChecked} onChange={onChange} disabled={disabled} />

      <p className={`text-text-weak text-display-12 ${isSelectionActive ? "max-[1150px]:hidden" : ""}`}>Bulk Select</p>
    </div>
  );
};
