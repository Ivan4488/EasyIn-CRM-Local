import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { Arrow } from "~/icons/ui/Arrow";
import { Check } from "~/icons/ui/Check";
import { SelectorKey, useSelectorStore } from "~/stores/select";

interface Props {
  selectorKey: SelectorKey;
  Icon: React.ReactNode;
  id: string;
  type: string;
  onSelect: () => void;
  href?: string;
  onBodyClick?: () => void;
  children: React.ReactNode;
  hideArrow?: boolean;
  isBodySelected?: boolean;
}

export const RecordLayoutWrapper = ({
  selectorKey,
  Icon,
  id,
  type,
  onSelect,
  href,
  onBodyClick,
  children,
  hideArrow = false,
  isBodySelected = false,
}: Props) => {
  const selectedItem = { id, type };
  const navigate = useNavigate();
  const isSelected = useSelectorStore((state) =>
    state.isSelected(selectedItem, selectorKey)
  );

  const onSelectHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      useSelectorStore.getState().deselectItem(selectedItem, selectorKey);
    } else {
      useSelectorStore.getState().selectItem(selectedItem, selectorKey);
    }
    onSelect();
  };

  const bodyContent = (
    <>
      {children}
      {!hideArrow && (
        <div className="h-full flex items-center">
          <Arrow className="text-text-weak" />
        </div>
      )}
    </>
  );

  return (
    <div
      className={classNames(
        "flex flex-row justify-between min-h-[94px] w-full rounded-[12px] border border-solid cursor-pointer",
        isBodySelected ? "border-strong-green" : "border-gray-moderate"
      )}
    >
      <div className="flex flex-row h-full items-center w-full">
        <div
          onClick={onSelectHandler}
          className={classNames(
            "flex h-full group text-text-weak w-[48px] shrink-0 items-center justify-center rounded-bl-[12px] rounded-tl-[12px] bg-gradient-2 p-[12px]",
            isSelected && "bg-strong-green",
            !isSelected && "hover:bg-hover-1"
          )}
        >
          {!isSelected && (
            <div className="group-hover:hidden block">{Icon}</div>
          )}
          {!isSelected && (
            <div className="group-hover:block hidden text-hover-2">
              <Check />
            </div>
          )}
          {isSelected && (
            <div className="text-black-moderate">
              <Check />
            </div>
          )}
        </div>

        {onBodyClick ? (
          <div
            onClick={onBodyClick}
            className="flex justify-between items-center w-full hover:bg-hover-1 pr-[24px] h-full rounded-r-[12px]"
          >
            {bodyContent}
          </div>
        ) : (
          <div
            onClick={() => href && navigate(href)}
            className="flex justify-between items-center w-full hover:bg-hover-1 pr-[24px] h-full rounded-r-[12px]"
          >
            {bodyContent}
          </div>
        )}
      </div>
    </div>
  );
};
