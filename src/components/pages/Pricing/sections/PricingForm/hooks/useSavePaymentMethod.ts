import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";

export const useSavePaymentMethod = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payment_method_id: string) =>
      axiosClient.post("/billing/payment-method", { payment_method_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast({ title: "Card saved", variant: "success", description: "Your payment method has been saved." });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Error", variant: "destructive", description: "Failed to save card. Please try again." });
    },
  });
};
