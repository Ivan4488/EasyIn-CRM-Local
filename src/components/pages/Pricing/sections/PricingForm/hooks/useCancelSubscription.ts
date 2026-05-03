import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => axiosClient.post("/billing/cancel"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast({
        title: "Plan canceled",
        variant: "success",
        description: "Your plan will remain active until the end of the billing period.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to cancel plan. Please try again.",
      });
    },
  });
};
