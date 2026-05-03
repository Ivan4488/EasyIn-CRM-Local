import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { CircleMinus } from "~/icons/ui/CircleMinus";
import { DragHandle } from "~/icons/ui/DragHandle";
import { usePropertiesStore } from "~/stores/propertiesStore";

interface Props {
  id: string;
}

export const PropertyValue = ({ id }: Props) => {
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

  const handleRemoveValue = () => {
    usePropertiesStore.setState((state) => ({
      deletedPropertyValues: [...state.deletedPropertyValues, id],
    }));
    usePropertiesStore.setState((state) => ({
      propertyValues: state.propertyValues.filter(
        (propertyValue) => propertyValue.id !== id
      ),
    }));
  };

  const { propertyValues } = usePropertiesStore();

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={classNames(
        "flex items-center bg-black-moderate h-[48px] border border-gray-moderate rounded-[12px]"
      )}
    >
      <button
        className={classNames(
          "w-[48px] h-full px-[14px] bg-gradient-2 border-r border-gray-moderate rounded-l-[12px]",
          propertyValues.length === 1
            ? "text-text-disabled"
            : "text-text-weak hover:text-hover-2 hover:bg-gradient-2-hover"
        )}
        disabled={propertyValues.length === 1}
        onClick={handleRemoveValue}
      >
        <CircleMinus className={classNames("w-[16px] h-[16px]")} />
      </button>

      <input
        type="text"
        className="w-full h-full bg-black-moderate ring-0 ring-black-moderate focus:ring-1 focus:ring-strong-green focus:outline-none rounded-none px-[12px] hover:ring-hover-2 hover:ring-1 outline-none hover:outline-none placeholder:text-text-weak/40"
        placeholder="Enter value"
        onChange={(e) => {
          usePropertiesStore.setState((state) => ({
            propertyValues: state.propertyValues.map((propertyValue) =>
              propertyValue.id === id
                ? { ...propertyValue, value: e.target.value }
                : propertyValue
            ),
          }));
        }}
        value={
          propertyValues.find((propertyValue) => propertyValue.id === id)?.value
        }
      />

      <button className="cursor-grab px-[14px]" {...listeners} {...attributes}>
        <DragHandle />
      </button>
    </div>
  );
};
