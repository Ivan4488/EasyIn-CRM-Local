import { useMemo, useState } from "react";
import { MenuSection, MenuSectionConfig } from "../../UI/SideMenu/MenuSection";
import { LinkedIn } from "~/icons/records/LinkedIn";
import { Email } from "~/icons/records/Email";
import { WebsiteChat } from "~/icons/records/WebsiteChat";
import { HelpPage } from "~/icons/records/HelpPage";
import { Notes } from "~/icons/records/Notes";
import { System } from "~/icons/records/System";
import { SideMenuLayout } from "~/components/UI/SideMenu/SideMenuLayout";
import { MenuSectionCollapsible } from "~/components/UI/SideMenu/MenuSectionCollapsible";
import { MenuItem, MenuItemId } from "~/components/UI/SideMenu/MenuItem";
import { Sort } from "~/icons/records/Sort";
import { ComboboxFilter } from "~/components/UI/SideMenu/ComboboxFilter/ComboboxFilter";
import { InboundOutbound } from "~/icons/records/InboundOutbound";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { DateFilter } from "~/components/UI/SideMenu/DateFilter/DateFilter"
import { DateRange } from "react-day-picker";

interface LeftMenuContactsProps {
  id: string;
}

export const LeftMenuContacts = ({ id }: LeftMenuContactsProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const leftMenuStore = useLeftMenuStore();

  const config: MenuSectionConfig[] = useMemo(
    () => [
      {
        id: "section1-contacts",
        title: "TYPE",
        defaultActive: true,
        items: [
          {
            id: "linkedin/contacts",
            title: "LinkedIn",
            Icon: LinkedIn,
            isMultiSelectable: true,
            noUrlAction: true,
          },
          {
            id: "email/contacts",
            title: "Email",
            Icon: Email,
            isMultiSelectable: true,
            noUrlAction: true,
          },
          {
            id: "notes/contacts",
            title: "Notes",
            Icon: Notes,
            isMultiSelectable: true,
            noUrlAction: true,
          },
          {
            id: "system/contacts",
            title: "System",
            Icon: System,
            isMultiSelectable: true,
            noUrlAction: true,
          },
        ],
      },
    ],
    []
  );

  const inboundOutboundFilterOptions = [
    { value: "inbound-filter-both/contacts", label: "Inbound & Outbound" },
    { value: "inbound-filter-inbound/contacts", label: "Inbound Only" },
    { value: "inbound-filter-outbound/contacts", label: "Outbound Only" },
  ];

  const handleInboundOutboundFilterChange = (value: string) => {
    // Remove any existing inbound/outbound filter
    const currentItems = leftMenuStore.activeItems.filter(
      item => !item.startsWith("inbound-filter-")
    );

    // Add the new inbound/outbound filter while preserving other filters (like date)
    leftMenuStore.setActiveItems([...currentItems, value as MenuItemId]);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range) {
      // Store the date range in the dedicated store property
      leftMenuStore.setDateRange(range);

      // Only store the active flag in activeItems
      const currentItems = leftMenuStore.activeItems.filter(
        item => item !== 'date-filter-active/contacts' && !item.startsWith('date-range:')
      );

      // Add the date filter active flag
      leftMenuStore.setActiveItems([
        ...currentItems,
        'date-filter-active/contacts'
      ]);
    } else {
      // Clear the date range from store
      leftMenuStore.setDateRange(undefined);

      // Remove date filter related items
      const filteredItems = leftMenuStore.activeItems.filter(
        item => item !== 'date-filter-active/contacts' && !item.startsWith('date-range:')
      );
      leftMenuStore.setActiveItems(filteredItems);
    }
  };

  return (
    <SideMenuLayout>
      <div className="flex flex-col gap-[4px]">
        {config.map((item) => {
          return <MenuSection key={item.id} {...item} />;
        })}

        <MenuSectionCollapsible
          title="ADDITIONAL FILTERS"
          id="additional-filters"
          defaultActive={true}
        >
          <DateFilter
            dateRange={dateRange}
            id="date-filter/contacts"
            onDateRangeChange={handleDateRangeChange}
          />

          <MenuItem
            id="oldest-first/contacts"
            title="Oldest first"
            Icon={Sort}
            noUrlAction={true}
            isMultiSelectable={true}
          />
          <ComboboxFilter
            Icon={InboundOutbound}
            options={inboundOutboundFilterOptions}
            defaultValue="inbound-filter-both/contacts"
            onChange={handleInboundOutboundFilterChange}
          />
        </MenuSectionCollapsible>
      </div>
    </SideMenuLayout>
  );
};
