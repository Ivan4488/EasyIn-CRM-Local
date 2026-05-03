import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import {
  CompanyData,
  CompanyDuplicateReviewData,
  CompanyDuplicateReviewsResponse,
} from "~/service/types";
import { PropertyBackend } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";

export function useCompanyDuplicateReviewData(reviewId: string) {
  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["companyDuplicateReviews"],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyDuplicateReviewsResponse>(
        "/companies/duplicate-reviews"
      );
      return data;
    },
    staleTime: 30_000,
  });

  const review =
    reviewsData?.reviews?.find((r: CompanyDuplicateReviewData) => r.id === reviewId) ?? null;

  const { data: sourceCompany, isLoading: isSourceLoading } = useQuery({
    queryKey: ["companies", review?.source_company_id],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyData>(
        `/companies/find/${review!.source_company_id}`
      );
      return data;
    },
    enabled: !!review,
  });

  const { data: targetCompany, isLoading: isTargetLoading } = useQuery({
    queryKey: ["companies", review?.target_company_id],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyData>(
        `/companies/find/${review!.target_company_id}`
      );
      return data;
    },
    enabled: !!review,
  });

  const { data: sourcePropsResponse, isLoading: isSourcePropsLoading } = useQuery({
    queryKey: ["companyProperties", review?.source_company_id],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(
        `/companies/${review!.source_company_id}/properties`
      ),
    enabled: !!review,
  });

  const { data: targetPropsResponse, isLoading: isTargetPropsLoading } = useQuery({
    queryKey: ["companyProperties", review?.target_company_id],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(
        `/companies/${review!.target_company_id}/properties`
      ),
    enabled: !!review,
  });

  return {
    review,
    sourceCompany: sourceCompany ?? null,
    targetCompany: targetCompany ?? null,
    sourceProperties: sourcePropsResponse?.data ?? [],
    targetProperties: targetPropsResponse?.data ?? [],
    isLoading:
      isReviewsLoading ||
      isSourceLoading ||
      isTargetLoading ||
      isSourcePropsLoading ||
      isTargetPropsLoading,
  };
}
