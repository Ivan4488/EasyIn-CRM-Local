import { create } from "zustand";
import { RecordType } from "~/service/types";

export interface SelectedRecord {
  id: string;
  type: RecordType;
}
export type SelectorKey = "default" | "recordList" | "propertiesEdit" | "properties" | "accounts" | "team" | "duplicateList" | "companyDuplicateList";


interface SelectorStore {
  selectedItems: Record<SelectorKey, SelectedRecord[]>;
  selectItem: (item: SelectedRecord, key?: SelectorKey) => void;
  deselectItem: (item: SelectedRecord, key?: SelectorKey) => void;
  clearSelection: (key?: SelectorKey) => void;
  isSelected: (item: SelectedRecord, key?: SelectorKey) => boolean;
  selectMultiple: (items: SelectedRecord[], key?: SelectorKey) => void;
  deselectMultiple: (items: SelectedRecord[], key?: SelectorKey) => void;
  isSelectAll: { [key in SelectorKey]: boolean };
  setIsSelectAll: (value: boolean, key?: SelectorKey) => void;
}


const defaultKey = "default";
const keys: SelectorKey[] = ["default", "recordList", "propertiesEdit", "properties", "accounts", "team", "duplicateList", "companyDuplicateList"];
export const useSelectorStore = create<SelectorStore>((set, get) => ({
  isSelectAll: keys.reduce<Record<SelectorKey, boolean>>((acc, key) => ({ ...acc, [key]: false }), {} as Record<SelectorKey, boolean>),
  setIsSelectAll: (value, key = defaultKey) => set(() => ({ isSelectAll: { ...get().isSelectAll, [key]: value } })),
  selectedItems: keys.reduce<Record<SelectorKey, SelectedRecord[]>>((acc, key) => ({ ...acc, [key]: [] }), {} as Record<SelectorKey, SelectedRecord[]>),
  selectItem: (item: SelectedRecord, key = defaultKey) => {
    const selectedItems = get().selectedItems;
    const selectedItemsForKey = selectedItems[key];
    if (!selectedItemsForKey) {
      return;
    }

    set((state) => ({
      selectedItems: {
        ...state.selectedItems,
        [key]: [...selectedItemsForKey, item].filter(
          (i, index, self) => self.findIndex((s) => s.id === i.id) === index
        ),
      },
    }))},
  deselectItem: (item: SelectedRecord, key = defaultKey) => {
    const selectedItems = get().selectedItems;
    const selectedItemsForKey = selectedItems[key];
    if (!selectedItemsForKey) {
      return;
    }

    set((state) => ({
      selectedItems: {
        ...state.selectedItems,
        [key]: selectedItemsForKey.filter((i) => i.id !== item.id),
      },
    }))
  },
  clearSelection: (key = defaultKey) => set(() => ({ selectedItems: { ...get().selectedItems, [key]: [] }, isSelectAll: { ...get().isSelectAll, [key]: false } })),
  isSelected: (item: SelectedRecord, key = defaultKey) =>
    get().selectedItems[key]?.find((i) => i.id === item.id) !== undefined,
  selectMultiple: (items: SelectedRecord[], key = defaultKey) => {
    const selectedItems = get().selectedItems;
    const selectedItemsForKey = selectedItems[key];
    if (!selectedItemsForKey) {
      return;
    }

    set((state) => ({
      selectedItems: {
        ...state.selectedItems,
        [key]: [...selectedItemsForKey, ...items].filter(
          (item, index, self) => self.findIndex((i) => i.id === item.id) === index
        ),
      },
    }))},
  deselectMultiple: (items: SelectedRecord[], key = defaultKey) => {
    const selectedItems = get().selectedItems;
    const selectedItemsForKey = selectedItems[key];
    if (!selectedItemsForKey) {
      return;
    }

    set((state) => ({
      selectedItems: {
        ...state.selectedItems,
        [key]: selectedItemsForKey.filter(
          (item) => !items.find((i) => i.id === item.id)
        ),
      },
    }))},
}));
