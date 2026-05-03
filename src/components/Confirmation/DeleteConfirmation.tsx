import { Contact as ContactIcon } from "~/icons/records/Contact";
import { Button } from "~/components/UI/Buttons/Button";
import { BackHeaderRound } from "../UI/BackHeaderRound/BackHeaderRound";
import { Input } from "../UI/Input/Input";
import { useState } from "react"

interface DeleteConfirmationProps {
  title: string;
  subtitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  inputConfirmationText?: string;
}

export const DeleteConfirmation = ({
  title,
  subtitle,
  onCancel,
  onConfirm,
  inputConfirmationText,
}: DeleteConfirmationProps) => {
  const [inputValue, setInputValue] = useState("");
  const isDisabled = !!inputConfirmationText && inputValue !== inputConfirmationText;
  return (
    <div>
      <BackHeaderRound title={title} onClick={onCancel} Icon={ContactIcon} />

      <div className="mt-[60px] flex justify-center items-center">
        <div className="flex flex-col items-center gap-[24px]">
          {inputConfirmationText && (
            <Input
              placeholder={inputConfirmationText}
              className="w-[300px]"
              label={`Type ${inputConfirmationText} to confirm`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}

          <p className="text-text-weak text-display-16">{subtitle}</p>

          <div className="flex flex-row gap-[8px]">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="danger" disabled={isDisabled}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
