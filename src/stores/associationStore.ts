import { create } from "zustand"

export interface AssociationItem {
  id: string;
  name: string;
  order: number;
}

interface AssociationStore {
  associatedItems: AssociationItem[];
  setAssociatedItems: (items: AssociationItem[]) => void;
  addAssociatedItem: (item: AssociationItem) => void;
  removeAssociatedItem: (id: string) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAssociationStore = create<AssociationStore>((set) => ({
  associatedItems: [],
  setAssociatedItems: (items: AssociationItem[]) => set({ associatedItems: items }),
  addAssociatedItem: (item: AssociationItem) => set((state) => ({ associatedItems: [...state.associatedItems, item] })),
  removeAssociatedItem: (id: string) => set((state) => ({ associatedItems: state.associatedItems.filter((i) => i.id !== id) })),

  isLoading: true,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));