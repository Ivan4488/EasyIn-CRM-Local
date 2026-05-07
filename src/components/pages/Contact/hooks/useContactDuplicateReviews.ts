import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { DuplicateReviewData, DuplicateReviewsResponse } from "~/service/types";

export function useContactDuplicateReviews(contactId: string) {
  const { data: reviewsData } = useQuery({
    queryKey: ["duplicateReviews"],
    queryFn: async () => {
      const { data } = await axiosClient.get<DuplicateReviewsResponse>(
        "/contacts/duplicate-reviews"
      );
      return data;
    },
    staleTime: 30_000,
  });

  const reviews =
    reviewsData?.reviews?.filter(
      (r: DuplicateReviewData) =>
        r.status === "pending" &&
        (r.source_contact_id === contactId || r.target_contact_id === contactId)
    ) ?? [];

  return reviews;
}
