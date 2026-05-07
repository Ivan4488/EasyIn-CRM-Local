import { create } from "zustand";

interface WatchAndUpdateStore {
  togglesMapConversation: Record<string, boolean>;
  togglesMapProperties: Record<string, boolean>;
  toggleConversation: (key: string) => void;
  toggleProperties: (key: string) => void;

  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

export const settingsListConversation = [
  {
    title: "Contact & Team",
    subtitle: "Allow conversation data between contact and team",
  },
  {
    title: "Contact & You",
    subtitle: "Include conversation data between contact and you",
  },
];

export const settingsListProperties = [
  { title: "Email 1" },
  { title: "Email 2" },
  { title: "Phone number" },
  { title: "Job title" },
  { title: "Company association" },
];

export const useWatchAndUpdateSectionStore = create<WatchAndUpdateStore>((set) => ({
  togglesMapConversation: settingsListConversation.reduce((acc, item) => {
    acc[item.title] = true;
    return acc;
  }, {} as Record<string, boolean>),
  togglesMapProperties: settingsListProperties.reduce((acc, item) => {
    acc[item.title] = true;
    return acc;
  }, {} as Record<string, boolean>),
  toggleConversation: (key: string) =>
    set((state) => ({
      togglesMapConversation: {
        ...state.togglesMapConversation,
        [key]: !state.togglesMapConversation[key],
      },
    })),
  toggleProperties: (key: string) =>
    set((state) => ({
      togglesMapProperties: {
        ...state.togglesMapProperties,
        [key]: !state.togglesMapProperties[key],
      },
    })),

  isActive: false,
  setIsActive: (isActive: boolean) => set(() => ({ isActive })),
}));
