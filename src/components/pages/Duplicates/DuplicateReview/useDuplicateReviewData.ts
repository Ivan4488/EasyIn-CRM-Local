import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import {
  ContactData,
  DuplicateReviewData,
  DuplicateReviewsResponse,
} from "~/service/types";
import { PropertyBackend } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";

export function useDuplicateReviewData(reviewId: string) {
  // Fetch all reviews and find the one we need
  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["duplicateReviews"],
    queryFn: async () => {
      const { data } = await axiosClient.get<DuplicateReviewsResponse>(
        "/contacts/duplicate-reviews"
      );
      return data;
    },
    staleTime: 30_000,
  });

  const review = reviewsData?.reviews?.find((r: DuplicateReviewData) => r.id === reviewId) ?? null;

  // Fetch both contacts using existing GET /contacts/find/:id
  const { data: sourceContact, isLoading: isSourceLoading } = useQuery({
    queryKey: ["contacts", review?.source_contact_id],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContactData>(
        `/contacts/find/${review!.source_contact_id}`
      );
      return data;
    },
    enabled: !!review,
  });

  const { data: targetContact, isLoading: isTargetLoading } = useQuery({
    queryKey: ["contacts", review?.target_contact_id],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContactData>(
        `/contacts/find/${review!.target_contact_id}`
      );
      return data;
    },
    enabled: !!review,
  });

  // Fetch both contacts' properties using existing GET /contacts/:id/properties
  // NOTE: queryFn must return the full AxiosResponse (not destructured) to match
  // useProperties which uses the same queryKey and caches the AxiosResponse.
  const { data: sourcePropsResponse, isLoading: isSourcePropsLoading } = useQuery({
    queryKey: ["contactProperties", review?.source_contact_id],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(
        `/contacts/${review!.source_contact_id}/properties`
      ),
    enabled: !!review,
  });

  const { data: targetPropsResponse, isLoading: isTargetPropsLoading } = useQuery({
    queryKey: ["contactProperties", review?.target_contact_id],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(
        `/contacts/${review!.target_contact_id}/properties`
      ),
    enabled: !!review,
  });

  return {
    review,
    sourceContact: sourceContact ?? null,
    targetContact: targetContact ?? null,
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
