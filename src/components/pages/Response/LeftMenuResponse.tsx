import { MenuItem } from "~/components/UI/SideMenu/MenuItem";
import { Message } from "~/icons/records/Message";
import { ResponseItem } from "./ResponseItem";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { MessagesResponse, ConversationStatus } from "~/service/types";
import { Filters } from "./Filters/Filters";
import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { useState } from "react"
import { SideMenuLayout } from "~/components/UI/SideMenu/SideMenuLayout"

interface LeftMenuResponseProps {
  activeContactId?: string;
}


export const LeftMenuResponse = ({
  activeContactId,
}: LeftMenuResponseProps) => {
  const [sortValue, setSortValue] = useState<ConversationStatus>("active");

  const { data } = useQuery({
    queryKey: ["requiresResponseMessages", sortValue, activeContactId],
    queryFn: () => {
      const url = `/messages/requiresResponse?filter=${sortValue}`;

      return axiosClient.get<MessagesResponse>(url);
    },
    staleTime: Infinity,
  });

  return (
    <SideMenuLayout>
      <MenuSectionCollapsible title="SECTION 1" id="section1" defaultActive>
        <MenuItem
          id="message/main"
          title="Conversation"
          Icon={Message}
          isWithZigzag
          pathname="/response"
        />
        <div className="h-[1px] bg-gray-moderate w-full mt-[8px]"></div>
        <Filters
          sortValue={sortValue}
          onSortChange={setSortValue}
        />

        <div className="flex flex-col gap-[8px] mt-[10px]">
          {data?.data.messages.map((item) => (
            <ResponseItem
              key={item.id}
              item={item}
              activeContactId={activeContactId}
            />
          ))}
        </div>
      </MenuSectionCollapsible>
    </SideMenuLayout>
  );
};
