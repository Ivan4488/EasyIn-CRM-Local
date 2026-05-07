import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { axiosClient } from "~/service/axios";
import { CompanyDuplicateReviewsResponse } from "~/service/types";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Loader } from "~/components/UI/Loader/Loader";
import { PaginationHeader } from "~/components/PaginationHeader/PaginationHeader";
import { Button } from "~/components/UI/Buttons/Button";
import { CompanyDuplicateRecord } from "./CompanyDuplicateRecord";
import { useSelectorStore } from "~/stores/select";
import { usePaginationStore } from "~/stores/paginationStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { useCompanyDuplicateConflictCount } from "./hooks/useCompanyDuplicateConflictCount";
import { useToast } from "~/components/UI/hooks/use-toast";

const selectorKey = "companyDuplicateList";

const ConflictCountedRecord = ({
  review,
  onSelect,
}: {
  review: { id: string; source_company_id: string; target_company_id: string; matched_by: string; matched_value: string | null; status: "pending" | "merged" | "dismissed"; created_at: string };
  onSelect: () => void;
}) => {
  const conflictCount = useCompanyDuplicateConflictCount(
    review.source_company_id,
    review.target_company_id
  );
  return <CompanyDuplicateRecord review={review} conflictCount={conflictCount} onSelect={onSelect} />;
};

export const CompanyDuplicateListMiddle = () => {
  const { clearSelection } = useSelectorStore();
  const selectedItems = useSelectorStore((state) => state.selectedItems[selectorKey]);
  const isSelectionEmpty = (selectedItems?.length ?? 0) === 0;
  const { setIsSelectAll } = useSelectorStore.getState();
  const { setTotal } = usePaginationStore();
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDismissing, setIsDismissing] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    rightMenuNavigationStore.setPropertiesSection("default");
    clearSelection(selectorKey);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["companyDuplicateReviews"],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyDuplicateReviewsResponse>(
        "/companies/duplicate-reviews"
      );
      return data;
    },
    staleTime: 30_000,
  });

  const reviews = data?.reviews ?? [];

  useEffect(() => {
    setTotal(reviews.length);
  }, [reviews.length]);

  const onBulkSelectChange = (isChecked: boolean) => {
    setIsSelectAll(isChecked, selectorKey);
    if (isChecked) {
      useSelectorStore.getState().selectMultiple(
        reviews.map((r) => ({ id: r.id, type: "duplicate" })),
        selectorKey
      );
    } else {
      useSelectorStore.getState().clearSelection(selectorKey);
    }
  };

  const onSelectAll = () => {
    useSelectorStore.getState().selectMultiple(
      reviews.map((r) => ({ id: r.id, type: "duplicate" })),
      selectorKey
    );
    setIsSelectAll(true, selectorKey);
  };

  const onRecordSelect = useCallback(() => {
    const selected = useSelectorStore.getState().selectedItems[selectorKey];
    const isEverySelected = reviews.every((r) => selected?.find((s) => s.id === r.id));
    setIsSelectAll(isEverySelected || false, selectorKey);
  }, [reviews]);

  const handleBulkDismiss = async () => {
    const selected = useSelectorStore.getState().selectedItems[selectorKey] ?? [];
    if (selected.length === 0) return;
    setIsDismissing(true);
    try {
      await Promise.all(
        selected.map((item) =>
          axiosClient.post(`/companies/duplicate-reviews/${item.id}/resolve`, {
            action: "dismiss",
          })
        )
      );
      await queryClient.invalidateQueries({ queryKey: ["companyDuplicateReviews"] });
      clearSelection(selectorKey);
      toast({
        title: "Success",
        description:
          selected.length === 1
            ? "Duplicate dismissed"
            : `${selected.length} duplicates dismissed`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong while dismissing",
        variant: "destructive",
      });
    } finally {
      setIsDismissing(false);
    }
  };

  const handleBulkResolve = async () => {
    const selected = useSelectorStore.getState().selectedItems[selectorKey] ?? [];
    if (selected.length === 0) return;
    setIsResolving(true);
    try {
      await Promise.all(
        selected.map((item) => {
          const review = reviews.find((r) => r.id === item.id);
          if (!review) return Promise.resolve();
          return axiosClient.post(`/companies/duplicate-reviews/${item.id}/resolve`, {
            action: "merge",
            keep_company_id: review.target_company_id,
          });
        })
      );
      await queryClient.invalidateQueries({ queryKey: ["companyDuplicateReviews"] });
      await queryClient.invalidateQueries({ queryKey: ["companies"] });
      await queryClient.invalidateQueries({ queryKey: ["recordsList"] });
      clearSelection(selectorKey);
      toast({
        title: "Success",
        description:
          selected.length === 1
            ? "Duplicate resolved"
            : `${selected.length} duplicates resolved`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong while resolving",
        variant: "destructive",
      });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <MiddleSection>
      <div className="h-[94px] border-b-gray-moderate border-solid z-[19] border-b bg-[#1d2122] flex flex-col">
        <PaginationHeader
          selectorKey={selectorKey}
          onBulkSelectChange={onBulkSelectChange}
          onSelectAll={onSelectAll}
          limit={reviews.length || 1}
          itemName={{ singular: "duplicate", plural: "duplicates" }}
        />
        <div className="h-[47px] flex flex-row items-center justify-between px-[32px] py-[12px]">
          <div className="flex flex-row items-center gap-[8px]">
            <Button
              variant="action"
              disabled={isSelectionEmpty || isDismissing}
              isLoading={isDismissing}
              onClick={handleBulkDismiss}
            >
              Dismiss
            </Button>
            <Button
              variant="action"
              disabled={isSelectionEmpty || isResolving || isDismissing}
              isLoading={isResolving}
              onClick={handleBulkResolve}
            >
              Resolve
            </Button>
          </div>
        </div>
      </div>

      <Scrollbar className="flex flex-col gap-[16px] p-[16px] h-full" everPresent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-weak text-display-14">
            No duplicates to review
          </div>
        ) : (
          reviews.map((review) => (
            <ConflictCountedRecord
              key={review.id}
              review={review}
              onSelect={onRecordSelect}
            />
          ))
        )}
      </Scrollbar>
    </MiddleSection>
  );
};
