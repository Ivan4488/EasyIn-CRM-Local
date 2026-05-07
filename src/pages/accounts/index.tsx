import { AccountsList } from "~/components/pages/Accounts/AccountList/AccountsList"
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Accounts() {
  return (
    <MainLayout>
      <LeftMenuMain />
      <AccountsList />
      <RightMenu />
    </MainLayout>
  );
}
