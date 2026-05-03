import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";

export const useUpdateSeatLimit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (seat_limit: number | null) =>
      axiosClient.patch("/billing/seats", { seat_limit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast({ title: "Saved", variant: "success", description: "Seat limit updated." });
    },
    onError: () => {
      toast({ title: "Error", variant: "destructive", description: "Failed to update seat limit." });
    },
  });
};
