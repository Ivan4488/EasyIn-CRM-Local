import { useRouter } from "next/router";
import { LeftMenuContacts } from "~/components/pages/Contact/LeftMenuContacts";
import { RightMenuContact } from "~/components/pages/Contact/RightMenuContact"
import { PropertyHistory } from "~/components/pages/PropertyHistory/PropertyHistory"
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function HistoryPage() {
  const router = useRouter();
  const { id: contactId } = router.query;

  if (typeof contactId !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuContacts id={contactId} />
      <PropertyHistory />
      <RightMenuContact contactId={contactId} isDisabled />
    </MainLayout>
  );
}
