import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { CircleMinus } from "~/icons/ui/CircleMinus";
import { DragHandle } from "~/icons/ui/DragHandle";
import { useAssociationStore } from "~/stores/associationStore"

interface AssociatedItemProps {
  name: string;
  order: number;
  id: string;
}

export const AssociatedItem = ({ name, order, id }: AssociatedItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const { removeAssociatedItem } = useAssociationStore();

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null
    ),
    transition,
  };

  const handleRemoveValue = () => {
    removeAssociatedItem(id);
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="border border-gray-moderate bg-black-moderate rounded-[8px] group flex flex-row items-center justify-start h-[38px]"
    >
      <div className="flex flex-row h-full items-center w-fit">
        <button
          className={classNames(
            "w-[34px] h-full px-[9px] bg-gradient-2 rounded-l-[8px]",
            "text-text-weak hover:text-hover-2 hover:bg-gradient-2-hover"
          )}
          onClick={handleRemoveValue}
        >
          <CircleMinus className={classNames("w-[16px] h-[16px]")} />
        </button>
      </div>

      <div className="min-w-0 flex-1 h-full rounded-r-[12px] items-center text-[15px] text-text-strong flex flex-row justify-between px-[12px] overflow-hidden">
        <p className="cursor-default truncate min-w-0 flex-1 pr-[8px]">{name}</p>
        <button className="cursor-grab shrink-0" {...listeners} {...attributes}>
          <DragHandle />
        </button>
      </div>
    </div>
  );
};
