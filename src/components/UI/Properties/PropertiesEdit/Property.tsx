import { useSortable } from "@dnd-kit/sortable";
import classNames from "classnames";
import { Check } from "~/icons/ui/Check";
import { useSelectorStore } from "~/stores/select";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle } from "~/icons/ui/DragHandle"

interface Props {
  name: string;
  id: string;
}

const selectorKey = "propertiesEdit";

export const Property = ({ name, id }: Props) => {
  const selectedItem = { id, type: name };
  const isSelected = useSelectorStore((state) =>
    state.isSelected(selectedItem, selectorKey)
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null
    ),
    transition,
  };

  const onSelectHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      useSelectorStore.getState().deselectItem(selectedItem, selectorKey);
    } else {
      useSelectorStore.getState().selectItem(selectedItem, selectorKey);
    }
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="border border-gray-moderate bg-black-moderate rounded-[12px] group flex flex-row items-center justify-start"
    >
      <div className="flex flex-row h-full items-center w-fit">
        <div
          onClick={onSelectHandler}
          className={classNames(
            "flex h-full group text-text-weak w-[48px] items-center justify-center rounded-bl-[12px] rounded-tl-[12px] bg-b1-black bg-gradient-2 p-[12px] cursor-pointer",
            isSelected && "bg-strong-green",
            !isSelected && "hover:bg-hover-1"
          )}
        >
          {!isSelected && (
            <div className="group-hover:hidden block">
              <Check className="text-gray-moderate" />
            </div>
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
      </div>

      <div className="w-[220px] h-full rounded-r-[12px] text-[15px] text-text-strong flex flex-row justify-between px-[12px]">
        <p className="cursor-default">{name}</p>
        <button className="cursor-grab" {...listeners} {...attributes}>
          <DragHandle />
        </button>
      </div>
    </div>
  );
};
