import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { BulkSelect } from "~/components/UI/BulkSelect/BulkSelect";
import { Property } from "./Property";
import { Button } from "~/components/UI/Buttons/Button";
import { useRouter } from "next/router";
import {
  getDefaultPropertyValueId,
  usePropertiesStore,
} from "~/stores/propertiesStore";
import { useSelectorStore } from "~/stores/select";
import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";
import { Loader } from "~/components/UI/Loader/Loader";
import { MiddleCutOut } from "~/components/UI/MiddleSection/MiddleCutOut";
import { BottomMiddleCutOut } from "~/components/UI/MiddleSection/BottomMiddleCutOut";
import { PropertyLockType } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";
import { useState } from "react";

const selectorKey = "properties";

interface PropertiesProps {
  onCancel: () => void;
  onSave: (ids?: string[]) => void;
}

export const Properties = ({ onCancel, onSave }: PropertiesProps) => {
  const propertiesStore = usePropertiesStore();
  const properties = propertiesStore.settingsProperties;

  const selectorStore = useSelectorStore();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { isSelectAll, setIsSelectAll } = useSelectorStore();

  const isSystemControlledProperty = (property: { lockType?: PropertyLockType }) =>
    property.lockType === PropertyLockType.HIDDEN_FULLY_LOCKED ||
    property.lockType === PropertyLockType.VISIBLE_FULLY_LOCKED;

  const selectableProperties = properties.filter(
    (property) => !property.isRequired && !isSystemControlledProperty(property)
  );

  const isSelectionEmpty =
    selectorStore.selectedItems[selectorKey]?.length === 0;

  const onBulkSelectChange = (isChecked: boolean) => {
    setIsSelectAll(isChecked, selectorKey);

    if (!selectableProperties) {
      return;
    }

    if (isChecked) {
      selectorStore.selectMultiple(
        selectableProperties.map((property) => ({
          id: property.id,
          type: property.type,
        })),
        selectorKey
      );
    } else {
      selectorStore.deselectMultiple(
        selectableProperties.map((property) => ({
          id: property.id,
          type: property.type,
        })),
        selectorKey
      );
    }
  };

  const onDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const onDeleteConfirm = () => {
    const selectedItems = selectorStore.selectedItems;
    const newProperties = properties.filter(
      (property) =>
        !selectedItems[selectorKey]?.some((item) => item.id === property.id)
    );
    propertiesStore.setSettingsProperties(newProperties);
    propertiesStore.setDeletedProperties(
      selectedItems[selectorKey]?.map((item) => item.id) || []
    );
    selectorStore.clearSelection(selectorKey);
    setIsDeleteConfirmOpen(false);
    // Immediately save — fires the delete mutation without needing a separate Save click
    onSave(selectedItems[selectorKey]?.map((item) => item.id) || []);
  };

  const onDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const { propertiesContext } = usePropertiesStore();

  const router = useRouter();
  const recordId = (router.query.id as string | undefined) ?? DETACHED_PROPERTIES_ID;
  const onCreate = () => {
    router.push(
      `/${propertiesContext}/settings/edit/create/${recordId}`
    );
    propertiesStore.setPropertyTitle("");
    propertiesStore.setSelectedPropertyType(undefined);
    propertiesStore.setPropertyValues([
      { id: getDefaultPropertyValueId(), value: "", sortOrder: 0 },
    ]);
  };

  if (isDeleteConfirmOpen) {
    const count = selectorStore.selectedItems[selectorKey]?.length ?? 0;
    const word = count === 1 ? "property" : "properties";
    return (
      <MiddleCutOut>
        <DeleteConfirmation
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
          title="Delete properties"
          subtitle={`You are about to delete ${count} ${word}. Are you sure?`}
        />
      </MiddleCutOut>
    );
  }

  return (
    <MiddleCutOut>
      <div className="w-full h-[48px] flex items-center justify-between p-[16px] border-b border-gray-moderate">
        <BulkSelect
          isChecked={isSelectAll[selectorKey] || false}
          onChange={onBulkSelectChange}
          disabled={selectableProperties.length === 0}
        />
      </div>
      <div className="w-full h-[48px] flex items-center justify-between p-[16px] border-b border-gray-moderate">
        <Button
          variant="secondary"
          className="h-[24px] !rounded text-display-12 px-[8px]"
          onClick={onCreate}
        >
          Create
        </Button>
        <Button
          variant="secondary"
          className="h-[24px] !rounded text-display-12 px-[8px] !py-[4px]"
          disabled={isSelectionEmpty}
          onClick={onDeleteClick}
        >
          Delete
        </Button>
      </div>
      {propertiesStore.isPropertiesLoading ? (
        <div className="mt-10 h-full">
          <Loader />
        </div>
      ) : (
        <Scrollbar
          className="flex flex-col gap-[16px] h-full p-[16px] mb-[72px]"
          everPresent
        >
          {properties.map((property) => (
            <Property
              key={property.id}
              name={property.title}
              id={property.id}
              isRequired={property.isRequired}
              isSystemControlled={isSystemControlledProperty(property)}
              onEdit={() =>
                router.push(
                  `/${propertiesContext}/settings/edit/${property.id}/${recordId}`
                )
              }
            />
          ))}
        </Scrollbar>
      )}
      <BottomMiddleCutOut>
        <SaveCancelButtonGroup
          onCancel={onCancel}
          onSave={onSave}
          cancelText="Back"
          cancelDisabled={true}
          position="middle"
          show={true}
          disabled={propertiesStore.deletedProperties.length === 0}
        />
      </BottomMiddleCutOut>
    </MiddleCutOut>
  );
};
