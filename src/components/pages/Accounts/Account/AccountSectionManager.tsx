import { BackHeaderRectangle, MenuItem } from "~/components/UI/BackHeaderRectangle/BackHeaderRectangle";
import { useAccount } from "./hooks/useAccount";
import { useRouter } from "next/router";
import { Account as Account } from "~/icons/records/Account";
import { PhotoInputMiddle } from "~/components/UI/Properties/Variants/PhotoInput/PhotoInputMiddle";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { getSupabaseImg } from "~/service/supabase";
import { DomainMiddle } from "~/components/UI/Properties/Variants/Domain/DomainMiddle/DomainMiddle"
import { AccountSenderEmailMiddle } from "~/components/UI/Properties/Variants/AccountSenderEmail/AccountSenderEmailMiddle"
import { useEffect, useState } from "react"
import { SectionLoader } from "~/components/UI/MiddleSection/SectionLoader";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation";
import { useDeleteAccountsMutation } from "../AccountList/hooks/useDeleteAccountMutation";
import { usePaginationStore } from "~/stores/paginationStore";

export const AccountSectionManager = () => {
  const router = useRouter();
  const { data } = useAccount();
  const { mutate: deleteAccount } = useDeleteAccountsMutation();
  const { total } = usePaginationStore();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onBackButtonClick = () => {
    router.back();
  };

  const { middleSection, setPropertiesSection } = useRightMenuNavigationStore();

  useEffect(() => {
    setPropertiesSection("default");
  }, [middleSection]);

  const isActive = data?.data.is_active ?? false;
  const isOnlyAccount = total === 1;
  const isDeleteDisabled = isActive || isOnlyAccount;
  const accountId = data?.data.id ?? "";

  const menuItems: MenuItem[] = [
    {
      label: "Delete",
      onClick: () => setIsDeleteConfirmOpen(true),
      disabled: isDeleteDisabled,
    },
  ];

  if (!data) return <SectionLoader />;

  if (isDeleteConfirmOpen) {
    return (
      <DeleteConfirmation
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          deleteAccount([accountId]);
          setIsDeleteConfirmOpen(false);
          router.back();
        }}
        title="Delete account"
        subtitle="Are you sure you want to delete this account?"
      />
    );
  }

  switch (middleSection) {
    case "photo-input":
      return <PhotoInputMiddle />;
    case "verify-domain":
      return <DomainMiddle />;
    case "account-sender-email":
      return <AccountSenderEmailMiddle />;
    default:
      return (
        <BackHeaderRectangle
          title={data?.data.name ?? ""}
          avatar={getSupabaseImg({
            img: data?.data.avatar ?? "",
            bucket: "account-imgs",
          })}
          onClick={onBackButtonClick}
          Icon={Account}
          menuItems={menuItems}
        />
      );
  }
};
