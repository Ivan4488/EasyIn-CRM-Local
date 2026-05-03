import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import {type AccountData } from "~/service/types";

export const useAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: () => {
      return axiosClient.get<AccountData[]>("/accounts");
    },
  });

  return query;
};
