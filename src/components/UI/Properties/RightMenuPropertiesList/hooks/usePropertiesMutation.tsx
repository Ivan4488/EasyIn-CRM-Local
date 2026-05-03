import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { CompanyData, ContactData } from "~/service/types";
import { Property, usePropertiesStore } from "~/stores/propertiesStore";
import { PropertyLockType } from "./useProperties"
import { supabaseInstance } from "~/service/supabase";

type ContactPropertyValueBackend = {
  id: string;
  contactId: string;
  propertyId: string;
  textValue: string | null;
  numberValue?: number | null;
  linkValue: string | null;
  dateValue: Date | null;
  jsonValue: unknown | null;
  created_at: Date;
  updated_at: Date | null;
  valid_from: Date | null;
  valid_to: Date | null;
  is_current: boolean;
  selectOptionIds: string[] | null;
  lock_type: PropertyLockType;
};

const transformPropertyValues = (propertyValues: Property[]) => {
  return propertyValues.map((property) => {
    const transformedProperty: Partial<ContactPropertyValueBackend> = {
      propertyId: property.id,
    };

    transformedProperty.lock_type = property.lockType;

    switch (property.type) {
      case "SINGLE_LINE_TEXT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "MULTI_LINE_TEXT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "MULTI_SELECT":
        transformedProperty.selectOptionIds = property.selectedValues;
        break;
      case "SINGLE_SELECT":
        const selectedValues = property.selectedValues;

        transformedProperty.selectOptionIds =
          selectedValues && selectedValues.length > 0
            ? [selectedValues[0]].filter(
                (value): value is string => value !== undefined
              )
            : [];
        break;
      case "COUNTRY_SELECT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "STATE_SELECT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "REGION_SELECT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "CITY_SELECT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "PHOTO":
        transformedProperty.linkValue = property.linkValue;
        transformedProperty.textValue = property.stringValue;
        break;
      case "DOMAIN":
        transformedProperty.textValue = property.stringValue;
        break;
      case "DATE":
        transformedProperty.dateValue = property.dateValue;
        break;
      case "NUMBER": {
        const raw = property.stringValue?.replace(/,/g, "").trim();
        transformedProperty.numberValue = raw ? Number(raw) : null;
        transformedProperty.textValue = property.stringValue ?? null;
        break;
      }
      case "ACCOUNT_EMAIL":
        transformedProperty.textValue = property.stringValue;
        break;
      case "CONTACT_EMAIL":
        transformedProperty.textValue = property.stringValue;
        break;
      case "LINKEDIN_PROFILE_URL":
        transformedProperty.textValue = property.stringValue;
        break;
      case "LANGUAGE_SELECT":
        transformedProperty.textValue = property.stringValue;
        break;
      case "LANGUAGE_MULTISELECT":
        // Store selected language names as JSON string in textValue
        transformedProperty.textValue = property.selectedValues?.length
          ? JSON.stringify(property.selectedValues)
          : null;
        break;
      case "CONTACT_EMAILS":
        transformedProperty.jsonValue = property.jsonValue || null;
        transformedProperty.textValue = property.stringValue || null;
        break;
    }

    return transformedProperty;
  });
};

export const usePropertiesMutation = () => {
  const router = useRouter();
  const itemId = router.query.id as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactsPropertiesMutation = useMutation({
    mutationKey: ["setContactProperties", itemId],
    mutationFn: ({ properties }: { properties: Property[] }) => {
      return axiosClient.post(`/contacts/${itemId}/properties`, {
        properties: transformPropertyValues(properties),
      });
    },
    onMutate: ({ properties }) => {
      if (properties.some((p) => p.title === "First Name")) {
        queryClient.setQueryData(
          ["contacts", itemId],
          (oldData: ContactData) => {
            const firstName = properties.find((p) => p.title === "First Name")
              ?.stringValue;

            return {
              ...oldData,
              firstName: firstName,
            };
          }
        );
      }

      if (properties.some((p) => p.title === "Last Name")) {
        queryClient.setQueryData(
          ["contacts", itemId],
          (oldData: ContactData) => {
            const lastName = properties.find((p) => p.title === "Last Name")
              ?.stringValue;

            return {
              ...oldData,
              lastName: lastName,
            };
          }
        );
      }

      if (properties.some((p) => p.title === "Profile image")) {
        queryClient.setQueryData(
          ["contacts", itemId],
          (oldData: ContactData) => {
            const avatar = properties.find((p) => p.title === "Profile image")
              ?.linkValue;

            return {
              ...oldData,
              avatar: avatar,
            };
          }
        );
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Record updated",
      });
      queryClient.invalidateQueries({
        queryKey: ["contactProperties", itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["recordsList"] });
      queryClient.invalidateQueries({ queryKey: ["contact", itemId] });
      queryClient.invalidateQueries({ queryKey: ["messages", itemId] });
      queryClient.invalidateQueries({ queryKey: ["propertyHistory", itemId] });

      // The backend fires an async duplicate re-check after the response when
      // a trigger property (email, LinkedIn URL, name, company, job title)
      // changes. Refresh the reviews list once the re-check has had time to
      // finish so any newly created review shows up in the banner and list.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["duplicateReviews"] });
      }, 4000);
    },
    onError: (e) => {
      console.log(e);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while updating the properties",
      });
    },
  });

  const companiesPropertiesMutation = useMutation({
    mutationKey: ["setCompanyProperties", itemId],
    mutationFn: ({ properties }: { properties: Property[] }) => {
      return axiosClient.post(`/companies/${itemId}/properties`, {
        properties: transformPropertyValues(properties),
      });
    },
    onMutate: ({ properties }) => {
      if (properties.some((p) => p.title === "Company name")) {
        queryClient.setQueryData(
          ["companies", itemId],
          (oldData: CompanyData) => {
            const name = properties.find((p) => p.title === "Company name")
              ?.stringValue;

            return {
              ...oldData,
              name: name,
            };
          }
        );
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Record updated",
      });
      queryClient.invalidateQueries({
        queryKey: ["companyProperties", itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["recordsList"] });
      queryClient.invalidateQueries({ queryKey: ["company", itemId] });
      queryClient.invalidateQueries({ queryKey: ["propertyHistory", itemId] });
    },
    onError: (e) => {
      console.log(e);
      toast({
        title: "Error",
        variant: "destructive",
        description: "An error occurred while updating the properties",
      });
    },
  });

  const accountsPropertiesMutation = useMutation({
    mutationKey: ["setAccountProperties", itemId],
    mutationFn: ({ properties }: { properties: Property[] }) => {
      return axiosClient.post(`/accounts/${itemId}/properties`, {
        properties: transformPropertyValues(properties),
      });
    },
    onMutate: ({ properties }) => {
      if (properties.some((p) => p.title === "Account name")) {
        queryClient.setQueryData(["account", itemId], (oldData: any) => {
          const name = properties.find((p) => p.title === "Account name")
            ?.stringValue;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              name: name,
            },
          };
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Record updated",
      });
      queryClient.invalidateQueries({
        queryKey: ["accountProperties", itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["account", itemId] });
    },
    onError: (e: any) => {
      console.log(e);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          e?.response?.data?.message ||
          "An error occurred while updating the properties",
      });
    },
  });

  const teamPropertiesMutation = useMutation({
    mutationKey: ["setTeamProperties", itemId],
    mutationFn: ({ properties }: { properties: Property[] }) => {
      return axiosClient.post(`/users/${itemId}/properties`, {
        properties: transformPropertyValues(properties),
      });
    },
    onMutate: async ({ properties }) => {
      // TODO: make sure user changes his own email
      const emailPropertyIndex = properties.findIndex((p) => p.title === "Email");
      if (emailPropertyIndex !== -1) {
        const newEmail = properties[emailPropertyIndex]?.stringValue;
        // update Supabase user email
        const { error } = await supabaseInstance.auth.updateUser(
          { email: newEmail },
          { emailRedirectTo: `${window.location.origin}` }
        );
        if (error) {
          throw error;
        }
      }

      if (properties.some((p) => p.title === "First name")) {
        queryClient.setQueryData(["team", itemId], (oldData: any) => {
          const firstName = properties.find((p) => p.title === "First name")
            ?.stringValue;

          return {
            ...oldData,
            first_name: firstName,
          };
        });
      }

      if (properties.some((p) => p.title === "Last name")) {
        queryClient.setQueryData(["team", itemId], (oldData: any) => {
          const lastName = properties.find((p) => p.title === "Last name")
            ?.stringValue;

          return {
            ...oldData,
            last_name: lastName,
          };
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Record updated",
      });
      queryClient.invalidateQueries({
        queryKey: ["teamMembersProperties", itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["team", itemId] });
    },
    onError: (e: any) => {
      console.log(e);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          e?.response?.data?.message ||
          e?.message ||
          "An error occurred while updating the properties",
      });
    },
  });

  const propertiesMutationDict = {
    contacts: contactsPropertiesMutation,
    companies: companiesPropertiesMutation,
    accounts: accountsPropertiesMutation,
    team: teamPropertiesMutation,
  };

  const propertiesContext = usePropertiesStore.getState().propertiesContext;

  return propertiesContext ? propertiesMutationDict[propertiesContext] : null;
};
