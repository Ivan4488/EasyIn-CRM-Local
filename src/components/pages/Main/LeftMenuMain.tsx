import React from "react";
import { SideMenu } from "../../UI/SideMenu/SideMenu";
import { Activity } from "~/icons/records/Activity";
import { Contact } from "~/icons/records/Contact";
import { Company } from "~/icons/records/Company";
import { Message } from "~/icons/records/Message";
import { Duplicate } from "~/icons/records/Duplicate";
import { CompanyDuplicate } from "~/icons/records/CompanyDuplicate";
import { MenuSectionConfig } from "../../UI/SideMenu/MenuSection";
import { MenuItemConfig } from "../../UI/SideMenu/MenuItem";
import { Plans } from "~/icons/records/Plans";
import { Account } from "~/icons/records/Account";
import { Team } from "~/icons/records/Team";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { usePaginationStore } from "~/stores/paginationStore";
import { useSelectorStore } from "~/stores/select";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PROPERTIES_CONTEXT_MAP, PropertiesContext } from "~/constants/propertiesConstants";
import { Cross } from "~/icons/ui/Cross";
import { useRouter } from "next/router";

export const LeftMenuMain = () => {
  const isDuplicatesActive = useLeftMenuStore((s) => s.activeItems.includes("duplicates/main"));
  const isCompanyDuplicatesActive = useLeftMenuStore((s) => s.activeItems.includes("company-duplicates/main"));
  const isContactPropertiesActive = useLeftMenuStore((s) => s.activeItems.includes("contact-properties/main" as any));
  const isCompanyPropertiesActive = useLeftMenuStore((s) => s.activeItems.includes("company-properties/main" as any));
  const isAccountPropertiesActive = useLeftMenuStore((s) => s.activeItems.includes("account-properties/main" as any));
  const isTeamPropertiesActive = useLeftMenuStore((s) => s.activeItems.includes("team-properties/main" as any));
  const leftMenuStore = useLeftMenuStore();
  const selectorStore = useSelectorStore();
  const { setPage } = usePaginationStore();
  const propertiesStore = usePropertiesStore();
  const router = useRouter();

  const goToProperties = (objectType: "contacts" | "companies" | "accounts" | "team") => {
    selectorStore.clearSelection();
    selectorStore.setIsSelectAll(false);
    setPage(1);
    propertiesStore.setPropertiesContext(objectType);
    leftMenuStore.setActiveItems([PROPERTIES_CONTEXT_MAP[objectType as PropertiesContext] as any]);
    navigateToIndex();
  };

  const closeProperties = (objectType: "contacts" | "companies" | "accounts" | "team") => {
    leftMenuStore.deactivateItem(PROPERTIES_CONTEXT_MAP[objectType as PropertiesContext] as any);
    navigateToIndex();
  };

  const navigateToIndex = () => {
    if (router.pathname !== "/") router.push("/");
  };

  const activateDuplicates = () => {
    selectorStore.clearSelection();
    selectorStore.setIsSelectAll(false);
    setPage(1);
    leftMenuStore.activateItem("duplicates/main", false);
    navigateToIndex();
  };

  const closeDuplicates = () => {
    leftMenuStore.deactivateItem("duplicates/main");
  };

  const activateCompanyDuplicates = () => {
    selectorStore.clearSelection();
    selectorStore.setIsSelectAll(false);
    setPage(1);
    leftMenuStore.activateItem("company-duplicates/main", false);
    navigateToIndex();
  };

  const closeCompanyDuplicates = () => {
    leftMenuStore.deactivateItem("company-duplicates/main");
  };

  const activeRowContent = (
    IconComponent: React.FC<React.SVGProps<SVGSVGElement>>,
    label: string,
    onClose: () => void,
    iconStyle?: React.CSSProperties,
  ) => (
    <button
      className="flex w-full flex-row gap-[6px] items-center rounded-[12px] px-[16px] py-[6px] hover:bg-hover-1 text-strong-green transition-colors"
      onClick={onClose}
    >
      <div className="w-[43px] h-[40px] flex items-center justify-center shrink-0">
        <IconComponent style={iconStyle} />
      </div>
      <div className="text-display-16 font-semibold flex-1 text-left">{label}</div>
      <Cross className="w-[14px] h-[14px] shrink-0 mr-[4px]" />
    </button>
  );

  const contactOrDuplicatesItem: MenuItemConfig =
    isDuplicatesActive
      ? {
          id: "duplicates/main",
          title: "Duplicates",
          Icon: Contact,
          isMultiSelectable: false,
          noUrlAction: true,
          customContent: activeRowContent(Duplicate, "Duplicates", closeDuplicates, { transform: "translate(1.5px, 0px)" }),
        }
      : isContactPropertiesActive
      ? {
          id: "contact-properties/main" as any,
          title: "Properties",
          Icon: Contact,
          isMultiSelectable: false,
          noUrlAction: true,
          customContent: activeRowContent(Contact, "Properties", () => closeProperties("contacts")),
        }
      : {
          id: "contact/main",
          title: "Contact",
          Icon: Contact,
          isMultiSelectable: false,
          noUrlAction: true,
          dotsMenuItems: [
            { value: "duplicates", label: "Duplicates" },
            { value: "properties", label: "Manage properties" },
          ],
          onDotsMenuChange: (value) => {
            if (value === "duplicates") activateDuplicates();
            if (value === "properties") goToProperties("contacts");
          },
        };

  const companyOrDuplicatesItem: MenuItemConfig =
    isCompanyDuplicatesActive
      ? {
          id: "company-duplicates/main",
          title: "Company Duplicates",
          Icon: Company,
          isMultiSelectable: false,
          noUrlAction: true,
          customContent: activeRowContent(CompanyDuplicate, "Duplicates", closeCompanyDuplicates, { transform: "translate(1.5px, 0px)" }),
        }
      : isCompanyPropertiesActive
      ? {
          id: "company-properties/main" as any,
          title: "Properties",
          Icon: Company,
          isMultiSelectable: false,
          noUrlAction: true,
          customContent: activeRowContent(Company, "Properties", () => closeProperties("companies")),
        }
      : {
          id: "company/main",
          title: "Company",
          Icon: Company,
          isMultiSelectable: false,
          noUrlAction: true,
          dotsMenuItems: [
            { value: "duplicates", label: "Duplicates" },
            { value: "properties", label: "Manage properties" },
          ],
          onDotsMenuChange: (value) => {
            if (value === "duplicates") activateCompanyDuplicates();
            if (value === "properties") goToProperties("companies");
          },
        };

  const config: MenuSectionConfig[] = [
    {
      id: "section1-main",
      title: "SECTION 1",
      defaultActive: true,
      items: [

        /* Activity — hidden until ready for implementation
        {
          id: "activity/main",
          title: "Activity",
          Icon: Activity,
          isMultiSelectable: false,
          noUrlAction: true,
        },
        */
        {
          id: "message/main",
          title: "Conversation",
          Icon: Message,
          isWithZigzag: true,
          pathname: "/response",
          isMultiSelectable: false,
        },
        contactOrDuplicatesItem,
        companyOrDuplicatesItem,
      ],
    },
    {
      id: "section2-main",
      title: "SECTION 2",
      defaultActive: true,
      items: [
        isAccountPropertiesActive
          ? {
              id: "account-properties/main" as any,
              title: "Properties",
              Icon: Account,
              isMultiSelectable: false,
              noUrlAction: true,
              customContent: activeRowContent(Account, "Properties", () => closeProperties("accounts")),
            }
          : {
              id: "account/main",
              title: "Account",
              Icon: Account,
              url: "/accounts",
              dotsMenuItems: [{ value: "properties", label: "Manage properties" }],
              onDotsMenuChange: (value) => {
                if (value === "properties") goToProperties("accounts");
              },
            },
        isTeamPropertiesActive
          ? {
              id: "team-properties/main" as any,
              title: "Properties",
              Icon: Team,
              isMultiSelectable: false,
              noUrlAction: true,
              customContent: activeRowContent(Team, "Properties", () => closeProperties("team")),
            }
          : {
              id: "team/main",
              title: "Team members",
              Icon: Team,
              url: "/team",
              dotsMenuItems: [{ value: "properties", label: "Manage properties" }],
              onDotsMenuChange: (value) => {
                if (value === "properties") goToProperties("team");
              },
            },
        {
          id: "plans/main",
          title: "Plans & Billing",
          Icon: Plans,
          url: "/pricing",
        },
      ],
    },
  ];

  return <SideMenu config={config} />;
};
