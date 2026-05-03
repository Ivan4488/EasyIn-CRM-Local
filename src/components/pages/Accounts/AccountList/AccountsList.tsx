import { PaginationHeader } from "~/components/PaginationHeader/PaginationHeader";
import { useRouter } from "next/router";
import { Button } from "~/components/UI/Buttons/Button";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { useAccounts } from "./hooks/useAccounts";
import { AccountListItem } from "./AccountListItem";
import { useCallback, useEffect, useState } from "react";
import { useSelectorStore } from "~/stores/select";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { usePaginationStore } from "~/stores/paginationStore";
import { useActivateAccountMutation } from "./hooks/useActivateAccountMutation";
import { Loader } from "~/components/UI/Loader/Loader";
import { useDeleteAccountsMutation } from "./hooks/useDeleteAccountMutation";
import { plural } from "~/lib/utils/plural";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation";
import { Combobox } from "~/components/UI/Combobox/Combobox";
import { Dots } from "~/icons/ui/Dots";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/UI/Tooltip/tooltip";


const selectorKey = "accounts";
const limit = 10;

export const AccountsList = () => {
  const router = useRouter();
  const { data, isLoading } = useAccounts();
  const { setIsSelectAll, selectedItems, clearSelection } = useSelectorStore();
  const { setTotal, total, page } = usePaginationStore();
  const { mutate: activateAccount } = useActivateAccountMutation();
  const { mutate: deleteAccounts } = useDeleteAccountsMutation();

  useEffect(() => {
    clearSelection(selectorKey);
  }, []);

  useEffect(() => {
    if (data) {
      setTotal(data.data.length);
    }
  }, [data]);

  const onRecordSelect = useCallback(() => {
    const selectedItemsByKey = selectedItems[selectorKey];
    const isEveryItemSelected = data?.data?.every((account) => {
      return selectedItemsByKey?.find((selected) => {
        return selected.id === account.id && selected.type === "account";
      });
    });

    setIsSelectAll(isEveryItemSelected || false);
  }, [data?.data]);

  const onSelectAll = () => {
    useSelectorStore.getState().selectMultiple(
      data?.data?.map((account) => ({
        id: account.id,
        type: "account",
      })) || [],
      selectorKey
    );

    setIsSelectAll(true, selectorKey);
  };

  const isActive = (id?: string) => {
    if (!id) {
      return false;
    }
    return data?.data?.find((account) => account.id === id)?.is_active;
  };

  const onActivate = () => {
    const id = selectedItems?.accounts?.[0]?.id;
    if (id) {
      activateAccount(id);
    }

  };

  const onBulkSelectChange = (isChecked: boolean) => {
    setIsSelectAll(isChecked, selectorKey);
    if (!data?.data) {
      return;
    }

    if (isChecked) {
      useSelectorStore.getState().selectMultiple(
        data?.data?.map((account) => ({
          id: account.id,
          type: "account",
        })),
        selectorKey
      );
    } else {
      useSelectorStore.getState().clearSelection(selectorKey);
    }
  };

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const onDeleteConfirm = () => {
    const ids = selectedItems.accounts.map((account) => account.id);
    if (ids.length > 0) {
      deleteAccounts(ids);
    }
    setIsDeleteConfirmOpen(false);
    clearSelection(selectorKey);
  };

  const onDeleteConfirmCancel = () => {
    setIsDeleteConfirmOpen(false);
    clearSelection(selectorKey);
  };

  const [isDeleteTooltipOpen, setIsDeleteTooltipOpen] = useState(false);
  const isAllSelected = selectedItems.accounts.length === total && total > 0;
  const isActiveAccountSelected = selectedItems.accounts.some((account) =>
    isActive(account.id)
  );
  const isDeleteDisabled = isAllSelected || isActiveAccountSelected;

  if (isDeleteConfirmOpen) {
    const l = selectedItems?.accounts?.length ?? 0;
    const recordsWord = plural(l, "account", "accounts");
    const subtitle = `You are about to delete ${l} ${recordsWord}. Are you sure?`;

    return (
      <DeleteConfirmation
        onCancel={onDeleteConfirmCancel}
        onConfirm={onDeleteConfirm}
        title="Delete accounts"
        inputConfirmationText="DELETE"
        subtitle={subtitle}
      />
    );
  }

  return (
    <MiddleSection>
      <div className="h-[94px] border-b-gray-moderate border-solid z-[19] border-b bg-[#1d2122] flex flex-col">
        <PaginationHeader
          selectorKey={selectorKey}
          itemName={{
            singular: "account",
            plural: "accounts",
          }}
          onBulkSelectChange={onBulkSelectChange}
          onSelectAll={onSelectAll}
          limit={limit}
        />
        <div className="h-[47px] flex flex-row items-center justify-between px-[32px] py-[12px]">
          <div className="flex flex-row items-center gap-[8px]">
            <Button
              variant="action"
              disabled={
                selectedItems.accounts.length !== 1 ||
                isActive(selectedItems.accounts[0]?.id)
              }
              onClick={onActivate}
            >
              Activate
            </Button>

            <TooltipProvider delayDuration={0}>
              <Tooltip
                onOpenChange={(open) =>
                  setIsDeleteTooltipOpen(isDeleteDisabled && open)
                }
                open={isDeleteTooltipOpen}
              >
                <TooltipTrigger className="cursor-default">
                  <Button
                    variant="action"
                    disabled={
                      selectedItems.accounts.length === 0 || isDeleteDisabled
                    }
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  {isAllSelected && <p>You can&apos;t delete all accounts.</p>}
                  {isActiveAccountSelected && (
                    <p>You can&apos;t delete active accounts.</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
          </div>
          <div className="flex flex-row items-center gap-[8px]">
            <Button variant="action" onClick={() => router.push("/create/account")}>
              Create
            </Button>
            <Combobox
              items={[]}
              value=""
              onChange={() => void 0}
              name=""
              align="end"
              disabled
              trigger={
                <div className="h-[24px] flex items-center px-[12px] rounded text-display-12 font-bold cursor-not-allowed border border-solid border-gray-moderate bg-hover-1 text-text-disabled opacity-50">
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
          data?.data
            ?.slice((page - 1) * limit, page * limit)
            .map((account) => (
              <AccountListItem
                key={account.id}
                account={account}
                onSelect={onRecordSelect}
              />
            ))
        )}
      </Scrollbar>
    </MiddleSection>
  );
};
