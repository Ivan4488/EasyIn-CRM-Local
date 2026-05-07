import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMessageBoxStore, EditorType } from "~/stores/messageBox";
import { MenuButton } from "./MenuButton";
import { Bold } from "~/icons/editorMenu/Bold";
import { Italic } from "~/icons/editorMenu/Italic";
import { Strike } from "~/icons/editorMenu/Strike";
import { OrderedList as OrderedListIcon } from "~/icons/editorMenu/OrderedList";
import { SendButton } from "~/components/UI/Buttons/SendButton";
import { Underline as UnderlineIcon } from "~/icons/editorMenu/Underline";
import Underline from "@tiptap/extension-underline";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Document from "@tiptap/extension-document";
import TextAlign from "@tiptap/extension-text-align";
import { AlignLeft } from "~/icons/editorMenu/AlignLeft";
import { AlignCenter } from "~/icons/editorMenu/AlignCenter";
import Paragraph from "@tiptap/extension-paragraph";
import { useClickAway } from "ahooks";
import classNames from "classnames";
import styles from "./Editor.module.scss";
import { LinkIcon } from "~/icons/editorMenu/Link";
import { LinkBubble, OurLink } from "./Link/LinkBubble";
import { LinkModal } from "./Link/LinkModal";
import {
  getSupabaseImg,
  supabaseInstance,
  uploadSupabaseImg,
} from "~/service/supabase";
import { ImageIcon } from "~/icons/editorMenu/ImageIcon";
import { EmojiPicker } from "./Emoji/EmojiPicker";
import { MentionButton } from "./Mentions/MentionButton";
import { CustomMention, suggestion } from "./Mentions/MentionList";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Dots } from "~/icons/ui/Dots";
import { Popover, PopoverTrigger, PopoverContent } from "~/components/UI/Popover/Popover";

interface MenuBarProps {
  onSend: () => void;
  trackCursor: React.MutableRefObject<number>;
  simple?: boolean;
}

const MenuBar = ({ onSend, trackCursor, simple }: MenuBarProps) => {
  const { editor } = useCurrentEditor();
  const messageBoxStore = useMessageBoxStore();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkObj, setLinkObj] = useState({ text: "", url: "" });

  useEffect(() => {
    const unsubscribe = useMessageBoxStore.subscribe(() => {
      if (useMessageBoxStore.getState().content === "") {
        editor?.commands.setContent(useMessageBoxStore.getState().content);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (editor?.isFocused) {
      messageBoxStore.setIsExpanded(true);
      messageBoxStore.setIsFocused(true);
    }
  }, [editor?.isFocused]);

  useEffect(() => {
    editor?.on("update", () => {
      messageBoxStore.setContent(editor.getHTML());
      messageBoxStore.setTextContent(editor.getText({ blockSeparator: '\n' }));
    });
  }, [editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;

    setShowLinkModal(false);

    const selection = editor.view.state.selection;
    const isAtEnd = true;
    const linkContent = linkObj.text || linkObj.url;

    editor.commands.insertContentAt(
      {
        from: selection.from,
        to: selection.to,
      },
      `<a href="${
        linkObj.url.startsWith("http") ? linkObj.url : `https://${linkObj.url}`
      }" target="_blank" rel="noreferrer">${linkContent}</a>${
        isAtEnd ? " " : ""
      }`
    );

    editor
      .chain()
      .focus(isAtEnd ? "end" : selection.from + linkContent.length)
      .run();
    setLinkObj({ text: "", url: "" });
  }, [editor, linkObj]);

  const handleEditLink = useCallback(() => {
    if (!editor) return;

    const { from, to, empty } = editor.state.selection;
    const textSelect = editor.state.doc.textBetween(from, to, " ");
    const previousUrl = editor.getAttributes("link").href;
    setLinkObj({ text: textSelect, url: previousUrl });
    setShowLinkModal(true);
  }, [editor]);

  const onHideLinkTooltip = useCallback(() => {
    if (!editor) return;

    editor.chain().focus().setTextSelection(trackCursor.current).run();
  }, []);

  const { toast } = useToast();

  if (!editor) {
    return null;
  }

  const handleUploadFileToStorage = async (e: any) => {
    const file = e.target.files[0];
    // Reset the value
    e.target.value = "";
    if (file) {
      // Load image from file
      await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = document.createElement("img");
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      const blob = file;

      // Upload file
      // TODO: CHANGE FOR PRIVATE BUCKET
      const { data, error } = await uploadSupabaseImg({ file });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        console.error(error);
      }

      if (data && data.path) {
        editor
          .chain()
          .focus()
          .setImage({
            src: getSupabaseImg({ img: data.path }),
          })
          .run();
      }
    } else {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <LinkModal
        showLinkModal={showLinkModal}
        setShowLinkModal={setShowLinkModal}
        linkObj={linkObj}
        setLinkObj={setLinkObj}
        handleSetLink={handleSetLink}
      />

      <LinkBubble
        editor={editor}
        onEdit={handleEditLink}
        enabled={true}
        onHideLinkTooltip={onHideLinkTooltip}
      />

      <div className={classNames("flex flex-row w-full justify-between pr-[24px]", "mt-[15px]")}>
        <div className="flex flex-row">
          <MenuButton
            Icon={Bold}
            isActive={editor.isActive("bold")}
            isDisabled={simple}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <MenuButton
            Icon={Italic}
            isActive={editor.isActive("italic")}
            isDisabled={simple}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <MenuButton
            Icon={UnderlineIcon}
            isActive={editor.isActive("underline")}
            isDisabled={simple}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <MenuButton
            Icon={Strike}
            isActive={editor.isActive("strike")}
            isDisabled={simple}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <input
            type="file"
            accept="image/*"
            name="image"
            id="input-file"
            className="hidden"
            onChange={handleUploadFileToStorage}
            disabled={simple}
          />

          <div className="flex flex-row max-[1200px]:hidden">
            <div className="h-[24px] w-[1px] bg-gray-moderate mx-[16px] mt-[2px]"></div>
            <MenuButton
              Icon={OrderedListIcon}
              isActive={editor.isActive("orderedList")}
              isDisabled={simple}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <MenuButton
              Icon={AlignLeft}
              isActive={editor.isActive({ textAlign: "left" })}
              isDisabled={simple}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            />
            <MenuButton
              Icon={AlignCenter}
              isActive={editor.isActive({ textAlign: "center" })}
              isDisabled={simple}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            />
            <div className="h-[24px] w-[1px] bg-gray-moderate mx-[16px] mt-[2px]"></div>
            <MenuButton
              Icon={LinkIcon}
              isActive={editor.isActive("heading")}
              isDisabled={simple}
              onClick={handleEditLink}
            />

            <button
              type="button"
              disabled={simple}
              className="w-[28px] h-[28px] rounded-[4px] flex items-center justify-center group hover:bg-hover-1 disabled:text-text-disabled disabled:opacity-30"
            >
              <label htmlFor="input-file" className="cursor-pointer group-disabled:cursor-default">
                <ImageIcon />
              </label>
            </button>

            <EmojiPicker editor={editor} />

            <MentionButton
              isDisabled={simple}
              editor={editor}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hidden max-[1200px]:flex w-[28px] h-[28px] rounded-[4px] items-center justify-center hover:bg-hover-1 text-text-weak"
              >
                <Dots className="w-[12px] rotate-90 h-full" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-auto p-[4px] flex flex-row">
              <MenuButton
                Icon={OrderedListIcon}
                isActive={editor.isActive("orderedList")}
                isDisabled={simple}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
              <MenuButton
                Icon={AlignLeft}
                isActive={editor.isActive({ textAlign: "left" })}
                isDisabled={simple}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
              />
              <MenuButton
                Icon={AlignCenter}
                isActive={editor.isActive({ textAlign: "center" })}
                isDisabled={simple}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
              />
              <MenuButton
                Icon={LinkIcon}
                isActive={editor.isActive("heading")}
                isDisabled={simple}
                onClick={handleEditLink}
              />
              <button
                type="button"
                disabled={simple}
                className="w-[28px] h-[28px] rounded-[4px] flex items-center justify-center group hover:bg-hover-1 disabled:text-text-disabled disabled:opacity-30"
                onClick={() => document.getElementById("input-file")?.click()}
              >
                <ImageIcon />
              </button>
              <EmojiPicker editor={editor} />
              <MentionButton
                isDisabled={simple}
                editor={editor}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <SendButton
            onClick={onSend}
            disabled={messageBoxStore.content === ""}
          >
            Send
          </SendButton>
        </div>
      </div>
    </>
  );
};

const userOptions = [
  {
    id: "1",
    label: "John Doe",
    value: "John",
    rank: 1,
  },
  {
    id: "2",
    label: "Jane Doe",
    value: "Jane",
    rank: 2,
  },
];

const searchUsers = async (query: string) => {
  return [];
};

const extensions = [
  Document,
  Paragraph,
  StarterKit,
  Placeholder.configure({
    placeholder: "",
  }),
  Underline,
  OrderedList.configure({
    keepMarks: true,
    keepAttributes: true,
  }),
  ListItem,
  TextAlign.configure({
    alignments: ["left", "center"],
    types: ["heading", "paragraph"],
  }),
  OurLink.configure({
    openOnClick: false,
  }),
  Image.configure({
    inline: true,
    HTMLAttributes: {

    },
  }),
  CustomMention.configure({
    HTMLAttributes: {
      class: "mention",
    },
    renderLabel({ options, node }) {
      return "@" + (node?.attrs?.label || node?.attrs?.id?.label || "");
    },
    suggestion: suggestion(userOptions, searchUsers),
  }),
];

interface EditorProps {
  onSend: () => void;
  type?: EditorType;
}

export const Editor = ({ onSend, type }: EditorProps) => {
  const messageBoxStore = useMessageBoxStore();
  const ref = React.useRef<HTMLDivElement>(null);
  const trackCursor = useRef(0);
  const simple = type === "linkedin";

  useClickAway(() => {
    messageBoxStore.setIsFocused(false);
  }, ref);

  useEffect(() => {
    if (simple) {
      // clear all formatting
      const pos = messageBoxStore.editor?.state.selection.from || 0;
      messageBoxStore.editor?.chain().selectAll().unsetAllMarks().clearNodes().setTextSelection(pos).run();
    }
  }, [messageBoxStore.editor, simple]);

  return (
    <div className={classNames(styles.editor, "relative")} ref={ref}>
      <EditorProvider
        slotAfter={<MenuBar onSend={onSend} trackCursor={trackCursor} simple={simple}/>}
        extensions={extensions}
        onTransaction={({ editor }) => {
          const cursorLine = editor.view.state.selection;
          if (cursorLine.from === cursorLine.to) {
            trackCursor.current = cursorLine.from;
          }
        }}
        onCreate={({ editor }) => {
          messageBoxStore.setEditor(editor);
        }}
        content={messageBoxStore.content}
        editorProps={{
          attributes: {
            class: "focus:outline-none min-h-[40px] max-h-[198px] overflow-y-auto",
          },
        }}
      >
        <></>
      </EditorProvider>
    </div>
  );
};
