import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { PropertyType, usePropertiesStore } from "~/stores/propertiesStore";
import { PropertyValueProjection } from "~/types/propertyValueProjection";
import { usePropertiesResolvedId } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/usePropertiesResolvedId";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;

    if (data?.error) {
      return data.error;
    }

    if (data?.message) {
      return data.message;
    }
  }

  return fallback;
};

export const useUpdatePropertyMutation = () => {
  const queryClient = useQueryClient();
  const propertiesStore = usePropertiesStore();
  const { resolvedId } = usePropertiesResolvedId();
  const { toast } = useToast();

  const contactsMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      type: PropertyType;
      options: { id?: string; value: string; sortOrder: number }[];
      optionsToDelete: string[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.put("/contacts/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["contactProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["contactProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property updated",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contactProperties", resolvedId] });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while updating the property"
        ),
      });
    },
  });

  const companiesMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      type: PropertyType;
      options: { id?: string; value: string; sortOrder: number }[];
      optionsToDelete: string[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.put("/companies/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["companyProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["companyProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property updated",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProperties", resolvedId] });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while updating the property"
        ),
      });
    },
  });


  const accountsMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      type: PropertyType;
      options: { id?: string; value: string; sortOrder: number }[];
      optionsToDelete: string[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.put("/accounts/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["accountProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["accountProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property updated",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accountProperties", resolvedId] });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while updating the property"
        ),
      });
    },
  });

  const teamMembersMutation = useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      type: PropertyType;
      options: { id?: string; value: string; sortOrder: number }[];
      optionsToDelete: string[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.put("/users/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["teamMembersProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["teamMembersProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property updated",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembersProperties", resolvedId] });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while updating the property"
        ),
      });
    },
  });


  const mutations = {
    contacts: contactsMutation,
    companies: companiesMutation,
    accounts: accountsMutation,
    team: teamMembersMutation,
  };

  return mutations[propertiesStore.propertiesContext ?? "contacts"];
};
