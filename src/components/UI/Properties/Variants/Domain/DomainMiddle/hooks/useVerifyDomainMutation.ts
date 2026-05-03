import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { axiosClient } from "~/service/axios";

export const useVerifyDomainMutation = () => {
  const router = useRouter();
  const accountId = router.query.id as string;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return axiosClient.post(`/accounts/${accountId}/verify-domain`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accountProperties", accountId],
      });
      queryClient.invalidateQueries({ queryKey: ["account", accountId] });
    },
  });
};
