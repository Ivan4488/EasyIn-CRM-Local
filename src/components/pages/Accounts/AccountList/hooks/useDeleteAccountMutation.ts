import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast"
import { axiosClient } from "~/service/axios"
import { useSelectorStore } from "~/stores/select"

export const useDeleteAccountsMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { clearSelection } = useSelectorStore();

  const mutation = useMutation({
    mutationFn: (ids: string[]) => axiosClient.delete(`/accounts/delete`, { data: { ids } }),
    onMutate: (ids) => {
      queryClient.setQueryData(["accounts"], (old: any) => {
        return {
          ...old,
          data: old.data.filter((account: any) => !ids.includes(account.id)),
        };
      });
      clearSelection();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      
      toast({
        title: "Success",
        variant: "success",
        description: "Account deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to delete account",
      });
    },
  });

  return mutation;
};