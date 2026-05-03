import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Record } from "~/components/UI/Record/Record";
import { axiosClient } from "~/service/axios";
import {
  MessageData,
  RecordData,
  RecordsResponse,
  isCompanyData,
  isContactData,
  isMessageData,
} from "~/service/types";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { useRouter } from "next/router";
import { Button } from "../../UI/Buttons/Button";
import { SelectedRecord, useSelectorStore } from "~/stores/select";
import { DeleteConfirmation } from "../../Confirmation/DeleteConfirmation";
import { plural } from "~/lib/utils/plural";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { getContactName } from "~/lib/utils/getContactName";
import { useToast } from "~/components/UI/hooks/use-toast";
import { usePaginationStore } from "~/stores/paginationStore";
import { PaginationHeader } from "~/components/PaginationHeader/PaginationHeader";
import { Loader } from "~/components/UI/Loader/Loader";
import { Combobox } from "~/components/UI/Combobox/Combobox";
import { Dots } from "~/icons/ui/Dots";

const getTitle = (record: RecordData) => {
  if (isContactData(record)) {
    return getContactName(record.data);
  }

  if (isCompanyData(record)) {
    return record.data.name;
  }

  if (isMessageData(record)) {
    return record.data.text;
  }
};

const getLink = (record: RecordData): string => {
  switch (record.type) {
    case "message":
      return `/contacts/${(record.data as MessageData).contact_id}?message_id=${record.data.id}`;
    case "contact":
      return `/contacts/${record.data.id}`;
    case "company":
      return `/companies/${record.data.id}`;
    default:
      return "";
  }
}

const getBaseMenuItemId = (id: string): string => (id.split("/")[0] || "");

const selectorKey = "recordList";

export const RecordList = () => {
  const router = useRouter();
  const activeItems = useLeftMenuStore((state) =>
    state.activeItems
      .filter(item => item.endsWith('/main'))
      .map(getBaseMenuItemId)
  );
  const createPath = activeItems.includes("company") ? "/create/company" : "/create/contact";

  const selectedItems = useSelectorStore(
    (state) => state.selectedItems[selectorKey]
  );
  const { clearSelection } = useSelectorStore();
  const isSelectionEmpty = (selectedItems?.length ?? 0) === 0;
  const isMultipleSelection = (selectedItems?.length ?? 0) > 1;

  const queryClient = useQueryClient();
  const limit = 10;

  const { page, setTotal } = usePaginationStore();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["recordsList", activeItems, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("filter", activeItems.join(","));

      const url = `/records/list?${params.toString()}`;

      return axiosClient.get<RecordsResponse>(url);
    },
    staleTime: Infinity,
  });

  const rightMenuNavigationStore = useRightMenuNavigationStore();
  useEffect(() => {
    rightMenuNavigationStore.setPropertiesSection("default");
  }, []);

  useEffect(() => {
    clearSelection(selectorKey);
  }, []);

  useEffect(() => {
    const unsubscribe = useLeftMenuStore.subscribe(() => {
      refetch();
    });

    return () => unsubscribe();
  }, [refetch]);

  const { data: allRecords } = useQuery({
    queryKey: ["recordsListIdsAndTypes", activeItems],
    queryFn: () => {
      return axiosClient.get<{ items: SelectedRecord[] }>("/records/all");
    },
    staleTime: Infinity,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      setTotal(data.data.total);
    }
  }, [data]);

  const mutation = useMutation({
    mutationKey: ["deleteRecords"],
    mutationFn: (selectedItems: SelectedRecord[]) => {
      return axiosClient.delete(`/records/delete`, {
        data: { items: selectedItems },
      });
    },
    onMutate: () => {
      queryClient.setQueryData(
        ["recordsList", activeItems, page],
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

      useSelectorStore.getState().clearSelection(selectorKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recordsList", activeItems, page],
      });
      toast({
        title: "Success",
        description: "Records deleted",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while deleting the records",
        variant: "destructive",
      });
    },
  });

  const results = data?.data.records;

  const { setIsSelectAll } = useSelectorStore.getState();

  const onBulkSelectChange = (isChecked: boolean) => {
    setIsSelectAll(isChecked, selectorKey);
    if (!results) {
      return;
    }

    if (isChecked) {
      useSelectorStore.getState().selectMultiple(
        results.map((record) => ({ id: record.data.id, type: record.type })),
        selectorKey
      );
    } else {
      useSelectorStore.getState().clearSelection(selectorKey);
    }
  };

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const onDeleteConfirmCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const onDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    mutation.mutate(selectedItems || []);
  };

  const onRecordSelect = useCallback(() => {
    const selectedItems = useSelectorStore.getState().selectedItems[
      selectorKey
    ];
    const isEveryItemSelected = results?.every((record) => {
      return selectedItems?.find((selected) => {
        return selected.id === record.data.id && selected.type === record.type;
      });
    });

    setIsSelectAll(isEveryItemSelected || false);
  }, [results]);

  const onSelectAll = () => {
    useSelectorStore.getState().selectMultiple(
      allRecords?.data.items.map((record) => ({
        id: record.id,
        type: record.type,
      })) || [],
      selectorKey
    );

    setIsSelectAll(true, selectorKey);
  };

  if (isDeleteConfirmOpen) {
    const l = selectedItems?.length ?? 0;
    const recordsWord = plural(l, "record", "records");
    const subtitle = `You are about to delete ${l} ${recordsWord}. Are you sure?`;

    return (
      <DeleteConfirmation
        onCancel={onDeleteConfirmCancel}
        onConfirm={onDeleteConfirm}
        title="Delete records"
        subtitle={subtitle}
      />
    );
  }

  return (
    <MiddleSection>
      <div className="h-[94px] border-b-gray-moderate border-solid z-[19] border-b bg-[#1d2122] flex flex-col">
        <PaginationHeader
          selectorKey={selectorKey}
          onBulkSelectChange={onBulkSelectChange}
          onSelectAll={onSelectAll}
          limit={limit}
          itemName={{
            singular: "record",
            plural: "records",
          }}
        />
        <div className="h-[47px] flex flex-row items-center justify-between px-[32px] py-[12px]">
          <div className="flex flex-row items-center gap-[8px]">
            {/* Edit and Enroll — hidden until feature is ready, restore by uncommenting
            <Button variant="action" disabled={isSelectionEmpty}>
              Edit
            </Button>
            <Button variant="action" disabled={isSelectionEmpty}>
              Enroll
            </Button>
            */}
            <Button
              variant="action"
              disabled={isSelectionEmpty}
              onClick={onDeleteClick}
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-row items-center">
            <Combobox
              items={[
                { value: "create", label: "Create" },
                { value: "merge", label: "Merge", isDisabled: true },
              ]}
              value=""
              onChange={(value) => {
                if (value === "create") router.push(createPath);
              }}
              name=""
              align="end"
              trigger={
                <div className="h-[24px] flex items-center px-[12px] rounded text-display-12 font-bold cursor-pointer border border-solid border-gray-moderate bg-hover-1 hover:border-hover-2 text-text-weak">
                  <Dots className="w-[16px] h-[5px]" />
                </div>
              }
              hoverBg={false}
              noHoverTrigger
            />
          </div>
        </div>
      </div>

      <Scrollbar
        className="flex flex-col gap-[16px] p-[16px] h-full"
        everPresent
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader />
          </div>
        ) : (
          results?.map((record, i) => (
            <Record
              key={i}
              id={record.data.id}
              href={getLink(record)}
              type={record.type}
              title={getTitle(record) || ""}
              onSelect={onRecordSelect}
              avatar={
                isContactData(record)
                  ? record.data.avatar
                  : isCompanyData(record)
                  ? record.data.avatar
                  : undefined
              }
            />
          ))
        )}
      </Scrollbar>
    </MiddleSection>
  );
};
