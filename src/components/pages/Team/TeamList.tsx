import { PaginationHeader } from "~/components/PaginationHeader/PaginationHeader";
import { Button } from "~/components/UI/Buttons/Button";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { useCallback, useEffect, useState } from "react";
import { useSelectorStore } from "~/stores/select";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { usePaginationStore } from "~/stores/paginationStore";
import { Loader } from "~/components/UI/Loader/Loader";
import { plural } from "~/lib/utils/plural";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation";
import { useRouter } from "next/router";
import { Combobox } from "~/components/UI/Combobox/Combobox";
import { Dots } from "~/icons/ui/Dots";
import { TeamListItem } from "./TeamListItem";
import { useTeamMembers } from "./hooks/useTeamMembers";
import { TeamMember } from "~/service/types";


const selectorKey = "team";
const limit = 10;

export const TeamList = () => {
  const router = useRouter();
  const { setIsSelectAll, selectedItems, clearSelection } = useSelectorStore();
  const { setTotal, total, page } = usePaginationStore();

  const { data, isLoading } = useTeamMembers();
  const results = data?.data;

  useEffect(() => {
    clearSelection(selectorKey);
  }, []);

  useEffect(() => {
    if (results) {
      setTotal(results?.length ?? 0);
    }
  }, [results]);

  const onRecordSelect = useCallback(() => {
    const selectedItemsByKey = selectedItems[selectorKey];
    const isEveryItemSelected = results?.every((team: TeamMember) => {
      return selectedItemsByKey?.find((selected: any) => {
        return selected.id === team.id && selected.type === "team";
      });
    });

    setIsSelectAll(isEveryItemSelected || false);
  }, [results]);

  const onSelectAll = () => {
    useSelectorStore.getState().selectMultiple(
      results?.map((team: TeamMember) => ({
        id: team.id,
        type: "team",
      })) || [],
      selectorKey
    );

    setIsSelectAll(true, selectorKey);
  };

  const onBulkSelectChange = (isChecked: boolean) => {
    setIsSelectAll(isChecked, selectorKey);
    if (!results) {
      return;
    }

    if (isChecked) {
      useSelectorStore.getState().selectMultiple(
        results?.map((team: TeamMember) => ({
          id: team.id,
          type: "team",
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
    // TODO: Implement delete functionality
    setIsDeleteConfirmOpen(false);
    clearSelection(selectorKey);
  };

  const onDeleteConfirmCancel = () => {
    setIsDeleteConfirmOpen(false);
    clearSelection(selectorKey);
  };

  if (isDeleteConfirmOpen) {
    const l = selectedItems?.team?.length ?? 0;
    const recordsWord = plural(l, "team", "teams");
    const subtitle = `You are about to delete ${l} ${recordsWord}. Are you sure?`;

    return (
      <DeleteConfirmation
        onCancel={onDeleteConfirmCancel}
        onConfirm={onDeleteConfirm}
        title="Delete teams"
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
            singular: "team member",
            plural: "team members",
          }}
          onBulkSelectChange={onBulkSelectChange}
          onSelectAll={onSelectAll}
          limit={limit}
        />
        <div className="h-[47px] flex flex-row items-center justify-between px-[32px] py-[12px]">
          <div className="flex flex-row items-center gap-[8px]">
            <Button
              variant="action"
              disabled={selectedItems.team?.length === 0}
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
          <div className="flex flex-row items-center gap-[8px]">
            <Button variant="action" onClick={() => router.push("/create/team")}>
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
          results
            ?.slice((page - 1) * limit, page * limit)
            .map((teamMember: TeamMember) => (
              <TeamListItem
                key={teamMember.id}
                teamMember={teamMember}
                onSelect={onRecordSelect}
              />
            ))
        )}
      </Scrollbar>
    </MiddleSection>
  );
};
