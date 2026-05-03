import classNames from "classnames";
import { Check } from "~/icons/ui/Check"

type Props = {
  disabled?: boolean;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
};

export const Checkbox = ({ isChecked, onChange, disabled = false }: Props) => {
  return (
    <div
      role="radio"
      className={classNames(
        "flex items-center justify-center w-[16px] h-[16px] rounded cursor-pointer border border-solid group",
        isChecked
          ? "bg-strong-green border-strong-green text-black-moderate"
          : "border-text-weak hover:border-text-weak group-hover:text-hover-2"
      )}
      onClick={() => {
        onChange(!isChecked);
      }}
    >
      {isChecked && <Check />}
      {!isChecked && (
        <Check className="text-hover-2 group-hover:block hidden" />
      )}
    </div>
  );
};
