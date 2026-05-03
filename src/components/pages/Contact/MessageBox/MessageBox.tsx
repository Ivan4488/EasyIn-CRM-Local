import { AnimatePresence } from "framer-motion";
import { Collapsable } from "~/components/UI/Collapsable/Collapsable";
import { Header } from "./Header";
import classNames from "classnames";
import { useMessageBoxStore } from "~/stores/messageBox";
import { useEffect, useRef } from "react";
import { Editor } from "./Editor/Editor";
import { useRouter } from "next/router";
import { useIsSenderEmailSet } from "./useIsSenderEmailSet";
import { useSendMessageMutation } from "./useSendEmailMutation";

export const MessageBox = () => {
  const messageBoxStore = useMessageBoxStore();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { id } = router.query;
  useIsSenderEmailSet();

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const container = ref.current;
      if (!container) return;
      const target = event.target as HTMLElement;
      if (!container.contains(target) && !target.closest("[data-radix-popper-content-wrapper]")) {
        messageBoxStore.setIsExpanded(false);
        messageBoxStore.setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [messageBoxStore]);

  const actionItem = messageBoxStore.activeActionItem;
  const secondaryActionItem = messageBoxStore.secondaryActionItem;

  const textContent = messageBoxStore.textContent;
  const content = messageBoxStore.content;
  const subject = messageBoxStore.subject;

  const platform = [actionItem?.id, secondaryActionItem?.id]
    .filter(Boolean)
    .join("-") as string;

  const senderId = messageBoxStore.sender?.id;

  const mutation = useSendMessageMutation();

  const onSend = () => {
    if (messageBoxStore.textContent.trim() === "") {
      return;
    }

    mutation.mutate({
      html: content,
      text: textContent,
      subject: subject,
      platform: platform,
      contact_id: id as string,
      sender_id: senderId,
    });
    messageBoxStore.setTextContent("");
    messageBoxStore.setContent("");
    messageBoxStore.setSubject("");
  };

  return (
    <div className="w-full flex flex-col" ref={ref}>
      <AnimatePresence mode="wait">
        {messageBoxStore.isExpanded && (
          <Collapsable key="top-message-box">
            <Header />
          </Collapsable>
        )}
      </AnimatePresence>

      <div
        onClick={() => {
          messageBoxStore.setIsExpanded(true);
        }}
        className={classNames(
          "min-h-[40px] cursor-text bg-message-box border-solid border-t-gray-moderate border-t pt-[16px] pb-[16px] pl-[24px] hover:bg-b1-black transition-height",
          messageBoxStore.isFocused && "border-t-strong-green"
        )}
      >
        <Editor onSend={onSend} type={actionItem?.editorType}/>
      </div>
    </div>
  );
};
