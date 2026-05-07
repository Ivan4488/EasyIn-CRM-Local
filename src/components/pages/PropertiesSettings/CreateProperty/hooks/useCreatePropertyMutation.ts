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

export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();
  const propertiesStore = usePropertiesStore();
  const { resolvedId } = usePropertiesResolvedId();
  const { toast } = useToast();

  const contactsMutation = useMutation({
    mutationFn: (data: {
      name: string;
      type: PropertyType;
      options: { value: string; sortOrder: number }[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.post("/contacts/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["contactProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["contactProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contactProperties", resolvedId] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property created",
      });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while creating the property"
        ),
      });
    },
  });

  const companiesMutation = useMutation({
    mutationFn: (data: {
      name: string;
      type: PropertyType;
      options: { value: string; sortOrder: number }[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.post("/companies/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["companyProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["companyProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProperties", resolvedId] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property created",
      });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while creating the property"
        ),
      });
    },
  });


  const accountsMutation = useMutation({
    mutationFn: (data: {
      name: string;
      type: PropertyType;
      options: { value: string; sortOrder: number }[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.post("/accounts/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["accountProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["accountProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accountProperties", resolvedId] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property created",
      });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while creating the property"
        ),
      });
    },
  });

  const teamMembersMutation = useMutation({
    mutationFn: (data: {
      name: string;
      type: PropertyType;
      options: { value: string; sortOrder: number }[];
      valueProjection?: PropertyValueProjection | null;
    }) => axiosClient.post("/users/properties", data),
    onMutate: () => {
      queryClient.setQueryData(["teamMembersProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["teamMembersProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembersProperties", resolvedId] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Property created",
      });
    },
    onError: (error) => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: getErrorMessage(
          error,
          "An error occurred while creating the property"
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
