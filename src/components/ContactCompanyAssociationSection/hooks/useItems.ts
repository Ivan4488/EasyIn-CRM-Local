import { useQuery } from "@tanstack/react-query";
import { getContactName } from "~/lib/utils/getContactName";
import { axiosClient } from "~/service/axios";
import { CompanyData, ContactData } from "~/service/types";
import { usePropertiesStore } from "~/stores/propertiesStore";

const transformContacts = (data: ContactData[]) => {
  return data.map((contact) => ({
    label: getContactName(contact),
    value: contact.id,
  }));
};

const transformCompanies = (data: CompanyData[]) => {
  return data.map((company) => ({
    label: company.name,
    value: company.id,
  }));
};

export const useItems = () => {
  const { propertiesContext } = usePropertiesStore();

  const contacts = useQuery({
    queryKey: ["contacts"],
    queryFn: () => {
      return axiosClient.get<ContactData[]>("/contacts/all");
    },
    enabled: propertiesContext === "companies",
    select: (data) => transformContacts(data.data),
  });

  const companies = useQuery({
    queryKey: ["companies"],
    queryFn: () => {
      return axiosClient.get<CompanyData[]>("/companies/all");
    },
    enabled: propertiesContext === "contacts",
    select: (data) => transformCompanies(data.data),
  });

  return propertiesContext === "contacts"
    ? companies
    : contacts;
};
