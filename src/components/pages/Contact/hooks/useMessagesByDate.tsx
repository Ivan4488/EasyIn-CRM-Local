import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { MessageData } from "~/service/types";

interface UseMessagesByDateResult {
  currentDate: string;
  dateKeys: string[];
  messagesByDate: Record<string, MessageData[]>;
  renderMessages: React.ReactNode;
}

// Throttle helper function to improve scroll performance
const throttle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let lastCall = 0;
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

export const useMessagesByDate = (
  messages: MessageData[] | undefined,
  MessageComponent: React.ComponentType<MessageData>
): UseMessagesByDateResult => {
  const [currentDate, setCurrentDate] = useState<string>("");
  // Use a ref to avoid unnecessary re-renders when updating scroll visibility data
  const scrollDataRef = useRef<{dividers: HTMLElement[], containerRect: DOMRect | null}>({
    dividers: [],
    containerRect: null
  });

  // Group messages by date - optimize by using a Map for collection and only sort once
  const messagesByDate = useMemo(() => {
    if (!messages || messages.length === 0) return {};
    
    // Use a Map for faster insertion/lookup during grouping
    const groupedMap = new Map<string, MessageData[]>();
    
    // Create a date formatter once and reuse it
    const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
    
    // Use messages in their current order (already sorted by the parent component)
    // Instead of re-sorting them here
    messages.forEach(message => {
      const messageDate = new Date(message.created_at);
      const month = dateFormatter.format(messageDate);
      const year = messageDate.getFullYear();
      const dateKey = `${month} ${year}`;
      
      if (!groupedMap.has(dateKey)) {
        groupedMap.set(dateKey, []);
      }
      
      groupedMap.get(dateKey)!.push(message);
    });
    
    // Convert Map to Record at the end
    return Object.fromEntries(groupedMap.entries());
  }, [messages]);
  
  // Get array of date keys for scroll detection
  const dateKeys = useMemo(() => 
    Object.keys(messagesByDate), [messagesByDate]
  );
  
  // Set initial date when messages load
  useEffect(() => {
    if (dateKeys.length > 0) {
      setCurrentDate(dateKeys[0] || "");
    }
  }, [dateKeys]);
  
  // Update the DOM elements reference used for scroll calculations
  const updateScrollElements = useCallback(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    
    scrollDataRef.current.containerRect = messagesContainer.getBoundingClientRect();
    scrollDataRef.current.dividers = Array.from(
      document.querySelectorAll('[data-date-key]')
    ) as HTMLElement[];
  }, []);
  
  // Handle scroll to update current date - heavily optimized with throttling
  const handleScroll = useCallback(() => {
    const { dividers, containerRect } = scrollDataRef.current;
    if (!dividers.length || !containerRect) return;
    
    // Find the date divider that's most visible
    for (const divider of dividers) {
      const rect = divider.getBoundingClientRect();
      const topRelativeToContainer = rect.top - containerRect.top;
      
      // If this divider is at the top or above but visible
      if (topRelativeToContainer <= 50 && topRelativeToContainer + rect.height > 0) {
        const dateKey = divider.dataset.dateKey;
        if (dateKey) {
          setCurrentDate(prev => prev !== dateKey ? dateKey : prev);
          break;
        }
      }
    }
  }, []);
  
  // Create throttled function for scroll handling - only create once
  const throttledHandleScroll = useMemo(() => 
    throttle(handleScroll, 100), [handleScroll]);
  
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    
    // Update elements reference once on mount and when messages change
    updateScrollElements();
    
    messagesContainer.addEventListener('scroll', throttledHandleScroll);
    
    // Add resize listener to update element references when layout changes
    window.addEventListener('resize', updateScrollElements);
    
    // Initial check - use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      updateScrollElements();
      handleScroll();
    });
    
    return () => {
      messagesContainer.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', updateScrollElements);
    };
  }, [handleScroll, throttledHandleScroll, updateScrollElements, messages]);

  // Render messages either grouped by date or flat list
  const renderMessages = useMemo<React.ReactNode>(() => {
    if (!messages || messages.length === 0) {
      return <></>;
    }
    
    if (dateKeys.length > 0) {
      return dateKeys.map((dateKey) => (
        <div key={dateKey} data-date-key={dateKey} className="flex flex-col gap-[16px]">
          {messagesByDate[dateKey]?.map((message) => (
            <MessageComponent key={message.id} {...message} />
          ))}
        </div>
      ));
    }
    
    // Fallback to non-grouped messages (shouldn't happen with the current implementation)
    return (messages as MessageData[]).map((message) => (
      <MessageComponent key={message.id} {...message} />
    ));
  }, [messages, dateKeys, messagesByDate, MessageComponent]);

  return {
    currentDate,
    dateKeys,
    messagesByDate,
    renderMessages
  };
}; 