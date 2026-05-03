import Link, { LinkOptions } from "@tiptap/extension-link";
import {
  Editor,
  BubbleMenu as BubbleMenuComp,
  getAttributes,
} from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { MarkType } from "@tiptap/pm/model";
import { Cross } from "~/icons/ui/Cross";
import { Button } from "~/components/UI/Buttons/Button";

export const LinkBubble = ({
  editor,
  onEdit,
  enabled = true,
  onHideLinkTooltip,
}: {
  editor: Editor;
  onEdit: () => any;
  onHideLinkTooltip: () => any;
  enabled: boolean;
}) => {
  const { state } = editor;

  return (
    <BubbleMenuComp
      className={[
        "p-5 min-w-[400px] text-sm bg-b1-black shadow rounded bubble-menu relative",
        !enabled ? "hidden" : "",
      ].join(" ")}
      tippyOptions={{ duration: 0, arrow: true, zIndex: 20 }}
      editor={editor}
      shouldShow={({ editor }) => {
        return (
          editor.isActive("link") &&
          editor.state.selection.from < editor.state.selection.to // Work around, will not work when user use arrow to move
        );
      }}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="text-display-14 font-semibold">
          {state.doc.textBetween(state.selection.from, state.selection.to, "")}
        </div>
        <Cross className="w-3 h-3 cursor-pointer" onClick={onHideLinkTooltip} />
      </div>

      <div>
        <a
          className="text-strong-green text-display-14 hover:underline"
          href={editor.getAttributes("link").href}
          target="_blank" rel="noreferrer"
        >
          {editor.getAttributes("link").href}
        </a>
      </div>
      <div className="flex justify-end mt-3 gap-2">
        <Button
          onClick={() => {
            onEdit();
          }}
          variant="secondary"
        >
          Edit
        </Button>

        <Button
          onClick={() => {
            editor.commands.unsetLink();
          }}
          variant="danger"
        >
          Remove
        </Button>

        {/* <button
          className="px-[10px] py-[2px] mr-2 text-xs font-semibold border-2 rounded-full border-sky-600"
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
        >
          Edit
        </button>
        <button
          className="px-[10px] py-[2px] font-semibold border-solid border rounded-full border-[#00a1de] text-xs"
          onClick={(e) => {
            e.preventDefault();
            editor.commands.unsetLink();
          }}
        >
          Remove
        </button> */}
      </div>
    </BubbleMenuComp>
  );
};

type OurLinkOption = LinkOptions & {
  onClick: (href: string, target: string) => any;
};

type ClickHandlerOptions = {
  type: MarkType;
  onClick: (href: string, target: string) => any;
};

export function clickHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey("handleClickLinkAction"),
    props: {
      handleClickOn: (view, pos, node, nodePos, event) => {
        const attrs = getAttributes(view.state, options.type.name);
        const link = (event.target as HTMLElement)?.closest("a");

        const href = link?.href ?? attrs.href;
        const target = link?.target ?? attrs.target;

        options.onClick(href, target);
        // return true;
      },
    },
  });
}

export const OurLink = Link.extend<OurLinkOption>({
  addProseMirrorPlugins() {
    const plugins: Plugin[] = [];

    plugins.push(
      clickHandler({
        type: this.type,
        onClick: (...ags) => {
          this.editor.commands.extendMarkRange("link");
        },
      })
    );

    return plugins;
  },
});
