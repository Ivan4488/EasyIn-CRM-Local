import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { RecordData } from "~/service/types";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { usePaginationStore } from "~/stores/paginationStore";
import { SelectedRecord, useSelectorStore } from "~/stores/select";

const selectorKey = "recordList";

export const useDeleteRecord = ({ onMutate }: { onMutate?: () => void }) => {
  const queryClient = useQueryClient();
  const activeItems = useLeftMenuStore((state) => state.activeItems);
  const { page } = usePaginationStore();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationKey: ["deleteRecords"],
    mutationFn: (selectedItems: SelectedRecord[]) => {
      return axiosClient.delete(`/records/delete`, {
        data: { items: selectedItems },
      });
    },
    onMutate: (selectedItems: SelectedRecord[]) => {
      queryClient.setQueryData(
        ["recordsList", activeItems, 1],
        (old: any) => {
          if (!old) {
            return;
          }

          return {
            ...old,
            data: {
              ...old.data,
              records: old.data.records.filter((record: RecordData) => {
                return !selectedItems?.find((selected) => {
                  return (
                    selected.id === record.data.id &&
                    selected.type === record.type
                  );
                });
              }),
            },
          };
        }
      );

      onMutate?.();
      useSelectorStore.getState().clearSelection(selectorKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recordsList", activeItems, page],
      });
      toast({
        title: "Success",
        description: "Record deleted",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while deleting the record",
        variant: "destructive",
      });
    },
  });

  return mutation;
};
