import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { axiosClient } from "~/service/axios";
import { Button } from "~/components/UI/Buttons/Button";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { PropertyFilter } from "./PropertyFilter";
import { PropertyMismatch } from "./PropertyMismatch";
import { useDuplicateReviewData } from "./useDuplicateReviewData";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Loader } from "~/components/UI/Loader/Loader";
import { DuplicateLocationBar } from "./DuplicateLocationBar";
import { getPropertyDisplayValue } from "../utils/getPropertyDisplayValue";

interface PropertyConflict {
  propertyId: string;
  propertyName: string;
  sourceValue: string;
  targetValue: string;
}

interface Props {
  reviewId: string;
}

export const DuplicateReviewRightMenu = ({ reviewId }: Props) => {
  const queryClient = useQueryClient();
  const setSelectedDuplicateReviewId = useLeftMenuStore((s) => s.setSelectedDuplicateReviewId);

  const {
    review,
    targetContact,
    sourceProperties,
    targetProperties,
    isLoading,
  } = useDuplicateReviewData(reviewId);

  const { toast } = useToast();

  const [propertySelections, setPropertySelections] = useState<
    Record<string, "source" | "target">
  >({});



  const resolveMutation = useMutation({
    mutationFn: async (body: {
      action: "merge" | "dismiss";
      keep_contact_id?: string;
      property_selections?: { propertyId: string; selected_from: "source" | "target" }[];
    }) =>
      axiosClient.post(`/contacts/duplicate-reviews/${reviewId}/resolve`, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["duplicateReviews"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contactProperties"] });
      toast({
        title: "Success",
        description:
          variables.action === "merge"
            ? "Contacts merged successfully"
            : "Duplicate dismissed",
        variant: "success",
      });
      setSelectedDuplicateReviewId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while resolving the duplicate",
        variant: "destructive",
      });
    },
  });

  const conflicts = useMemo<PropertyConflict[]>(() => {
    if (!sourceProperties.length || !targetProperties.length) return [];
    const result: PropertyConflict[] = [];
    for (const sp of sourceProperties) {
      if (!sp.is_active) continue;
      const tp = targetProperties.find((t) => t.id === sp.id);
      if (!tp) continue;
      const sv = getPropertyDisplayValue(sp);
      const tv = getPropertyDisplayValue(tp);
      if (sv && tv && sv !== tv) {
        result.push({
          propertyId: sp.id,
          propertyName: sp.name,
          sourceValue: sv,
          targetValue: tv,
        });
      }
    }
    return result;
  }, [sourceProperties, targetProperties]);

  const handleMerge = () => {
    if (!review) return;
    const selections = conflicts.map(({ propertyId }) => ({
      propertyId,
      selected_from: propertySelections[propertyId] ?? "target",
    }));
    resolveMutation.mutate({
      action: "merge",
      keep_contact_id: review.target_contact_id,
      property_selections: selections,
    });
  };

  const handleKeepBoth = () => resolveMutation.mutate({ action: "dismiss" });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || !review) {
    return (
      <div
        className="w-[300px] flex items-center justify-center"
        style={{ background: "rgba(29, 30, 32, 0.60)" }}
      >
        <Loader />
      </div>
    );
  }

  // ── Review UI ──────────────────────────────────────────────────────────────
  return (
    <div
      className="w-[300px] flex flex-col h-full"
      style={{ background: "rgba(29, 30, 32, 0.60)" }}
    >
      <DuplicateLocationBar
        firstName={targetContact?.firstName ?? ""}
        lastName={targetContact?.lastName ?? ""}
        avatar={targetContact?.avatar ?? null}
        onBack={() => setSelectedDuplicateReviewId(null)}
      />

      <Scrollbar
        id="right-menu-scroll"
        everPresent
        className="pb-[80px] w-[300px] px-[8px] pt-[12px] z-[40] flex-1"
        style={{ scrollBehavior: "smooth" }}
      >
        {conflicts.length > 0 ? (
          <div className="flex flex-col gap-[16px] px-[12px]">
            <PropertyFilter count={conflicts.length} />
            {conflicts.map((conflict) => (
              <PropertyMismatch
                key={conflict.propertyId}
                propertyName={conflict.propertyName}
                sourceValue={conflict.sourceValue}
                targetValue={conflict.targetValue}
                selectedOrigin={propertySelections[conflict.propertyId] ?? "target"}
                onSelect={(origin) =>
                  setPropertySelections((prev) => ({
                    ...prev,
                    [conflict.propertyId]: origin,
                  }))
                }
              />
            ))}
          </div>
        ) : (
          <div className="px-[20px] py-[24px] flex flex-col gap-[8px]">
            <p className="text-display-14 text-white font-semibold">
              No conflicting data
            </p>
            <p className="text-display-13 text-text-weak leading-[1.5]">
              These two contacts share no overlapping property values. You can safely merge them and no data will be lost.
            </p>
          </div>
        )}
      </Scrollbar>

      {/* Fixed bottom action bar */}
      <div className="w-[300px] fixed z-[100] right-0 bottom-0 bg-black-moderate border-t border-solid border-gray-moderate">
        <div className="px-[16px] py-[8px] h-[72px] flex gap-[8px] justify-center items-center">
          <Button
            variant="secondary"
            onClick={handleKeepBoth}
            disabled={resolveMutation.isPending}
            className="flex-1 h-[38px]"
          >
            Keep Both
          </Button>
          <Button
            variant="primary"
            onClick={handleMerge}
            disabled={resolveMutation.isPending}
            isLoading={resolveMutation.isPending}
            className="flex-1 h-[38px]"
          >
            Merge
          </Button>
        </div>
      </div>
    </div>
  );
};
