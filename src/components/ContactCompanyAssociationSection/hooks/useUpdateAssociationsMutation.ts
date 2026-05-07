import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router"
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { useAssociationStore } from "~/stores/associationStore";

interface Association {
  contactId: string;
  companyId: string;
  sortOrder: number;
}

export const useUpdateAssociationsMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { setIsLoading } = useAssociationStore();

  const router = useRouter();
  const id = router.query.id as string;

  const mutation = useMutation({
    mutationFn: ({
      associations,
      associationsToDelete,
    }: {
      associations: Association[];
      associationsToDelete: Omit<Association, "sortOrder">[];
    }) => {
      return axiosClient.post("/associations/update", {
        associations,
        associationsToDelete,
      });
    },
    onMutate: () => {
      queryClient.setQueryData(["contactsAssociatedWithCompany", id], null);
      queryClient.setQueryData(["companiesAssociatedWithContact", id], null);
      queryClient.cancelQueries({
        queryKey: ["contactsAssociatedWithCompany", id],
      });
      queryClient.cancelQueries({
        queryKey: ["companiesAssociatedWithContact", id],
      });
      setIsLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["companiesAssociatedWithContact"],
      });
      queryClient.invalidateQueries({
        queryKey: ["contactsAssociatedWithCompany"],
      });
      toast({
        title: "Success",
        variant: "success",
        description: "Record updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update associations",
      });
    },
  });

  return mutation;
};
