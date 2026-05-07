import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { usePropertiesResolvedId } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/usePropertiesResolvedId";

export const useDeletePropertyMutation = () => {
  const propertiesStore = usePropertiesStore();
  const queryClient = useQueryClient();
  const { resolvedId } = usePropertiesResolvedId();
  const { toast } = useToast();

  const contactsMutation = useMutation({
    mutationFn: (data: { ids: string[] }) =>
      axiosClient.delete("/contacts/properties", {
        data: {
          ids: data.ids,
        },
      }),
    onMutate: () => {
      queryClient.setQueryData(["contactProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["contactProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
      propertiesStore.setDeletedProperties([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactProperties", resolvedId] });
      toast({
        title: "Success",
        variant: "success",
        description: "Properties deleted",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while deleting the property",
      });
    },
  });

  const companiesMutation = useMutation({
    mutationFn: (data: { ids: string[] }) =>
      axiosClient.delete("/companies/properties", {
        data: {
          ids: data.ids,
        },
      }),
    onMutate: () => {
      queryClient.setQueryData(["companyProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["companyProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
      propertiesStore.setDeletedProperties([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProperties", resolvedId] });
      toast({
        title: "Success",
        variant: "success",
        description: "Properties deleted",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while deleting the property",
      });
    },
  });

  const accountsMutation = useMutation({
    mutationFn: (data: { ids: string[] }) =>
      axiosClient.delete("/accounts/properties", {
        data: {
          ids: data.ids,
        },
      }),
    onMutate: () => {
      queryClient.setQueryData(["accountProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["accountProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
      propertiesStore.setDeletedProperties([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountProperties", resolvedId] });
      toast({
        title: "Success",
        variant: "success",
        description: "Properties deleted",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while deleting the property",
      });
    },
  });

  const teamMembersMutation = useMutation({
    mutationFn: (data: { ids: string[] }) =>
      axiosClient.delete("/users/properties", {
        data: {
          ids: data.ids,
        },
      }),
    onMutate: () => {
      queryClient.setQueryData(["teamMembersProperties", resolvedId], undefined);
      queryClient.cancelQueries({ queryKey: ["teamMembersProperties", resolvedId] });
      propertiesStore.setIsPropertiesLoading(true);
      propertiesStore.setDeletedProperties([]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembersProperties", resolvedId] });
      toast({
        title: "Success",
        variant: "success",
        description: "Properties deleted",
      });
    },
    onError: () => {
      propertiesStore.setIsPropertiesLoading(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while deleting the property",
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
