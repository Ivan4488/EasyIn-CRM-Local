import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { AccountData } from "~/service/types"

export const useActivateAccountMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) => axiosClient.post(`/accounts/activate`, { id }),
    onMutate: (id) => {
      queryClient.setQueryData(["accounts"], (old: any) => {
        return {
          ...old,
          data: old.data.map((account: any) =>
            account.id === id
              ? { ...account, is_active: true }
              : { ...account, is_active: false }
          ),
        };
      });
      const accounts = (queryClient.getQueryData(["accounts"]) as any)?.data as AccountData[];
      const activeAccount = accounts.find((account) => account.id === id);
      if (activeAccount) {
        queryClient.setQueryData(["activeAccount"], {data: activeAccount});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordsList"] });
      queryClient.removeQueries({ queryKey: ["team"] });
      queryClient.refetchQueries({ queryKey: ["team"] });

      toast({
        title: "Success",
        variant: "success",
        description: "Account activated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to activate account",
      });
    },
  });

  return mutation;
};
