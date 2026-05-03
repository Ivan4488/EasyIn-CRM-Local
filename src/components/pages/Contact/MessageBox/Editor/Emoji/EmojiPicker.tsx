import { Editor } from "@tiptap/react";
import { Tooltip } from "react-tippy";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { MenuButton } from "../MenuButton";
import { Emoji } from "~/icons/editorMenu/Emoji";

interface EmojiPickerProps {
  editor: Editor;
}

export const EmojiPicker = ({ editor }: EmojiPickerProps) => {
  return (
    <Tooltip
      position="bottom"
      trigger="click"
      // @ts-ignore
      theme="emoji"
      html={
        <>
          <Picker
            data={data}
            categories={["frequent", "people", "activity"]}
            onEmojiSelect={(emoji: any) => {
              editor.commands.insertContent(emoji?.native || emoji.fallback);
            }}
            emojiSize={20}
            theme="dark"
          />
        </>
      }
      interactive={true}
    >
      <MenuButton id="emoji-btn" Icon={Emoji} />
    </Tooltip>
  );
};
