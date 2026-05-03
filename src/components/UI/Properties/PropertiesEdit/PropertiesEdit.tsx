import { Property } from "./Property";
import { BulkSelect } from "~/components/UI/BulkSelect/BulkSelect";
import { useSelectorStore } from "~/stores/select";
import { Button } from "~/components/UI/Buttons/Button";

import { arrayMove } from "@dnd-kit/sortable";
import { PropertiesSelect } from "./PropertiesSelector";
import { SortableWrapper } from "~/components/Sortable/SortableWrapper";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";
import { useEffect } from "react";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { useActivePropertiesMutation } from "../RightMenuPropertiesList/hooks/useActivePropertiesMutation";
import { getActivePropertiesMutationPayload } from "../RightMenuPropertiesList/utils/getActivePropertiesMutationPayload";

interface Props {
  isDisabled?: boolean;
}

const selectorKey = "propertiesEdit";

export const PropertiesEdit = ({ isDisabled }: Props) => {
  const propertiesStore = usePropertiesStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();

  const activeContactProperties =
    propertiesStore.activeProperties;
  const selectorStore = useSelectorStore();
  const isSelectionEmpty =
    selectorStore.selectedItems[selectorKey]?.length === 0;

  const { isSelectAll, setIsSelectAll } = useSelectorStore();

  const activePropertiesMutation = useActivePropertiesMutation();

  const onBulkSelectChange = (isChecked: boolean) => {
    setIsSelectAll(isChecked, selectorKey);
    if (!activeContactProperties) {
      return;
    }

    if (isChecked) {
      useSelectorStore.getState().selectMultiple(
        activeContactProperties.map((property) => ({
          id: property.id,
          type: property.type,
        })),
        selectorKey
      );
    } else {
      useSelectorStore.getState().deselectMultiple(
        activeContactProperties.map((property) => ({
          id: property.id,
          type: property.type,
        })),
        selectorKey
      );
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const items = propertiesStore.activeProperties;
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      propertiesStore.setActiveProperties(
        newItems.map((item, index) => ({
          ...item,
          sortOrder: index,
        }))
      );
    }
  };

  const onRemove = () => {
    const selectedItems = selectorStore.selectedItems[selectorKey];
    if (!selectedItems) {
      return;
    }

    for (const property of selectedItems) {
      propertiesStore.removePropertyFromActive(property.id);
    }
    useSelectorStore.getState().clearSelection(selectorKey);
  };

  const {
    copyState,
    resetState,
    isStateChanged,
    commitState,
  } = useIntermediateState(usePropertiesStore);

  useEffect(() => {
    copyState();
  }, []);

  const onCancel = () => {
    resetState();
    rightMenuNavigationStore.setPropertiesSection("default");
    rightMenuNavigationStore.setFullHeightSection(undefined);
  };

  const onSave = () => {
    rightMenuNavigationStore.setPropertiesSection("default");
    rightMenuNavigationStore.setFullHeightSection(undefined);
    commitState();
    activePropertiesMutation.mutate(getActivePropertiesMutationPayload());
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="px-[12px] mb-[12px]">
          <PropertiesSelect items={propertiesStore.properties} />
        </div>

        <div className="pl-[20px] px-[12px] py-[12px] flex flex-row items-center justify-between">
          <BulkSelect
            isChecked={isSelectAll[selectorKey]}
            onChange={onBulkSelectChange}
          />
          <Button
            variant="secondary"
            className="h-[24px] !rounded text-display-12 px-[8px]"
            disabled={isSelectionEmpty}
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>

        <hr className="w-[256px] ml-[12px] border-b1-stroke mb-[12px]"></hr>

        <SortableWrapper
          items={activeContactProperties}
          handleDragEnd={handleDragEnd}
        >
          <div className="flex flex-col gap-[16px] px-[12px]">
            {activeContactProperties.map((property) => (
              <Property
                key={property.id}
                name={property.title}
                id={property.id}
              />
            ))}
          </div>
        </SortableWrapper>
      </div>

      <SaveCancelButtonGroup
        onCancel={onCancel}
        onSave={onSave}
        position="right"
        show={!isDisabled}
        disabled={!isStateChanged}
      />
    </>
  );
};
