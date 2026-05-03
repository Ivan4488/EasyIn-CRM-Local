import classNames from "classnames";
import { LinkedIn } from "~/icons/records/LinkedIn";
import { MessageData } from "~/service/types";
import { getSupabaseImg } from "~/service/supabase";

import styles from "./Message.module.scss";
import { getContactName } from "~/lib/utils/getContactName";
import { useMessageBoxStore } from "~/stores/messageBox";
import { actionItems, secondaryItems } from "../MessageBox/Header";
import { Avatar } from "~/components/UI/Avatar/Avatar";
import { Email } from "~/icons/records/Email";
import { Notes } from "~/icons/records/Notes";
import { useMemo } from "react";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";
type MessageProps = MessageData;

const getPlatform = (platform: string) => {
  if (platform.includes("linkedin")) {
    return "LinkedIn";
  }

  if (platform.includes("email")) {
    return "Email";
  }

  const firstLetter = platform[0]?.toUpperCase();

  return firstLetter + platform.slice(1);
};

const getIconByPlatform = (platform: string) => {
  if (platform.includes("linkedin")) {
    return <LinkedIn />;
  }

  if (platform.includes("note")) {
    return <Notes className="w-[16px] h-[16px]"/>;
  }

  return <Email />;
};

export const Message = ({
  id,
  text,
  subject,
  platform,
  created_at,
  sender,
  sender_name,
  Contact,
  User,
}: MessageProps) => {
  const fromName = sender_name || (sender === "user" ? User.name : getContactName(Contact));

  const avatarUrl = sender === "contact" ? Contact.avatar : undefined;
  const img = useMemo(() => {
    if (!avatarUrl) {
      return undefined;
    }

    return getAccountImgUrl(avatarUrl);
  }, [avatarUrl]);

  const sentDate = new Date(created_at).toLocaleDateString("en-US", {
    day: "numeric", // Numeric day of the month
    month: "long", // Full month name
  });

  const messageBoxStore = useMessageBoxStore();

  const isNote = platform.includes("note");
  text = text.replace(/\n/g, '<br>');

  return (
    <div
      data-msg-id={id}
      className={classNames(
        "rounded-[12px] border border-solid",
        styles.messageContainer,
        sender === "user" && !isNote && styles.outboundMessage,
        isNote && styles.noteMessage,
      )}
    >
      <div className="flex flex-col ">
        {subject && (
          <div>
            <div className="flex flex-col px-[24px] py-[4px] h-[40px] justify-center">
              <p className="text-display-14 text-text-strong font-bold">
                {subject}
              </p>
            </div>

            <hr className="border-t border-solid border-[#55637F]/40" />
          </div>
        )}

        {/* Message Content */}
        <div className="flex flex-col p-[24px]">
          <p
            className={classNames(
              "text-display-16 text-text-strong",
              styles.message
            )}
            dangerouslySetInnerHTML={{ __html: text }}
          ></p>
        </div>

        <hr className="border-t border-solid border-[#55637F]/40" />
        {/* Footer with message metadata */}
        <div
          onClick={() => {
            const basePlatform = platform.split('-')[0] || "";
            const actionItem = actionItems.find(ai => ai.id === basePlatform) || null;
            const secondaryActionItem =
              secondaryItems[basePlatform]?.find(item => item.isReply) ||
              secondaryItems[basePlatform]?.[0] ||
              null;

            messageBoxStore.setIsExpanded(true);
            messageBoxStore.setActiveActionItem(actionItem);
            messageBoxStore.setSubject(subject);
            messageBoxStore.setSecondaryActionItem(secondaryActionItem);
          }}
          className="cursor-pointer py-[4px] px-[24px]  hover:bg-hover-1 items-center text-display-12 text-text-weak"
        >
          <div className="h-[32px] grid grid-cols-3">
            <div className="flex flex-row items-center">
              <div
                className={classNames(
                  "mr-[12px] w-[24px] h-[24px] bg-gray-moderate rounded-full flex justify-center items-center"
                )}
              >
                {getIconByPlatform(platform)}
              </div>
              <span className="mr-2 font-semibold text-display-14">
                {getPlatform(platform)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-center text-text-moderate">
              <span>{sentDate}</span>
            </div>
            <div className="flex flex-row items-center justify-end" title={fromName}>
              <Avatar src={img} alt={fromName} width={24} disableShadow={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
