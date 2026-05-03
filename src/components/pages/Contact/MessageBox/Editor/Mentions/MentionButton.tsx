import { Editor } from "@tiptap/react";
import { forwardRef, useRef, useState } from "react";
import { MenuButton } from "../MenuButton";
import { Mention } from "~/icons/editorMenu/Mention";

interface MentionButtonProps {
  editor: Editor;
  isDisabled?: boolean;
}

export const MentionButton = forwardRef((props: MentionButtonProps, ref) => {
  const isMentionOpen = useRef(0);

  const popup = (window as any).mentionPopup?.popup;
  const editor = props.editor;
  const state = editor.state.selection.anchor;
  const lastCharactor = editor.state.doc.textBetween(state - 1, state);

  const [mentionStateActive, setMentionState] = useState(false);

  return (
    <MenuButton
      Icon={Mention}
      isDisabled={props.isDisabled}
      onClick={(e) => {
        if (lastCharactor === "@" && popup) {
          // console.log(window.mentionPopup?.popup.state);
          isMentionOpen.current = isMentionOpen.current + 1;
          if (isMentionOpen.current % 2 === 1) {
            setMentionState(false);
            popup?.hide();
          } else {
            setMentionState(true);
            popup?.show();
          }
          return;
        }

        setMentionState(true);
        isMentionOpen.current = 0;
        editor.commands.insertContent(" @");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.stopPropagation();
          e.preventDefault();
          if (lastCharactor === "@" && popup?.popup) {
            console.log(popup?.state);
            isMentionOpen.current = isMentionOpen.current + 1;
            if (isMentionOpen.current % 2 === 1) {
              setMentionState(false);
              popup?.popup?.hide();
            } else {
              setMentionState(true);
              popup?.popup?.show();
            }
            return;
          }

          isMentionOpen.current = 0;
          setMentionState(true);
          editor.commands.insertContent(" @");
        }
      }}
    />
  );
});

MentionButton.displayName = "EditorMentionButton";
