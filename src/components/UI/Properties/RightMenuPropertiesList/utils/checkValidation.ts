import { toast } from "~/components/UI/hooks/use-toast"
import { usePropertiesStore } from "~/stores/propertiesStore"

export const arePropertiesValid = () => {
  const validationMap = usePropertiesStore.getState().propertiesValidationMap;

  const invalidProperties = Object.entries(validationMap).filter(([_, { isValid }]) => !isValid);
  invalidProperties.map(([id, { error }]) => {
    toast({
      title: "Error",
      variant: "destructive",
      description: error,
    })
  });

  return invalidProperties.length === 0;
};
