import { useRouter } from "next/router";
import { PropertyHistory } from "~/components/pages/PropertyHistory/PropertyHistory";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";
import { useSetPropertiesContext } from "~/stores/utils/usePropertiesContext";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain"
import { RightMenuAccount } from "~/components/pages/Accounts/Account/RightMenuAccount"

export default function HistoryPage() {
  const router = useRouter();
  const { id: companyId } = router.query;

  useSetPropertiesContext({
    context: "accounts",
    copyState: () => {
      void 0;
    },
  });

  if (typeof companyId !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuMain />
      <PropertyHistory />
      <RightMenuAccount isDisabled />
    </MainLayout>
  );
}
