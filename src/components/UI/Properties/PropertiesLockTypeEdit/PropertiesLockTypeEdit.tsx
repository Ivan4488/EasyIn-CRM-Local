import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";
import {
  PropertiesContext,
  usePropertiesStore,
} from "~/stores/propertiesStore";
import { PropertyMediator } from "../RightMenuPropertiesList/PropertyMediator";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { useEffect } from "react";
import { arePropertiesValid } from "../RightMenuPropertiesList/utils/checkValidation";
import { usePropertiesLockTypeMutation } from "../RightMenuPropertiesList/hooks/usePropertiesLockTypeMutation";
import { PropertyLockType } from "../RightMenuPropertiesList/hooks/useProperties";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore"

export const PropertiesLockTypeEdit = ({
  context,
}: {
  context: PropertiesContext;
}) => {
  const propertiesStore = usePropertiesStore();
  const propertiesNavigationStore = useRightMenuNavigationStore();
  const activeEditingLockTypePropertyId =
    propertiesStore.activeEditingLockTypePropertyId;
  const property = propertiesStore.properties.find(
    (property) => property.id === activeEditingLockTypePropertyId
  );

  const {
    copyState,
    commitState,
    copiedState: initialState,
  } = useIntermediateState(usePropertiesStore, "propertiesLockTypeEdit");
  const lockTypeMutation = usePropertiesLockTypeMutation();

  useEffect(() => {
    copyState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    const saved = propertiesNavigationStore.rightMenuSavedScrollTop;
    if (saved === null) return;
    const restore = () => {
      const container = document.getElementById("right-menu-scroll");
      if (container) {
        container.scrollTop = saved;
        propertiesNavigationStore.setRightMenuSavedScrollTop(null);
      }
    };
    // Wait for the default section to render back and layout to settle
    requestAnimationFrame(() => requestAnimationFrame(restore));
  };

  const onSave = () => {
    if (!arePropertiesValid()) return;

    commitState();
    const oldMap = new Map(
      (initialState?.properties || []).map((p) => [p.id, p])
    );
    type LockUpdate = { id: string; lock_type: PropertyLockType };
    const changedLocks: LockUpdate[] = propertiesStore.properties
      .filter((p) => {
        const old = oldMap.get(p.id);
        return old && old.lockType !== p.lockType;
      })
      .filter(
        (p): p is typeof p & { lockType: PropertyLockType } =>
          p.lockType !== undefined && p.lockType !== null
      )
      .map((p) => ({ id: p.id, lock_type: p.lockType }));

    if (changedLocks.length > 0) {
      lockTypeMutation.mutate({ properties: changedLocks });
    }
    propertiesStore.setActiveEditingLockTypePropertyId(null);
    handleScroll();
  };

  if (!property) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col gap-[16px] px-[12px]">
        <PropertyMediator key={property.id} property={property} />
      </div>

      <SaveCancelButtonGroup
        onCancel={() => {
          propertiesStore.setActiveEditingLockTypePropertyId(null);
          handleScroll();
        }}
        onSave={onSave}
        position="right"
        show={true}
      />
    </div>
  );
};
