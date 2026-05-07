import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { axiosClient } from "~/service/axios";
import { AccountData } from "~/service/types";

export const useAccount = () => {
  const router = useRouter();
  const { id } = router.query;

  const query = useQuery({
    queryKey: ["account", id],
    queryFn: () => axiosClient.get<AccountData>(`/accounts/${id}`),
  });

  return query;
};
