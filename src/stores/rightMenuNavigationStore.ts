import { create } from "zustand";

export type PropertiesSection = "default" | "edit";
export type AssociationSection = "default" | "edit";
export type MiddleSection =
  | "default"
  | "photo-input"
  | "verify-domain"
  | "account-sender-email"
  | "watch-update-settings";

interface RightMenuNavigationStore {
  propertiesSection: PropertiesSection;
  setPropertiesSection: (section: PropertiesSection) => void;
  associationSection: AssociationSection;
  setAssociationSection: (section: AssociationSection) => void;

  middleSection: MiddleSection;
  setMiddleSection: (section: MiddleSection) => void;
  selectedPhotoPropertyId: string | undefined;
  setSelectedPhotoPropertyId: (id: string | undefined) => void;

  domainPropertyId: string | undefined;
  setDomainPropertyId: (id: string | undefined) => void;

  accountEmailPropertyId: string | undefined;
  setAccountEmailPropertyId: (id: string | undefined) => void;

  profileUrlPropertyId: string | undefined;
  setProfileUrlPropertyId: (id: string | undefined) => void;

  contactEmailPropertyId: string | undefined;
  setContactEmailPropertyId: (id: string | undefined) => void;

  fullHeightSection: string | undefined;
  setFullHeightSection: (section: string | undefined) => void;
  isSectionFullHeight: (section: string) => boolean;

  rightMenuSavedScrollTop: number | null;
  setRightMenuSavedScrollTop: (scrollTop: number | null) => void;

  contactEmailsModalPropertyId: string | null;
  setContactEmailsModalPropertyId: (propertyId: string | null) => void;

  employeeCountModalPropertyId: string | null;
  setEmployeeCountModalPropertyId: (propertyId: string | null) => void;

  // Tooltip state for mailbox hover/click
  tooltipOpenPropertyId: string | null;
  tooltipOpenReason: "click" | "hover" | null;
  openTooltip: (propertyId: string, reason: "click" | "hover") => void;
  closeTooltip: (reason?: "click" | "hover") => void;
}

export const useRightMenuNavigationStore = create<RightMenuNavigationStore>(
  (set, get) => ({
    propertiesSection: "default",
    setPropertiesSection: (section: PropertiesSection) =>
      set({ propertiesSection: section }),
    associationSection: "default",
    setAssociationSection: (section: AssociationSection) =>
      set({ associationSection: section }),

    middleSection: "default",
    setMiddleSection: (section: MiddleSection) =>
      set(() => ({ middleSection: section })),

    selectedPhotoPropertyId: undefined,
    setSelectedPhotoPropertyId: (id: string | undefined) =>
      set(() => ({ selectedPhotoPropertyId: id })),

    domainPropertyId: undefined,
    setDomainPropertyId: (id: string | undefined) =>
      set(() => ({ domainPropertyId: id })),

    accountEmailPropertyId: undefined,
    setAccountEmailPropertyId: (id: string | undefined) =>
      set(() => ({ accountEmailPropertyId: id })),

    profileUrlPropertyId: undefined,
    setProfileUrlPropertyId: (id: string | undefined) =>
      set(() => ({ profileUrlPropertyId: id })),

    contactEmailPropertyId: undefined,
    setContactEmailPropertyId: (id: string | undefined) =>
      set(() => ({ contactEmailPropertyId: id })),

    fullHeightSection: undefined,
    setFullHeightSection: (section: string | undefined) =>
      set(() => ({ fullHeightSection: section })),
    isSectionFullHeight: (section: string) =>
      section === get().fullHeightSection,
    rightMenuSavedScrollTop: null,
    setRightMenuSavedScrollTop: (scrollTop: number | null) =>
      set(() => ({ rightMenuSavedScrollTop: scrollTop })),

    contactEmailsModalPropertyId: null,
    setContactEmailsModalPropertyId: (propertyId: string | null) =>
      set(() => ({ contactEmailsModalPropertyId: propertyId })),

    employeeCountModalPropertyId: null,
    setEmployeeCountModalPropertyId: (propertyId: string | null) =>
      set(() => ({ employeeCountModalPropertyId: propertyId })),

    // Tooltip state for mailbox hover/click
    tooltipOpenPropertyId: null,
    tooltipOpenReason: null,
    openTooltip: (propertyId: string, reason: "click" | "hover") =>
      set((state) => {
        // Don't override click with hover
        if (state.tooltipOpenReason === "click" && reason === "hover") {
          return state;
        }
        return { tooltipOpenPropertyId: propertyId, tooltipOpenReason: reason };
      }),
    closeTooltip: (reason?: "click" | "hover") =>
      set((state) => {
        // If reason is specified, only close if it matches
        if (reason && state.tooltipOpenReason !== reason) {
          return state;
        }
        return { tooltipOpenPropertyId: null, tooltipOpenReason: null };
      }),
  })
);
