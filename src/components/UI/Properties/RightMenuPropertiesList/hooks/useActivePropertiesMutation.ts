import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { usePropertiesStore } from "~/stores/propertiesStore";

export const useActivePropertiesMutation = () => {
  const queryClient = useQueryClient();
  const propertiesStore = usePropertiesStore();
  const { toast } = useToast();

  const activeContactsPropertiesMutation = useMutation({
    mutationKey: ["activeContactsProperties"],
    mutationFn: async (
      properties: {
        id: string;
        is_active: boolean;
        sortOrder: number;
        title: string;
      }[]
    ) => {
      const response = await axiosClient.post("/contacts/properties/active", {
        properties,
      });
      return response.data;
    },
    onMutate: () => {
      queryClient.setQueryData(["contactProperties"], []);
      queryClient.cancelQueries({ queryKey: ["contactProperties"] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactProperties"] });
      toast({
        title: "Success",
        description: "Record updated",
        variant: "success",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while updating the properties",
      });
    },
  });

  const activeCompaniesPropertiesMutation = useMutation({
    mutationKey: ["activeCompaniesProperties"],
    mutationFn: async (
      properties: {
        id: string;
        is_active: boolean;
        sortOrder: number;
        title: string;
      }[]
    ) => {
      const response = await axiosClient.post("/companies/properties/active", {
        properties,
      });
      return response.data;
    },
    onMutate: () => {
      queryClient.setQueryData(["companyProperties"], []);
      queryClient.cancelQueries({ queryKey: ["companyProperties"] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProperties"] });
      toast({
        title: "Success",
        description: "Record updated",
        variant: "success",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while updating the properties",
      });
    },
  });

  const activeAccountsPropertiesMutation = useMutation({
    mutationKey: ["activeAccountsProperties"],
    mutationFn: async (
      properties: {
        id: string;
        is_active: boolean;
        sortOrder: number;
        title: string;
      }[]
    ) => {
      const response = await axiosClient.post("/accounts/properties/active", {
        properties,
      });
      return response.data;
    },
    onMutate: () => {
      queryClient.setQueryData(["accountProperties"], []);
      queryClient.cancelQueries({ queryKey: ["accountProperties"] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountProperties"] });
      toast({
        title: "Success",
        description: "Record updated",
        variant: "success",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while updating the properties",
      });
    },
  });

  const activeTeamMembersPropertiesMutation = useMutation({
    mutationKey: ["activeTeamMembersProperties"],
    mutationFn: async (
      properties: {
        id: string;
        is_active: boolean;
        sortOrder: number;
        title: string;
      }[]
    ) => {
      const response = await axiosClient.post("/users/properties/active", {
        properties,
      });
      return response.data;
    },
    onMutate: () => {
      queryClient.setQueryData(["teamMembersProperties"], []);
      queryClient.cancelQueries({ queryKey: ["teamMembersProperties"] });
      propertiesStore.setIsPropertiesLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembersProperties"] });
      toast({
        title: "Success",
        description: "Record updated",
        variant: "success",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while updating the properties",
      });
    },
  });

  const propertiesContext = usePropertiesStore.getState().propertiesContext;

  const mutations = {
    contacts: activeContactsPropertiesMutation,
    companies: activeCompaniesPropertiesMutation,
    accounts: activeAccountsPropertiesMutation,
    team: activeTeamMembersPropertiesMutation,
  };

  return mutations[propertiesContext || "contacts"];
};
