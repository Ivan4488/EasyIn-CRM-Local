import { useRouter } from "next/router";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { RightMenuAccount } from "~/components/pages/Accounts/Account/RightMenuAccount";
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { PropertiesSettings } from "~/components/pages/PropertiesSettings/PropertiesSettings";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function AccountsSettings() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  const isDetached = id === DETACHED_PROPERTIES_ID;

  return (
    <MainLayout>
      <LeftMenuMain />
      <PropertiesSettings itemId={isDetached ? undefined : id} />
      {isDetached ? <RightMenu /> : <RightMenuAccount isDisabled />}
    </MainLayout>
  );
}
