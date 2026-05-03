import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";

export const useIsSenderEmailSet = () => {
  const query = useQuery({
    queryKey: ["isAccountEmailPropertySet"],
    queryFn: () =>
      axiosClient.get<{ isSet: boolean; isDomainVerified: boolean }>(
        "/accounts/is-email-property-set/check"
      ),
  });

  return query;
};
