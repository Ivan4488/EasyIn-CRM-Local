import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import Mention from "@tiptap/extension-mention";
import { UserData } from "~/service/types"
import { ReactRenderer } from "@tiptap/react"
import tippy from "tippy.js";


// eslint-disable-next-line react/display-name
export const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (!props.items.length) {
    return null;
  }

  return (
    <div className="flex flex-col py-2 text-xs text-b1-black bg-white rounded">
      {props.items.map((item: any, index: any) => (
        <button
          className={`px-3 py-1 hover:bg-text-weak00 text-[13px] ${
            index === selectedIndex ? " !bg-gray-moderate !text-white" : ""
          }`}
          key={item.value}
          onClick={() => selectItem(index)}
        >
          {item.value === "all" ? (
            <span>
              All -{" "}
              <span
                className={
                  index === selectedIndex
                    ? " !bg-gray-moderate !text-white"
                    : "text-black"
                }
              >
                Notify all Upvoters
              </span>
            </span>
          ) : item.value === "creator" ? (
            <span>
              Creator -{" "}
              <span
                className={
                  index === selectedIndex
                    ? " !bg-gray-moderate !text-white"
                    : "text-black"
                }
              >
                Notify the creator
              </span>
            </span>
          ) : (
            item.label
          )}
        </button>
      ))}
    </div>
  );
});

export const CustomMention = Mention.extend({
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id?.value) {
            return {};
          }

          return {
            "data-id": attributes.id?.value,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => {
          if (!attributes.id?.label) {
            return {};
          }

          return {
            "data-label": attributes.id.label,
          };
        },
      },
    };
  },
});

export const suggestion = (
  options: IUserOption[],
  searchUsers: (query: string) => Promise<UserData[]>
) => ({
  allowSpaces: true,
  items: async ({ query }: any) => {
    const searchedUsers = await searchUsers(query);
    const searchOptions = searchedUsers.map((user) => ({
      value: user.id,
      label: user.name,
      rank: 1,
    }));

    const allOptions = [...options, ...(searchOptions || [])];


    return allOptions
      .filter((item) =>
        item.label.toLowerCase().startsWith(query.toLowerCase())
      )
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 10);
  },

  render: () => {
    let reactRenderer: any;
    let popup: any;

    return {
      onStart: (props: any) => {
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });

        // @ts-ignore
        window.mentionPopup = {
          popup: popup?.[0],
          reactRenderer,
        };
      },

      onUpdate(props: any) {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup?.[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        popup?.[0].destroy();
        reactRenderer.destroy();
      },
    };
  },
});

interface IUserOption {
  value: string;
  label: string;
  rank: number;
}