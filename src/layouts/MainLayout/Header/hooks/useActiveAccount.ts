import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { AccountData } from "~/service/types";

export const useActiveAccount = () => {
  const query = useQuery({
    queryKey: ["activeAccount"],
    queryFn: () => {
      return axiosClient.get<AccountData>("/accounts/active");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  return query;
}; 