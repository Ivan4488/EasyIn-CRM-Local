import { ActionItemData, useMessageBoxStore } from "~/stores/messageBox";
import { ActionItem } from "./ActionItem";
import classNames from "classnames";
import { Record } from "~/components/UI/Record/Record";
import { useIsSenderEmailSet } from "./useIsSenderEmailSet";
import { useQueryClient } from "@tanstack/react-query";
import { ContactData } from "~/service/types";
import { useRouter } from "next/router";
import { Dots } from "~/icons/ui/Dots";
import { Popover, PopoverTrigger, PopoverContent } from "~/components/UI/Popover/Popover";

export const secondaryItems = {
  linkedin: [
    { text: "Message", id: "message", isSubjectDisabled: true },
    { text: "Connect", id: "connect", isSubjectDisabled: true, isDisabled: true, disabledText: "Coming soon" },
    { text: "InMail", id: "inmail", isSubjectDisabled: false, isDisabled: true, disabledText: "Coming soon" },
  ] as ActionItemData[],
  email: [
    { text: "New", id: "new", isSubjectDisabled: false },
    { text: "Reply", id: "reply", isSubjectDisabled: true, isReply: true },
  ] as ActionItemData[],
} as Record<string, ActionItemData[]>;

export const actionItems = [
  {
    text: "Email",
    id: "email",
    isSubjectDisabled: false,
    disabledText: "Set sender email property in account settings",
  },
  { text: "LinkedIn", id: "linkedin", isSubjectDisabled: false, editorType: "linkedin" },
  { text: "Note", id: "note", isSubjectDisabled: true },
  // { text: "Chat", id: "chat", isSubjectDisabled: true },
] as ActionItemData[];

export const Header = () => {
  const messageBoxStore = useMessageBoxStore();
  const { data: isAccountEmailPropertySet } = useIsSenderEmailSet();

  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;
  const contactData = queryClient.getQueryData<ContactData>([
    "contacts",
    id,
  ]);
  const sender = messageBoxStore.activeActionItem?.id === 'linkedin' ? contactData?.linkedinAccounts?.[0] : undefined;

  actionItems[0]!.isDisabled =
    isAccountEmailPropertySet?.data?.isSet &&
    !isAccountEmailPropertySet?.data?.isDomainVerified;

  const isSubjectDisabled =
    messageBoxStore.activeActionItem?.isSubjectDisabled ||
    messageBoxStore.secondaryActionItem?.isSubjectDisabled;

  const activeActionItemId = messageBoxStore.activeActionItem?.id;
  const secondaryActionItemId = messageBoxStore.secondaryActionItem?.id;

  const onClickActionItem = (actionItem: ActionItemData) => {
    messageBoxStore.setActiveActionItem(actionItem);
    messageBoxStore.setSecondaryActionItem(secondaryItems[actionItem.id]?.[0] || null);
  };

  return (
    <div className="bg-message-box border-t border-solid border-gray-moderate">
      <div className="grid grid-cols-2 h-[48px] items-center border-b border-solid border-gray-moderate">
        <div className="border-r border-solid border-gray-moderate text-display-12 h-full flex items-center flex-row gap-[16px] pl-[24px]">
          <p className="text-text-weak mb-[2px]">Actions</p>
          <div className="flex flex-row gap-[8px] items-center max-[1100px]:hidden">
            {actionItems.map((actionItem) => (
              <ActionItem
                key={actionItem.id}
                text={actionItem.text}
                onClick={() => onClickActionItem(actionItem)}
                isActive={activeActionItemId === actionItem.id}
                isDisabled={actionItem.isDisabled}
                disabledText={actionItem.disabledText}
              />
            ))}
          </div>
          <div className="hidden max-[1100px]:flex flex-row gap-[8px] items-center">
            {actionItems.filter((item) => item.id === activeActionItemId).map((actionItem) => (
              <ActionItem
                key={actionItem.id}
                text={actionItem.text}
                onClick={() => onClickActionItem(actionItem)}
                isActive={true}
                isDisabled={actionItem.isDisabled}
                disabledText={actionItem.disabledText}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-[28px] h-[28px] rounded-[4px] flex items-center justify-center hover:bg-hover-1 text-text-weak"
                >
                  <Dots className="w-[12px] rotate-90 h-full" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="p-[4px]">
                {actionItems.filter((item) => item.id !== activeActionItemId).map((actionItem) => (
                  <button
                    key={actionItem.id}
                    disabled={actionItem.isDisabled}
                    className={classNames(
                      "w-full px-[12px] py-[8px] text-display-12 font-semibold rounded text-left",
                      actionItem.isDisabled ? "text-text-disabled cursor-default" : "text-text-weak hover:bg-hover-1 cursor-pointer"
                    )}
                    onClick={(e) => {
                      if (actionItem.isDisabled) return;
                      e.stopPropagation();
                      onClickActionItem(actionItem);
                    }}
                  >
                    {actionItem.text}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="text-display-12 text-text-weak h-full flex items-center flex-row gap-[16px] pl-[16px]">
          <p className="text-text-weak mb-[2px]">Select</p>
          <div className="flex flex-row gap-[8px] items-center max-[1100px]:hidden">
            {activeActionItemId &&
              secondaryItems[activeActionItemId] &&
              secondaryItems[activeActionItemId]?.map((actionItem) => (
                <ActionItem
                  key={actionItem.id}
                  text={actionItem.text}
                  onClick={() => {
                    messageBoxStore.setSecondaryActionItem(actionItem);

                    if (actionItem.id === "new") {
                      messageBoxStore.setSubject("");
                    }
                  }}
                  isActive={secondaryActionItemId === actionItem.id || !secondaryActionItemId && actionItem.isReply}
                  isDisabled={actionItem.isDisabled}
                  disabledText={actionItem.disabledText}
                />
              ))}
          </div>
          <div className="hidden max-[1100px]:flex flex-row gap-[8px] items-center">
            {activeActionItemId &&
              secondaryItems[activeActionItemId] &&
              secondaryItems[activeActionItemId]
                ?.filter((item) => secondaryActionItemId === item.id || (!secondaryActionItemId && item.isReply))
                .map((actionItem) => (
                  <ActionItem
                    key={actionItem.id}
                    text={actionItem.text}
                    onClick={() => {
                      messageBoxStore.setSecondaryActionItem(actionItem);
                      if (actionItem.id === "new") {
                        messageBoxStore.setSubject("");
                      }
                    }}
                    isActive={true}
                    isDisabled={actionItem.isDisabled}
                    disabledText={actionItem.disabledText}
                  />
                ))}
            {activeActionItemId &&
              secondaryItems[activeActionItemId] &&
              secondaryItems[activeActionItemId]!.filter((item) => !(secondaryActionItemId === item.id || (!secondaryActionItemId && item.isReply))).length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-[28px] h-[28px] rounded-[4px] flex items-center justify-center hover:bg-hover-1 text-text-weak"
                  >
                    <Dots className="w-[12px] rotate-90 h-full" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="p-[4px]">
                  {secondaryItems[activeActionItemId]
                    ?.filter((item) => !(secondaryActionItemId === item.id || (!secondaryActionItemId && item.isReply)))
                    .map((actionItem) => (
                      <button
                        key={actionItem.id}
                        disabled={actionItem.isDisabled}
                        className={classNames(
                          "w-full px-[12px] py-[8px] text-display-12 font-semibold rounded text-left",
                          actionItem.isDisabled ? "text-text-disabled cursor-default" : "text-text-weak hover:bg-hover-1 cursor-pointer"
                        )}
                        onClick={(e) => {
                          if (actionItem.isDisabled) return;
                          e.stopPropagation();
                          messageBoxStore.setSecondaryActionItem(actionItem);
                          if (actionItem.id === "new") {
                            messageBoxStore.setSubject("");
                          }
                        }}
                      >
                        {actionItem.text}
                      </button>
                    ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 h-[48px] items-center border-b border-solid border-gray-moderate">
        <div className="flex flex-row border-r border-solid border-gray-moderate h-[48px]">
          <div
            className={classNames(
              "pl-[24px] pr-[16px] text-display-12 text-text-weak flex items-center border-r border-solid border-gray-moderate",
              isSubjectDisabled ? "opacity-70" : ""
            )}
          >
            Subject
          </div>

          <div
            className={classNames(
              "flex items-center pl-[16px] w-full",
              !isSubjectDisabled && "hover:bg-b1-black"
            )}
          >
            <input
              type="text"
              placeholder=""
              disabled={isSubjectDisabled}
              value={messageBoxStore.subject}
              onChange={(e) => messageBoxStore.setSubject(e.target.value)}
              className="text-display-16 border-none bg-transparent text-white focus:outline-none w-full disabled:text-text-weak disabled:opacity-60 placeholder:text-text-weak"
            />
          </div>
        </div>
        <div className="text-display-12 text-text-weak h-full flex items-center flex-row gap-[16px] pl-[16px]">
          <p className="text-text-weak mb-[2px]">From</p>
          <div className="flex flex-row gap-[8px] items-center font-bold">
            <a href={sender?.url} rel="noreferrer" target="_blank">{sender?.name}</a>
          </div>
        </div>
      </div>
    </div>
  );
};
