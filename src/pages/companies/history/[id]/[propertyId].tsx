import { useRouter } from "next/router";
import { LeftMenuContacts } from "~/components/pages/Contact/LeftMenuContacts";
import { PropertyHistory } from "~/components/pages/PropertyHistory/PropertyHistory";
import { RightMenuCompany } from "~/components/pages/Company/RightMenuCompany";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";
import { useSetPropertiesContext } from "~/stores/utils/usePropertiesContext";

export default function HistoryPage() {
  const router = useRouter();
  const { id: companyId } = router.query;

  useSetPropertiesContext({
    context: "companies",
    copyState: () => {
      void 0;
    },
  });

  if (typeof companyId !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuContacts id={companyId} />
      <PropertyHistory />
      <RightMenuCompany isDisabled />
    </MainLayout>
  );
}
