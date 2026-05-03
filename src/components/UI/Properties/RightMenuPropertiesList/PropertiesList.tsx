import {
  PropertiesContext,
  usePropertiesStore,
} from "~/stores/propertiesStore";
import { PropertyMediator } from "./PropertyMediator";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { useEffect } from "react";
import { SaveCancelButtonGroup } from "~/components/SaveCancelButtonGroup/SaveCancelButtonGroup";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { getPropertiesDiff } from "./utils/getPropertiesDiff";
import { usePropertiesMutation } from "./hooks/usePropertiesMutation";
import { useProperties } from "./hooks/useProperties";
import { Loader } from "~/components/UI/Loader/Loader";
import { areArraysDifferent } from "./utils/areArrayDiff";
import { useActivePropertiesMutation } from "./hooks/useActivePropertiesMutation";
import { getActivePropertiesMutationPayload } from "./utils/getActivePropertiesMutationPayload";
import { useSetPropertiesContext } from "~/stores/utils/usePropertiesContext";
import { arePropertiesValid } from "./utils/checkValidation";

interface Props {
  isDisabled?: boolean;
  context: PropertiesContext;
}

export const PropertiesList = ({ isDisabled, context }: Props) => {
  const propertiesStore = usePropertiesStore();
  const propertiesNavigationStore = useRightMenuNavigationStore();
  const {
    copyState,
    resetState,
    isStateChanged,
    commitState,
    copiedState: initialState,
  } = useIntermediateState(usePropertiesStore, "propertiesList");

  useProperties(copyState);
  useSetPropertiesContext({ context, copyState });

  const activeProperties = propertiesStore.activeProperties;

  const propertiesMutation = usePropertiesMutation();
  const activePropertiesMutation = useActivePropertiesMutation();

  useEffect(() => {
    copyState();
  }, []);

  const onCancel = () => {
    resetState();
    propertiesNavigationStore.setPropertiesSection("default");
    propertiesNavigationStore.setFullHeightSection(undefined);
  };

  const onSave = () => {
    if (!arePropertiesValid()) return;

    propertiesNavigationStore.setPropertiesSection("default");
    commitState();
    const propertiesToUpdate = getPropertiesDiff(
      initialState!.properties,
      propertiesStore.properties
    );

    if (propertiesToUpdate.length > 0) {
      propertiesMutation?.mutate({ properties: propertiesToUpdate });
    }

    const isActivePropertiesDifferent = areArraysDifferent(
      initialState!.activeProperties,
      propertiesStore.activeProperties
    );

    if (isActivePropertiesDifferent) {
      activePropertiesMutation.mutate(getActivePropertiesMutationPayload());
    }
    propertiesNavigationStore.setFullHeightSection(undefined);
  };

  return (
    <>
      <div className="flex flex-col gap-[16px] px-[12px]">
        {propertiesStore.isPropertiesLoading ? (
          <Loader />
        ) : (
          activeProperties?.map((property) => (
            <PropertyMediator key={property.id} property={property} />
          ))
        )}
      </div>

      <SaveCancelButtonGroup
        onCancel={onCancel}
        onSave={onSave}
        disabled={isDisabled}
        position="right"
        show={isStateChanged && !isDisabled && !propertiesStore.isPropertiesLoading}
        saveText="Update"
      />
    </>
  );
};
