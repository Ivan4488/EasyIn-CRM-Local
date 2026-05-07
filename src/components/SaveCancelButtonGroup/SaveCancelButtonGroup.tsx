import classNames from "classnames";
import { Button } from "../UI/Buttons/Button";

interface Props {
  onCancel: () => void;
  onSave: () => void;
  position: "right" | "middle";
  show: boolean;
  disabled?: boolean;
  saveText?: string;
  cancelText?: string;
  cancelDisabled?: boolean;
}

export const SaveCancelButtonGroup = ({
  onCancel,
  onSave,
  position,
  show,
  disabled,
  saveText = "Save",
  cancelText = "Cancel",
  cancelDisabled = false,
}: Props) => {
  if (!show) return null;

  return (
    <div
      className={classNames(
        position === "right"
          ? "w-[300px] fixed z-[100] right-0 bottom-0 bg-black-moderate max-[999px]:hidden"
          : "bg-[#212627] flex flex-row justify-center items-center",
        "border-t border-gray-moderate "
      )}
    >
      <div
        className={classNames(
          "px-[24px] py-[8px] sticky bottom-0 h-[72px] flex flex-row justify-end gap-[8px] items-center",
          position === "right" ? "" : "w-[532px]"
        )}
      >
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={cancelDisabled}
          className="font-[500] max-h-[35px]"
        >
          {cancelText}
        </Button>
        <Button
          variant="primary"
          className="font-[500] max-h-[35px]"
          onClick={onSave}
          disabled={disabled}
        >
          {saveText}
        </Button>
      </div>
    </div>
  );
};
