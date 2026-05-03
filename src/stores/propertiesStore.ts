import { create } from "zustand";
import { PropertyLockType } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { uid } from "~/lib/utils/uid";
import { PropertyValueProjection } from "~/types/propertyValueProjection";

export interface PropertyValue {
  id: string;
  value: string;
  sortOrder: number;
}

export type PropertiesContext =
  | "contacts"
  | "companies"
  | "accounts"
  | "team"
  | null;
type ValidationMap = { isValid: boolean; error?: string };
export type PropertiesValidationMap = Record<string, ValidationMap>;

export interface PropertiesStore {
  propertyTypes: PropertyTypeWithLabel[];
  selectedPropertyType: PropertyTypeWithLabel | undefined;
  setSelectedPropertyType: (
    propertyType: PropertyTypeWithLabel | undefined
  ) => void;
  propertyTitle: string;
  setPropertyTitle: (title: string) => void;
  propertyValues: PropertyValue[];
  showMailbox: boolean;
  getShowMailbox: () => boolean;
  setPropertyValues: (propertyValues: PropertyValue[]) => void;
  deletedPropertyValues: string[];
  setDeletedPropertyValues: (propertyValues: string[]) => void;
  addDeletedPropertyValue: (propertyValue: string) => void;
  properties: Property[];
  setSettingsProperties: (properties: Property[]) => void;
  settingsProperties: Property[];
  deletedProperties: string[];
  setDeletedProperties: (properties: string[]) => void;
  setProperties: (properties: Property[]) => void;
  isPropertyInActiveProperties: (id: string) => boolean;
  addPropertyToActive: (property: Property) => void;
  selectPropertyValue: (id: string, value: string) => void;
  removePropertyValue: (id: string, value: string) => void;
  clearPropertyValues: (id: string) => void;
  setPropertyStringValue: (id: string, stringValue?: string) => void;
  setPropertyDateValue: (id: string, dateValue?: Date) => void;
  setPropertyLinkValue: (id: string, linkValue?: string) => void;
  getPropertyById: (id: string) => Property | undefined;
  isPropertyLocked: (id: string) => boolean;
  isPropertyValueHidden: (id: string) => boolean;
  activeProperties: Property[];
  setActiveProperties: (properties: Property[]) => void;
  removePropertyFromActive: (id: string) => void;
  isPropertiesLoading: boolean;
  setIsPropertiesLoading: (isLoading: boolean) => void;

  propertiesContext: PropertiesContext;
  setPropertiesContext: (context: PropertiesContext) => void;
  propertiesValidationMap: PropertiesValidationMap;
  clearPropertiesValidationMap: () => void;
  setPropertiesValidationMap: (map: PropertiesValidationMap) => void;
  setPropertyValidation: ({
    id,
    isValid,
    error,
  }: {
    id: string;
    isValid: boolean;
    error?: string;
  }) => void;
  setPropertyLockType: (id: string, lockType: PropertyLockType) => void;
  activeEditingLockTypePropertyId: string | null;
  setActiveEditingLockTypePropertyId: (propertyId: string | null) => void;

}

interface PropertyTypeWithLabel {
  value: PropertyType;
  label: string;
}

export const propertyTypes: PropertyTypeWithLabel[] = [
  {
    value: "SINGLE_LINE_TEXT",
    label: "Single line text",
  },
  {
    value: "MULTI_LINE_TEXT",
    label: "Multi line text",
  },
  {
    value: "SINGLE_SELECT",
    label: "Single select",
  },
  {
    value: "MULTI_SELECT",
    label: "Multi select",
  },
  {
    value: "COUNTRY_SELECT",
    label: "Country select",
  },
  {
    value: "STATE_SELECT",
    label: "State of residence",
  },
  {
    value: "CITY_SELECT",
    label: "City of residence",
  },
  {
    value: "REGION_SELECT",
    label: "Region of residence",
  },
  {
    value: "LANGUAGE_SELECT",
    label: "Language select",
  },
  {
    value: "LANGUAGE_MULTISELECT",
    label: "Language multi-select",
  },
  {
    value: "DATE",
    label: "Date selector",
  },
  {
    value: "NUMBER",
    label: "Number",
  },
  {
    value: "PHOTO",
    label: "Image",
  },
  {
    value: "COMPANY_EMPLOYEE_COUNT",
    label: "Employee count",
  },
];

export type PropertyType =
  | "MULTI_LINE_TEXT"
  | "SINGLE_LINE_TEXT"
  | "MULTI_SELECT"
  | "SINGLE_SELECT"
  | "DATE"
  | "NUMBER"
  | "PHOTO"
  | "DOMAIN"
  | "ACCOUNT_EMAIL"
  | "CONTACT_EMAIL"
  | "CONTACT_EMAILS"
  | "LINKEDIN_PROFILE_URL"
  | "COUNTRY_SELECT"
  | "STATE_SELECT"
  | "CITY_SELECT"
  | "REGION_SELECT"
  | "LANGUAGE_SELECT"
  | "LANGUAGE_MULTISELECT"
  | "COMPANY_EMPLOYEE_COUNT";

export type PropertyValueSource = "USER" | "LINKED_IN";

export interface Property {
  type: PropertyType;
  id: string;
  title: string;
  stringValue?: string;
  dateValue?: Date;
  linkValue?: string;
  values?: PropertyValue[];
  placeholder?: string;
  selectedValues?: string[];
  isActive?: boolean;
  sortOrder?: number;
  isRequired: boolean;
  isDefault?: boolean;
  isDomainVerified?: boolean;
  isInternallyManaged?: boolean;
  lockType?: PropertyLockType;
  source?: PropertyValueSource;
  isLoading?: boolean;
  valueProjection?: PropertyValueProjection | null;
  jsonValue?: unknown;
  hasLinkedInFieldMapping?: boolean;
  isReadOnly?: boolean;
}

export const defaultProperties: Property[] = [];

export const getDefaultPropertyValueId = () => {
  return `default-${uid()}`;
};

export const usePropertiesStore = create<PropertiesStore>((set, get) => ({
  // create property
  propertyTypes,

  propertiesContext: null,
  setPropertiesContext: (context: PropertiesContext) =>
    set(() => ({ propertiesContext: context })),
  showMailbox: false,
  getShowMailbox: () =>
    get().propertiesContext === "contacts" ||
    get().propertiesContext === "companies",

  selectedPropertyType: undefined,
  setSelectedPropertyType: (propertyType) =>
    set({ selectedPropertyType: propertyType }),

  propertyValues: [
    { id: getDefaultPropertyValueId(), value: "", sortOrder: 0 },
  ],
  setPropertyValues: (propertyValues) => set({ propertyValues }),

  deletedPropertyValues: [],
  setDeletedPropertyValues: (propertyValues) =>
    set({ deletedPropertyValues: propertyValues }),
  addDeletedPropertyValue: (propertyValue) =>
    set((state) => ({
      deletedPropertyValues: [...state.deletedPropertyValues, propertyValue],
    })),

  propertyTitle: "",
  setPropertyTitle: (title) => set({ propertyTitle: title }),

  // response menu
  getPropertyById: (id: string) =>
    get().properties.find((property) => property.id === id),

  setProperties: (properties: Property[]) =>
    set(() => ({ properties: properties })),
  properties: defaultProperties,

  setSettingsProperties: (properties: Property[]) =>
    set(() => ({ settingsProperties: properties })),
  settingsProperties: defaultProperties,

  setDeletedProperties: (properties: string[]) =>
    set(() => ({ deletedProperties: properties })),
  deletedProperties: [],

  activeProperties: defaultProperties,
  setActiveProperties: (properties: Property[]) =>
    set(() => ({ activeProperties: properties })),

  addPropertyToActive: (property: Property) =>
    set(() => ({ activeProperties: [...get().activeProperties, property] })),
  removePropertyFromActive: (id: string) =>
    set(() => ({
      activeProperties: get().activeProperties.filter(
        (property) => property.id !== id
      ),
    })),

  isPropertyInActiveProperties: (id: string) =>
    get().activeProperties.some((property) => property.id === id),

  selectPropertyValue: (id: string, value: string) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id
          ? {
              ...property,
              selectedValues: [value, ...(property.selectedValues || [])],
            }
          : property
      ),
    })),
  removePropertyValue: (id: string, value: string) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id
          ? {
              ...property,
              selectedValues: property.selectedValues?.filter(
                (v) => v !== value
              ),
            }
          : property
      ),
    })),
  clearPropertyValues: (id: string) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id ? { ...property, selectedValues: [] } : property
      ),
    })),

  setPropertyStringValue: (id: string, stringValue?: string) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id ? { ...property, stringValue } : property
      ),
    })),
  setPropertyDateValue: (id: string, dateValue?: Date) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id ? { ...property, dateValue } : property
      ),
    })),
  setPropertyLinkValue: (id: string, linkValue?: string) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id ? { ...property, linkValue } : property
      ),
    })),

  setPropertyLockType: (id: string, lockType: PropertyLockType) =>
    set(() => ({
      properties: get().properties.map((property) =>
        property.id === id ? { ...property, lockType } : property
      ),
    })),

  isPropertiesLoading: true,
  setIsPropertiesLoading: (isLoading: boolean) =>
    set(() => ({ isPropertiesLoading: isLoading })),

  propertiesValidationMap: {},
  setPropertiesValidationMap: (map: PropertiesValidationMap) =>
    set(() => ({ propertiesValidationMap: map })),
  clearPropertiesValidationMap: () =>
    set(() => ({ propertiesValidationMap: {} })),
  setPropertyValidation: ({
    id,
    isValid,
    error,
  }: {
    id: string;
    isValid: boolean;
    error?: string;
  }) =>
    set((state) => ({
      propertiesValidationMap: {
        ...state.propertiesValidationMap,
        [id]: { isValid, error },
      },
    })),

  isPropertyLocked: (id: string) => {
    const property = get().getPropertyById(id);
    return (
      property?.lockType === PropertyLockType.PERSONAL_DEFAULT ||
      property?.lockType === PropertyLockType.HIDDEN_FULLY_LOCKED ||
      property?.lockType === PropertyLockType.VISIBLE_FULLY_LOCKED ||
      property?.isReadOnly === true ||
      property?.isInternallyManaged === true
    );
  },
  isPropertyValueHidden: (id: string) => {
    const property = get().getPropertyById(id);
    return property?.lockType === PropertyLockType.HIDDEN_FULLY_LOCKED;
  },
  activeEditingLockTypePropertyId: null,
  setActiveEditingLockTypePropertyId: (propertyId: string | null) =>
    set(() => ({ activeEditingLockTypePropertyId: propertyId })),

}));
