import { create } from "zustand";
import { DateRange } from "react-day-picker";
import { MenuItemId } from "~/components/UI/SideMenu/MenuItem";

interface LeftMenuStore {
  activeItems: MenuItemId[];
  activeSections: string[];
  dateRange: DateRange | undefined;
  setActiveItems: (items: MenuItemId[]) => void;
  setActiveSections: (items: string[]) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  activateItem: (id: MenuItemId, isMultiSelectable?: boolean) => void;
  deactivateItem: (id: MenuItemId) => void;
  activateSection: (id: string) => void;
  deactivateSection: (id: string) => void;
  isItemActive: (id: MenuItemId) => boolean;
  isSectionActive: (id: string) => boolean;
  clearMenu: () => void;
  toggleSection: (id: string, active?: boolean) => void;
  selectedDuplicateReviewId: string | null;
  setSelectedDuplicateReviewId: (id: string | null) => void;
  selectedCompanyDuplicateReviewId: string | null;
  setSelectedCompanyDuplicateReviewId: (id: string | null) => void;
}

export const useLeftMenuStore = create<LeftMenuStore>((set, get) => ({
  activeItems: [] as MenuItemId[],
  activeSections: [],
  dateRange: undefined,
  selectedDuplicateReviewId: null,
  setSelectedDuplicateReviewId: (id) => set(() => ({ selectedDuplicateReviewId: id })),
  selectedCompanyDuplicateReviewId: null,
  setSelectedCompanyDuplicateReviewId: (id) =>
    set(() => ({ selectedCompanyDuplicateReviewId: id })),
  setDateRange: (dateRange: DateRange | undefined) => set(() => ({ dateRange })),
  setActiveItems: (items: MenuItemId[]) => set(() => ({ activeItems: [...items] })),
  clearMenu: () => set(() => ({ activeItems: [], activeSections: [], dateRange: undefined })),
  setActiveSections: (items: string[]) =>
    set(() => ({ activeSections: [...items] })),
  activateSection: (id: string) =>
    set((state) => {
      if (state.activeSections.includes(id)) {
        return state;
      }

      return { activeSections: [...state.activeSections, id] };
    }),
  deactivateSection: (id: string) =>
    set((state) => ({
      activeSections: state.activeSections.filter((section) => section !== id),
    })),
  activateItem: (id: MenuItemId, isMultiSelectable?: boolean) =>
    set(() => {
      if (!isMultiSelectable) {
        return { activeItems: [id] };
      }

      return { activeItems: [...get().activeItems, id] };
    }),
  deactivateItem: (id: MenuItemId) =>
    set((state) => {
      if (!state.activeItems.includes(id)) {
        return state;
      }
      return {
        activeItems: state.activeItems.filter((item) => item !== id),
        // Clear selected review when exiting duplicates mode
        ...(id === "duplicates/main" ? { selectedDuplicateReviewId: null } : {}),
        ...(id === "company-duplicates/main"
          ? { selectedCompanyDuplicateReviewId: null }
          : {}),
      };
    }),
  isSectionActive: (id: string) => {
    const state = get(); // Directly get the current state
    return state.activeSections.includes(id);
  },
  isItemActive: (id: MenuItemId) => {
    const state = get(); // Directly get the current state
    return state.activeItems.includes(id);
  },
  toggleSection: (id: string, active?: boolean) =>
    set((state) => {
      if (state.activeSections.includes(id) && active !== true || active === false) {
        return { activeSections: state.activeSections.filter((section) => section !== id) };
      }

      return { activeSections: [...state.activeSections, id] };
    }),
}));

export enum LeftMenuUrlParams {
  ActiveItems = "activeMenuItems",
  ActiveSections = "activeSections",
}
