import { useRouter } from "next/router";
import { Contact } from "~/components/pages/Contact/Contact";
import { RightMenuContact } from "~/components/pages/Contact/RightMenuContact"
import { LeftMenuResponse } from "~/components/pages/Response/LeftMenuResponse";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Contacts() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuResponse activeContactId={id} />
      <Contact contactId={id} isResponse />
      <RightMenuContact contactId={id}/>
    </MainLayout>
  );
}
