import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { SaveCancelButtonGroup } from "../../SaveCancelButtonGroup/SaveCancelButtonGroup";
import { ContactCompanyAssociation } from "../ContactCompanyAssociation/ContactCompanyAssociation";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useAssociationStore } from "~/stores/associationStore";
import { useItems } from "../hooks/useItems";
import { useRouter } from "next/router";
import { SortableWrapper } from "~/components/Sortable/SortableWrapper";
import { AssociatedItem } from "./AssiciatedItem";
import { arrayMove } from "@dnd-kit/sortable";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { useEffect } from "react";
import { getAssociationsDiff } from "../utils/getAssociationsDiff";
import { useUpdateAssociationsMutation } from "../hooks/useUpdateAssociationsMutation";

export const EditAssociations = () => {
  const { setAssociationSection, setFullHeightSection } = useRightMenuNavigationStore();
  const { propertiesContext } = usePropertiesStore();
  const {
    associatedItems,
    addAssociatedItem,
    setAssociatedItems,
  } = useAssociationStore();

  const { data: items } = useItems();

  const {
    commitState,
    copyState,
    isStateChanged,
    resetState,
    copiedState,
  } = useIntermediateState(useAssociationStore);

  const router = useRouter();
  const id = router.query.id as string;

  const onCancel = () => {
    setAssociationSection("default");
    setFullHeightSection(undefined);
    resetState();
  };

  useEffect(() => {
    copyState();
  }, []);

  const mutation = useUpdateAssociationsMutation();

  const onSave = () => {
    const {
      associationsToDelete,
      associationsToUpdateOrAdd,
    } = getAssociationsDiff(
      copiedState?.associatedItems ?? [],
      associatedItems
    );

    const associationsMapped = associationsToUpdateOrAdd.map((item) => ({
      contactId: propertiesContext === "contacts" ? id : item.id,
      companyId: propertiesContext === "companies" ? id : item.id,
      sortOrder: item.order,
    }));

    const associationsToDeleteMapped = associationsToDelete.map((item) => ({
      contactId: propertiesContext === "contacts" ? id : item,
      companyId: propertiesContext === "companies" ? id : item,
    }));

    mutation.mutate({
      associations: associationsMapped,
      associationsToDelete: associationsToDeleteMapped,
    });

    commitState();
    setAssociationSection("default");
    setFullHeightSection(undefined);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = associatedItems.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = associatedItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(associatedItems, oldIndex, newIndex);
      setAssociatedItems(
        newItems.map((item, index) => ({
          ...item,
          order: index,
        }))
      );
    }
  };

  const onChange = (value: string) => {
    if (associatedItems.find((item) => item.id === value)) {
      return;
    }

    addAssociatedItem({
      id: value,
      name: items?.find((item) => item.value === value)?.label ?? "",
      order: 0,
    });
    // const contactId = propertiesContext === "contacts" ? id : value;
    // const companyId = propertiesContext === "companies" ? id : value;
    // mutation.mutate({ contactId: contactId, companyId: companyId });
  };

  return (
    <div className="px-[12px]">
      <div>
        <div className="mb-[12px]">
          <ContactCompanyAssociation
            items={items ?? []}
            value=""
            onChange={onChange}
          />
        </div>

        <SortableWrapper items={associatedItems} handleDragEnd={handleDragEnd}>
          <div className="flex flex-col gap-[12px]">
            {associatedItems.map((item) => (
              <AssociatedItem
                key={item.id}
                name={item.name}
                id={item.id}
                order={item.order}
              />
            ))}
          </div>
        </SortableWrapper>
      </div>

      <SaveCancelButtonGroup
        onCancel={onCancel}
        onSave={onSave}
        position="right"
        show={true}
        disabled={!isStateChanged}
      />
    </div>
  );
};
