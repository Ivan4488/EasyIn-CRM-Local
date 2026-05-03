import { useRouter } from "next/router";
import { Contact } from "~/components/pages/Contact/Contact";
import { LeftMenuContacts } from "~/components/pages/Contact/LeftMenuContacts";
import { RightMenuContact } from "~/components/pages/Contact/RightMenuContact"
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Contacts() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuContacts id={id} />
      <Contact contactId={id} />
      <RightMenuContact contactId={id} />
    </MainLayout>
  );
}
