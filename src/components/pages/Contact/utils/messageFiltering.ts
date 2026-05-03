import { MessageData } from "~/service/types";

/**
 * Filters messages based on platform and sorts them by creation date
 * @param messages - The messages to filter and sort
 * @param activeItems - Active filter and sort options
 * @param dateRange - Optional date range to filter messages
 * @returns Filtered and sorted messages
 */
export const filterAndSortMessages = (
  messages: MessageData[] | undefined,
  activeItems: string[],
  dateRange?: { from?: Date; to?: Date }
): MessageData[] | undefined => {
  if (!messages || messages.length === 0) {
    return messages;
  }

  // If no filter is selected and no date range, return all messages with default sorting
  if (activeItems.length === 0 && !dateRange?.from) {
    return sortMessages(messages, activeItems);
  }

  // Filter messages based on platform and other criteria
  const filteredMessages = filterMessages(messages, activeItems, dateRange);

  // Sort the filtered messages
  return sortMessages(filteredMessages, activeItems);
};

const sortingPrefixes = ["oldest-first"];
const platformFilteringPrefixes = [
  "linkedin",
  "email",
  "website-chat",
  "help-page",
  "notes",
  "system",
];
const inboundOutboundFilteringPrefixes = ["inbound-filter-"];
const dateFilteringPrefixes = ["date-filter-"];

/**
 * Filters messages based on selected platforms
 */
const filterMessages = (
  messages: MessageData[],
  activeItems: string[],
  dateRange?: { from?: Date; to?: Date }
): MessageData[] => {
  // Check if only sorting option is selected (no platform filters)
  const filteringActiveItems = activeItems.filter(
    (item) => !sortingPrefixes.includes(item)
  );

  // First filter by platform
  const platformFilteringActiveItems = filteringActiveItems.filter((item) =>
    platformFilteringPrefixes.some((prefix) => item.startsWith(prefix))
  );
  const filteredByPlatform = filterByPlatform(
    messages,
    platformFilteringActiveItems
  );

  // Then filter by inbound/outbound status
  const inboundOutboundFilteringActiveItems = filteringActiveItems.filter(
    (item) =>
      inboundOutboundFilteringPrefixes.some((prefix) => item.startsWith(prefix))
  );
  const filteredByInboundOutbound = filterByInboundOutbound(
    filteredByPlatform,
    inboundOutboundFilteringActiveItems
  );

  // Finally filter by date range if applicable
  const dateFilterActive = activeItems.some(item => 
    item === 'date-filter-active'
  );
  
  if (dateFilterActive && dateRange?.from) {
    return filterByDateRange(filteredByInboundOutbound, dateRange);
  }
  
  return filteredByInboundOutbound;
};

/**
 * Filters messages based on platform
 */
const filterByPlatform = (
  messages: MessageData[],
  platformFilteringActiveItems: string[]
): MessageData[] => {
  // If no platform filters are active, return all messages
  if (platformFilteringActiveItems.length === 0) {
    return messages;
  }

  return messages.filter((message) => {
    const platform = message.platform.toLowerCase();

    return platformFilteringActiveItems.some((item) => {
      // Platform mapping for substring matching
      const platformMap: Record<string, string> = {
        linkedin: "linkedin",
        email: "email",
        "website-chat": "chat",
        "help-page": "help",
        notes: "note",
        system: "system",
      };

      // Check if the item is in our mapping and if the platform includes the substring
      const platformValue = platformMap[item];
      if (platformValue && platform.includes(platformValue)) {
        return true;
      }

      return platform === item;
    });
  });
};

/**
 * Filters messages based on inbound/outbound status
 */
const filterByInboundOutbound = (
  messages: MessageData[],
  inboundOutboundFilteringActiveItems: string[]
): MessageData[] => {
  // If no inbound/outbound filters are active, return all messages
  if (inboundOutboundFilteringActiveItems.length === 0) {
    return messages;
  }

  return messages.filter((message) => {
    const isOutbound = message.sender === "user";

    if (
      inboundOutboundFilteringActiveItems.includes("inbound-filter-inbound")
    ) {
      return !isOutbound;
    }

    if (
      inboundOutboundFilteringActiveItems.includes("inbound-filter-outbound")
    ) {
      return isOutbound;
    }

    return true;
  });
};

/**
 * Sorts messages by creation date
 */
const sortMessages = (
  messages: MessageData[],
  activeItems: string[]
): MessageData[] => {
  return [...messages].sort((a, b) => {
    // If oldest-first is selected, sort oldest to newest (ascending)
    if (activeItems.includes("oldest-first")) {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    // Default sorting is newest-first (descending)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

/**
 * Filters messages based on a date range
 */
const filterByDateRange = (
  messages: MessageData[],
  dateRange: { from?: Date; to?: Date }
): MessageData[] => {
  if (!dateRange.from) {
    return messages;
  }

  return messages.filter((message) => {
    // Ensure we have a valid date object
    const messageDate = new Date(message.created_at);
    if (isNaN(messageDate.getTime())) {
      return false; // Skip invalid dates
    }
    
    // Reset hours for consistent date comparison
    const fromDate = new Date(dateRange.from!);
    fromDate.setHours(0, 0, 0, 0);
    
    // If only 'from' date is provided
    if (dateRange.from && !dateRange.to) {
      return messageDate >= fromDate;
    }
    
    // If both 'from' and 'to' dates are provided
    if (dateRange.from && dateRange.to) {
      // Set the 'to' date to end of day for inclusive filtering
      const toDateEnd = new Date(dateRange.to);
      toDateEnd.setHours(23, 59, 59, 999);
      
      return messageDate >= fromDate && messageDate <= toDateEnd;
    }
    
    return true;
  });
};
