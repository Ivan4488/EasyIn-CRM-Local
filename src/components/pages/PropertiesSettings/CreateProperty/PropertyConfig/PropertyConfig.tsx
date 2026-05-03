import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { SortableWrapper } from "~/components/Sortable/SortableWrapper";
import { PropertyValue } from "./PropertyValue";
import { AddCircle } from "~/icons/ui/AddCircle";
import { getDefaultPropertyValueId, usePropertiesStore } from "~/stores/propertiesStore";

export const PropertyConfig = () => {
  const { propertyValues } = usePropertiesStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const items = propertyValues;
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      usePropertiesStore.setState({ propertyValues: newItems });
    }
  };

  const handleAddValue = () => {
    usePropertiesStore.setState({
      propertyValues: [...propertyValues, { id: getDefaultPropertyValueId(), value: "", sortOrder: 0 }],
    });
  };

  return (
    <div>
      <p className="text-display-16 font-semibold text-text-weak px-[12px] mb-[6px]">
        Property value
      </p>

      <div className="bg-black-moderate/60 rounded-[8px] px-[16px] py-[20px] border border-gray-moderate">
        <SortableWrapper items={propertyValues} handleDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-[12px]">
            {propertyValues.map((propertyValue) => (
              <PropertyValue key={propertyValue.id} id={propertyValue.id} />
            ))}
          </div>
        </SortableWrapper>

        <button
          className="flex justify-start flex-row items-center text-strong-green gap-[12px] mt-[16px] group hover:text-green-2 ml-[15px]"
          onClick={handleAddValue}
        >
          <AddCircle className="w-[16px] h-[16px]" />
          <p
            className="text-display-15 group-hover:underline"
            onClick={handleAddValue}
          >
            Add value
          </p>
        </button>
      </div>
    </div>
  );
};
