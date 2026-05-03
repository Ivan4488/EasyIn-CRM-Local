import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";

export const useAddAssociationMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      contactId,
      companyId,
    }: {
      contactId: string;
      companyId: string;
    }) => {
      return axiosClient.post(`/associations/contact/company`, {
        contactId,
        companyId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Association added",
      });
      queryClient.invalidateQueries({
        queryKey: ["companiesAssociatedWithContact"],
      });
      queryClient.invalidateQueries({
        queryKey: ["contactsAssociatedWithCompany"],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while adding the association",
      });
    },
  });

  return mutation;
};
