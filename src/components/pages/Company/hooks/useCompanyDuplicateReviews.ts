import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import {
  CompanyDuplicateReviewData,
  CompanyDuplicateReviewsResponse,
} from "~/service/types";

export function useCompanyDuplicateReviews(companyId: string) {
  const { data: reviewsData } = useQuery({
    queryKey: ["companyDuplicateReviews"],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyDuplicateReviewsResponse>(
        "/companies/duplicate-reviews"
      );
      return data;
    },
    staleTime: 30_000,
  });

  const reviews =
    reviewsData?.reviews?.filter(
      (r: CompanyDuplicateReviewData) =>
        r.status === "pending" &&
        (r.source_company_id === companyId || r.target_company_id === companyId)
    ) ?? [];

  return reviews;
}
