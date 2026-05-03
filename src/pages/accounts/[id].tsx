import { useRouter } from "next/router";
import { Account } from "~/components/pages/Accounts/Account/Account"
import { RightMenuAccount } from "~/components/pages/Accounts/Account/RightMenuAccount"
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function AccountPage() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuMain />
      <Account />
      <RightMenuAccount />
    </MainLayout>
  );
}
