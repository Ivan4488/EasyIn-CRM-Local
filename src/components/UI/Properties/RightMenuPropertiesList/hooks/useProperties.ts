import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { axiosClient } from "~/service/axios";
import { usePropertiesResolvedId } from "./usePropertiesResolvedId";
import {
  Property,
  PropertyType,
  PropertyValueSource,
  usePropertiesStore,
} from "~/stores/propertiesStore";
import { PropertyValueProjection } from "~/types/propertyValueProjection";
import { normalizeEmployeeCountEntries, getEmployeeCountPrimaryValue } from "~/utils/employeeCount";

export type PropertyBackend = Property2[];

/** Member names match product language; values are the API/DB wire format. */
export enum PropertyLockType {
  HIDDEN_FULLY_LOCKED = "HIDDEN_FULLY_LOCKED",
  VISIBLE_FULLY_LOCKED = "VISIBLE_FULLY_LOCKED",
  PERSONAL_DEFAULT = "PERSONAL_DEFAULT",
  FILL_AND_PROTECT = "FILL_AND_PROTECT",
  REVIEW_MODE = "REVIEW_UPDATE",
  ONE_CLICK_UPDATE = "ONE_CLICK_UPDATE",
  WATCH_AND_UPDATE = "WATCH_AND_UPDATE",
}

export interface Property2 {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  account_id: string;
  sortOrder: number;
  is_active: boolean;
  is_default: boolean;
  options: Option[];
  values: PropertyValueBackend[];
  is_required: boolean;
  is_internally_managed?: boolean;
  is_readonly?: boolean;
  lock_type: PropertyLockType;
  source: PropertyValueSource;
  valueProjection?: PropertyValueProjection | null;
  has_linkedin_field_mapping?: boolean;
}

export interface Option {
  id: string;
  value: string;
  contactPropertyId: string;
  sortOrder: number;
}

export interface PropertyValueBackend {
  id: string;
  textValue: string | null;
  numberValue?: number | null;
  dateValue: string | null;
  linkValue?: string | null;
  is_domain_verified?: boolean;
  source?: PropertyValueSource;
  selectOptions: {
    id: string;
    value: string;
    contactPropertyId: string;
    sortOrder: number;
  }[];
  jsonValue?: unknown;
}

const getPlaceholder = () => {
  return "";
};

const extractFirstEmailFromJson = (jsonValue: unknown): string | undefined => {
  if (!Array.isArray(jsonValue) || jsonValue.length === 0) return undefined;
  const firstEmail = jsonValue[0];
  return typeof firstEmail?.email === 'string' ? firstEmail.email : undefined;
};

const extractContactEmails = (jsonValue: unknown): Array<{id?: string; email: string; source: string; isPrimary?: boolean; companyName?: string}> | undefined => {
  if (!Array.isArray(jsonValue) || jsonValue.length === 0) return undefined;
  return jsonValue.map((e, index) => ({
    id: e.id || `email-${index}`,
    email: typeof e.email === 'string' ? e.email : '',
    source: typeof e.source === 'string' ? e.source : 'Unknown',
    isPrimary: e.isPrimary === true,
    action: e.action ?? null,
    companyName: typeof e.companyName === 'string' ? e.companyName : undefined,
  }));
};

const extractEmployeeCount = (jsonValue: unknown, fallback = "") =>
  normalizeEmployeeCountEntries(jsonValue, fallback);

export const useProperties = (copyState?: () => void) => {
  const propertiesStore = usePropertiesStore();
  const { resolvedId, isDetached } = usePropertiesResolvedId();

  const { data: contactsData, isLoading: isContactsLoading } = useQuery({
    queryKey: ["contactProperties", resolvedId],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(`/contacts/${resolvedId}/properties`),
    enabled: !!resolvedId && propertiesStore.propertiesContext === "contacts",
  });

  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companyProperties", resolvedId],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(`/companies/${resolvedId}/properties`),
    enabled: !!resolvedId && propertiesStore.propertiesContext === "companies",
  });

  const { data: accountsData, isLoading: isAccountsLoading } = useQuery({
    queryKey: ["accountProperties", resolvedId],
    queryFn: () =>
      axiosClient.get<PropertyBackend>(`/accounts/${resolvedId}/properties`),
    enabled: !!resolvedId && propertiesStore.propertiesContext === "accounts",
  });

  const { data: teamMembersData, isLoading: isTeamMembersLoading } = useQuery({
    queryKey: ["teamMembersProperties", resolvedId],
    queryFn: () =>
      isDetached
        ? axiosClient.get<PropertyBackend>(`/users/properties/schema`)
        : axiosClient.get<PropertyBackend>(`/users/${resolvedId}/properties`),
    enabled: !!resolvedId && propertiesStore.propertiesContext === "team",
  });

  const dataDict = {
    contacts: contactsData,
    companies: companiesData,
    accounts: accountsData,
    team: teamMembersData,
  };

  const isLoadingDict = {
    contacts: isContactsLoading,
    companies: isCompaniesLoading,
    accounts: isAccountsLoading,
    team: isTeamMembersLoading,
  };

  const context = propertiesStore.propertiesContext;

  useEffect(() => {
    const data = context ? dataDict[context] : null;
    if (!data?.data) {
      propertiesStore.setProperties([]);
      propertiesStore.setActiveProperties([]);
      propertiesStore.setIsPropertiesLoading(true);
      copyState?.();
      return;
    }

    const properties: Property[] = data.data.map((property) => {
      const currentProperty = propertiesStore.getPropertyById(property.id);
      const extractedContactEmails = extractContactEmails(property.values?.[0]?.jsonValue);
      const extractedEmployeeCount = extractEmployeeCount(
        property.values?.[0]?.jsonValue,
        property.values?.[0]?.textValue ?? currentProperty?.stringValue ?? "",
      );

      const resolvedJsonValue = property.type === "CONTACT_EMAILS"
        ? extractedContactEmails ?? currentProperty?.jsonValue
        : property.type === "COMPANY_EMPLOYEE_COUNT"
        ? extractedEmployeeCount
        : undefined;

      return {
        id: property.id,
        title: property.name,
        type: property.type as PropertyType,
        placeholder: getPlaceholder(),
        values: property.options.map((option) => ({
          id: option.id,
          value: option.value,
          sortOrder: option.sortOrder,
        })),
        isActive: property.is_active,
        isRequired: property.is_required,
        isDefault: property.is_default,
        isInternallyManaged: property.is_internally_managed,
        isReadOnly: property.is_readonly,
        stringValue: property.type === "CONTACT_EMAILS"
          ? (() => {
              const jsonVal = resolvedJsonValue;
              if (!Array.isArray(jsonVal) || jsonVal.length === 0) return undefined;
              const usable = jsonVal.filter((e: { action?: string | null }) => !e.action);
              const primary = usable.find((e: { isPrimary?: boolean }) => e.isPrimary);
              return typeof primary?.email === "string" ? primary.email : undefined;
            })()
          : property.type === "COMPANY_EMPLOYEE_COUNT"
          ? (Array.isArray(resolvedJsonValue)
              ? getEmployeeCountPrimaryValue(resolvedJsonValue)
              : property.values?.[0]?.textValue ?? undefined)
          : property.type === "NUMBER"
          ? property.values?.[0]?.numberValue?.toString() ?? property.values?.[0]?.textValue ?? undefined
          : (property.values?.[0]?.textValue ?? undefined),
        linkValue: property.values?.[0]?.linkValue ?? undefined,
        isDomainVerified: property.values?.[0]?.is_domain_verified,
        dateValue: property.values?.[0]?.dateValue
          ? new Date(property.values[0].dateValue)
          : undefined,
        selectedValues:
          property.type === "LANGUAGE_MULTISELECT"
            ? (() => {
                const textValue = property.values?.[0]?.textValue;
                if (textValue) {
                  try {
                    const parsed = JSON.parse(textValue);
                    return Array.isArray(parsed) ? parsed : undefined;
                  } catch {
                    return undefined;
                  }
                }
                return undefined;
              })()
            : property.type === "MULTI_SELECT"
            ? property.values?.[0]?.selectOptions
                ?.map((option) => option.id)
                .reverse() || []
            : property.values?.[0]?.selectOptions?.[0]?.id
            ? [property.values?.[0]?.selectOptions?.[0]?.id]
            : undefined,
        sortOrder: property.sortOrder,
        lockType: property.lock_type,
        source: property.source,
        valueProjection: property.valueProjection,
        jsonValue: resolvedJsonValue,
        hasLinkedInFieldMapping:
          typeof property.has_linkedin_field_mapping === "boolean"
            ? property.has_linkedin_field_mapping
            : true,
      };
    });

    const isEasyInControlled = (p: { lockType?: PropertyLockType }) =>
      p.lockType === PropertyLockType.HIDDEN_FULLY_LOCKED ||
      p.lockType === PropertyLockType.VISIBLE_FULLY_LOCKED;

    // Sort by sortOrder, then pin EasyIn-controlled properties at the very bottom.
    // "Required by system" properties keep their normal sortOrder position.
    const sortedProperties = [
      ...properties
        .filter((p) => !isEasyInControlled(p))
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)),
      ...properties
        .filter((p) => isEasyInControlled(p))
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)),
    ];
    const activeProperties = sortedProperties.filter(
      (property) => property.isActive
    );

    propertiesStore.setProperties(sortedProperties);
    propertiesStore.setSettingsProperties(sortedProperties);
    propertiesStore.setActiveProperties(
      activeProperties.filter((property) => property.isActive)
    );
    propertiesStore.setIsPropertiesLoading(false);
    copyState?.();
  }, [contactsData, companiesData, accountsData, context, teamMembersData, resolvedId]);

  return {
    properties: propertiesStore.properties,
    isLoading: context ? isLoadingDict[context] : true,
  };
};
