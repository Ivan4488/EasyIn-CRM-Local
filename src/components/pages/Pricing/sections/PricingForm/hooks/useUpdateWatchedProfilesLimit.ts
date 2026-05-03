import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";

export const useUpdateWatchedProfilesLimit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (watched_profiles_limit: number | null) =>
      axiosClient.patch("/billing/watched-profiles", { watched_profiles_limit }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast({ title: "Saved", variant: "success", description: "Watched profiles limit updated." });
    },
    onError: () => {
      toast({ title: "Error", variant: "destructive", description: "Failed to update watched profiles limit." });
    },
  });
};
