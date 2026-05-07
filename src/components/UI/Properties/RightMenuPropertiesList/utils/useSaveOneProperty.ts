import { usePropertiesStore } from "~/stores/propertiesStore";
import { arePropertiesValid } from "./checkValidation";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { getPropertiesDiff } from "./getPropertiesDiff";
import { useIntermediateState } from "~/stores/utils/useIntermediateState";
import { usePropertiesMutation } from "../hooks/usePropertiesMutation"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const useSaveOneProperty = () => {
  const propertiesNavigationStore = useRightMenuNavigationStore();

  const { copiedState: initialState, commitState } = useIntermediateState(
    usePropertiesStore,
    "propertiesListPhotoInput"
  );
  const propertiesMutation = usePropertiesMutation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSave = () => {
    if (!arePropertiesValid()) return;

    propertiesNavigationStore.setPropertiesSection("default");
    const propertiesToUpdate = getPropertiesDiff(
      initialState!.properties,
      usePropertiesStore.getState().properties
    );
    if (propertiesToUpdate.length > 0) {
      propertiesMutation?.mutate({ properties: propertiesToUpdate });
    }

    propertiesNavigationStore.setFullHeightSection(undefined);
    commitState();
    queryClient.setQueryData(["contactProperties", router.query.id], (oldData: any) => {
      return [];
    });
    queryClient.setQueryData(["companyProperties", router.query.id], (oldData: any) => {
      return [];
    });
    queryClient.setQueryData(["accountProperties", router.query.id], (oldData: any) => {
      return [];
    });
    queryClient.setQueryData(["teamProperties", router.query.id], (oldData: any) => {
      return [];
    });
  };

  return { onSave };
};
