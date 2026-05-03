import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { axiosClient } from "~/service/axios";
import { CompanyData, ContactData } from "~/service/types";
import { useAssociationStore } from "~/stores/associationStore";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useItems } from "./useItems";

export const useAssociations = () => {
  const { propertiesContext } = usePropertiesStore();
  const associationStore = useAssociationStore();
  const router = useRouter();
  const id = router.query.id as string;

  const { data: items } = useItems();

  const {
    data: companiesAssociatedWithContact,
    isLoading: isLoadingCompaniesAssociatedWithContact,
  } = useQuery({
    queryKey: ["companiesAssociatedWithContact", id],
    queryFn: () => {
      return axiosClient.get<CompanyData[]>(
        `/associations/contact/${id}/companies`
      );
    },
    enabled: propertiesContext === "contacts" && !!id,
  });

  const {
    data: contactsAssociatedWithCompany,
    isLoading: isLoadingContactsAssociatedWithCompany,
  } = useQuery({
    queryKey: ["contactsAssociatedWithCompany", id],
    queryFn: () => {
      return axiosClient.get<ContactData[]>(
        `/associations/company/${id}/contacts`
      );
    },
    enabled: propertiesContext === "companies" && !!id,
  });

  useEffect(() => {
    if (companiesAssociatedWithContact || contactsAssociatedWithCompany) {
      associationStore.setIsLoading(false);
    }

    if (companiesAssociatedWithContact && propertiesContext === "contacts") {
      associationStore.setAssociatedItems(
        companiesAssociatedWithContact.data.map((company) => ({
          id: company.id,
          // Prefer live association payload name; fall back to selectable item label.
          name:
            company.name ||
            items?.find((item) => item.value === company.id)?.label ||
            "",
          order: 0,
        }))
      );
    }
    if (contactsAssociatedWithCompany && propertiesContext === "companies") {
      associationStore.setAssociatedItems(
        contactsAssociatedWithCompany.data.map((contact) => ({
          id: contact.id,
          name: items?.find((item) => item.value === contact.id)?.label ?? "",
          order: 0,
        }))
      );
    }
  }, [
    companiesAssociatedWithContact,
    contactsAssociatedWithCompany,
    propertiesContext,
    items,
  ]);

  useEffect(() => {
    if (isLoadingCompaniesAssociatedWithContact || isLoadingContactsAssociatedWithCompany) {
      associationStore.setIsLoading(true);
    }
  }, [isLoadingCompaniesAssociatedWithContact, isLoadingContactsAssociatedWithCompany]);

  return {
    isLoading:
      isLoadingCompaniesAssociatedWithContact ||
      isLoadingContactsAssociatedWithCompany,
  };
};
