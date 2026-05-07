import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { axiosClient } from "~/service/axios";
import { PropertyHistoryResponse } from "~/service/types";
import { usePropertiesStore } from "~/stores/propertiesStore";

export const usePropertyHistory = () => {
  const router = useRouter();
  const { propertyId, id } = router.query;
  const context = usePropertiesStore.getState().propertiesContext;
  const contactsQuery = useQuery({
    queryKey: ["propertyHistory", propertyId, id],
    queryFn: () => {
      if (!id || !propertyId) return;

      return axiosClient.get<PropertyHistoryResponse>(
        `/contacts/${id}/properties/${propertyId}/history`
      );
    },
    enabled: !!id && !!propertyId && context === "contacts",
  });

  const companiesQuery = useQuery({
    queryKey: ["propertyHistory", propertyId, id],
    queryFn: () => {
      if (!id || !propertyId) return;

      return axiosClient.get<PropertyHistoryResponse>(
        `/companies/${id}/properties/${propertyId}/history`
      );
    },
    enabled: !!id && !!propertyId && context === "companies",
  });

  const accountsQuery = useQuery({
    queryKey: ["propertyHistory", propertyId, id],
    queryFn: () => {
      if (!id || !propertyId) return;

      return axiosClient.get<PropertyHistoryResponse>(
        `/accounts/${id}/properties/${propertyId}/history`
      );
    },
    enabled: !!id && !!propertyId && context === "accounts",
  });

  const teamQuery = useQuery({
    queryKey: ["propertyHistory", propertyId, id],
    queryFn: () => {
      if (!id || !propertyId) return;

      return axiosClient.get<PropertyHistoryResponse>(
        `/users/${id}/properties/${propertyId}/history`
      );
    },
    enabled: !!id && !!propertyId && context === "team",
  });

  const queries = {
    contacts: contactsQuery,
    companies: companiesQuery,
    accounts: accountsQuery,
    team: teamQuery,
  };

  return queries[context || "contacts"];
};
