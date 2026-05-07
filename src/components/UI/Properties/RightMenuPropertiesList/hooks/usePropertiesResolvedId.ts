import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { axiosClient } from "~/service/axios";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";

/**
 * Returns the ID used as the second segment of all property query keys.
 *
 * - When a record page is open (router.query.id is a real UUID) → that record ID.
 * - When in detached / account-wide mode (id is absent or DETACHED_PROPERTIES_ID) → the active
 *   account's ID, fetched from /accounts/active (5-min stale, always cached).
 *
 * All of useProperties, useCreatePropertyMutation, useUpdatePropertyMutation,
 * and useDeletePropertyMutation must use this hook so their query keys match.
 */
export const usePropertiesResolvedId = () => {
  const router = useRouter();
  const rawId = router.query.id as string | undefined;

  const itemId = rawId && rawId !== DETACHED_PROPERTIES_ID ? rawId : undefined;

  const { data: activeAccountData } = useQuery({
    queryKey: ["activeAccount"],
    queryFn: () => axiosClient.get<{ id: string }>("/accounts/active"),
    staleTime: 5 * 60 * 1000,
    enabled: !itemId,
  });

  const resolvedId = itemId ?? activeAccountData?.data?.id;

  return { resolvedId, isDetached: !itemId };
};
