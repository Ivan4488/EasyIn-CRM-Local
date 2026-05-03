import { Contact as ContactIcon } from "~/icons/records/Contact";
import { Message } from "./Message/Message";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { ContactData, MessageData } from "~/service/types";
import { MessageBox } from "./MessageBox/MessageBox";
import classNames from "classnames";
import { useMessageBoxStore } from "~/stores/messageBox";
import { BackHeaderRectangle } from "../../UI/BackHeaderRectangle/BackHeaderRectangle";
import { useRouter } from "next/router";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { SectionLoader } from "~/components/UI/MiddleSection/SectionLoader";
import { getContactName } from "~/lib/utils/getContactName";
import { useMessagesByDate } from "./hooks/useMessagesByDate";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { useEffect, useMemo, useState } from "react";
import { filterAndSortMessages } from "./utils/messageFiltering";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl"
import { MenuItem } from "~/components/UI/BackHeaderRectangle/BackHeaderRectangle";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation"
import { useDeleteRecord } from "../hooks/useDeleteRecord"
import { Loader } from "~/components/UI/Loader/Loader";

interface ContactProps {
  contactId: string;
  isResponse?: boolean;
}

interface DateRange {
  from?: Date;
  to?: Date;
}

// Utility function to get date range if filter is active
const getDateRangeIfFilterActive = (store: {
  activeItems: string[];
  dateRange: DateRange | undefined;
}): DateRange | undefined => {
  // Check if date filtering is active
  const dateFilterActive = store.activeItems.find(item => item.startsWith("date-filter-active"));

  if (!dateFilterActive) {
    return undefined;
  }

  // Return the date range directly from the store
  return store.dateRange;
};

export const ContactDefaultSection = ({
  contactId,
  isResponse,
}: ContactProps) => {
  const router = useRouter();
  const messageBoxStore = useMessageBoxStore();
  const leftMenuStore = useLeftMenuStore();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isScrolled, setIsScrolled ] = useState(false)

  const { mutate: deleteContact } = useDeleteRecord({onMutate: () => {
    onBackButtonClick();
  }});

  const onBackButtonClick = () => {
    isResponse ? router.push(`/contacts/${contactId}`) : router.push("/");
  };

  const handleDeleteContact = () => {
    // TODO: Implement delete functionality
    setIsDeleteConfirmOpen(true);
  };

  const handleMergeContact = () => {
    // TODO: Implement merge functionality
    console.log("Merge contact", contactId);
  };

  const handleExportContact = () => {
    // TODO: Implement export functionality
    console.log("Export contact", contactId);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Delete",
      onClick: handleDeleteContact,
    },
    {
      label: "Merge",
      onClick: handleMergeContact,
      disabled: true,
    },
    {
      label: "Export",
      onClick: handleExportContact,
      disabled: true,
    },
  ];

  const { data } = useQuery({
    queryKey: ["contacts", contactId],
    queryFn: async () => {
      const { data } = await axiosClient.get<ContactData>(
        `/contacts/find/${contactId}`
      );
      return data;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", contactId],
    queryFn: async () => {
      const { data } = await axiosClient.get<MessageData[]>(
        `/messages/contact/${contactId}`
      );
      return data;
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (isResponse) {
      // Remove contact page specific filters when in response mode
      leftMenuStore.setActiveItems(leftMenuStore.activeItems.filter(item => !item.endsWith("/contacts")));
    }
  }, []);

  const getBaseMenuItemId = (id: string): string => (id.split("/")[0] || "");

  // Use the utility function to filter and sort messages
  const processedMessages = useMemo(() => {
    // Get date range from store if filter is active
    const parsedDateRange = getDateRangeIfFilterActive(leftMenuStore);
    const activeItems = leftMenuStore.activeItems.filter(item => item.endsWith('/contacts')).map(getBaseMenuItemId);

    return filterAndSortMessages(
      messages,
      activeItems,
      parsedDateRange
    );
  }, [messages, leftMenuStore.activeItems, leftMenuStore.dateRange]);

  // Use the custom hook to handle message grouping and date display
  const { currentDate, renderMessages } = useMessagesByDate(
    processedMessages,
    Message
  );
  const img = useMemo(() => {
    if (!data?.avatar) {
      return undefined;
    }

    return getAccountImgUrl(data.avatar);
  }, [data]);

  // Scroll to a message
  useEffect(() => {
    const message = document.querySelector(`[data-msg-id="${router.query.message_id}"]`);
    if (message && !isScrolled) {
      // scroll to the messages from URL - once
      setIsScrolled(true);
      message.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      // scroll to the new message if exists
      document.querySelector(`[data-msg-id="new"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [renderMessages, router.query.message_id]);

  if (!data) return <SectionLoader />;

  if (isDeleteConfirmOpen) {
    return <DeleteConfirmation
      onCancel={() => setIsDeleteConfirmOpen(false)}
      onConfirm={() => {
        deleteContact([{ id: contactId, type: "contact" }]);
      }}
      title="Delete contact"
      subtitle="Are you sure you want to delete this contact?"
    />;
  }

  return (
    <>
      <BackHeaderRectangle
        title={getContactName(data)}
        onClick={onBackButtonClick}
        onClose={onBackButtonClick}
        Icon={ContactIcon}
        avatar={img}
        isRoundClose={isResponse}
        roundCloseTitle="Response mode"
        menuItems={menuItems}
      />

      {processedMessages && processedMessages.length > 0 && (
        <div className="h-[20px] flex shrink-0 justify-center items-center bg-b1-black border-b-gray-moderate border-t-gray-moderate border-solid border-b text-display-12 text-text-weak">
          {currentDate || "Loading..."}
        </div>
      )}

      <Scrollbar
        className={classNames(
          "flex flex-col gap-[16px] px-[24px] pt-[16px] transition-[padding] mb-[120px] h-full",
           messageBoxStore.isExpanded ? "pb-[114px]" : "pb-[16px]",
        )}
        id="messages-container"
        everPresent
      >
        {!messages ? <Loader /> : null}
        {renderMessages}
      </Scrollbar>

      <div className="absolute bottom-0 left-0 right-0 z-[30]">
        <MessageBox />
      </div>
    </>
  );
};
