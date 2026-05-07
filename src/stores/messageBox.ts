import { Editor } from "@tiptap/core";
import { create } from "zustand";

export interface ActionItemData {
  id: string;
  text: string;
  isSubjectDisabled: boolean;
  isDisabled?: boolean;
  disabledText?: string;
  isReply?: boolean;
  editorType?: EditorType;
}

export type EditorType = "linkedin" | undefined;

export type MessageSender = {
  id: string;
  name: string;
  url: string;
}

interface MessageBoxStore {
  editor: Editor | null;
  isExpanded: boolean;
  isFocused: boolean;
  content: string;
  textContent: string;
  setEditor: (editor: Editor) => void;
  setTextContent: (textContent: string) => void;
  setContent: (content: string) => void;
  setSubject: (subject: string) => void;
  subject: string;
  sender?: MessageSender;
  activeActionItem: ActionItemData | null;
  secondaryActionItem: ActionItemData | null;
  setSecondaryActionItem: (secondaryActionItem: ActionItemData | null) => void;
  setActiveActionItem: (activeActionItem: ActionItemData | null) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsFocused: (isFocused: boolean) => void;
  setSender: (sender: MessageSender) => void;
}

export const useMessageBoxStore = create<MessageBoxStore>((set, get) => ({
  editor: null,
  isExpanded: false,
  isFocused: false,
  content: "",
  textContent: "",
  subject: "",
  setEditor: (editor: Editor) => set(() => ({ editor })),
  setSender: (sender: MessageSender) => set(() => ({ sender })),
  setContent: (content: string) => set(() => ({ content })),
  setTextContent: (textContent: string) => set(() => ({ textContent })),
  setSubject: (subject: string) => set(() => ({ subject })),
  setIsExpanded: (isExpanded: boolean) => set(() => ({ isExpanded })),
  setIsFocused: (isFocused: boolean) => set(() => ({ isFocused })),
  activeActionItem: { text: "Email", id: "email", isSubjectDisabled: false },
  secondaryActionItem: { text: "New", id: "new", isSubjectDisabled: false },
  setActiveActionItem: (activeActionItem) => set(() => ({ activeActionItem })),
  setSecondaryActionItem: (secondaryActionItem) =>
    set(() => ({ secondaryActionItem })),
}));
