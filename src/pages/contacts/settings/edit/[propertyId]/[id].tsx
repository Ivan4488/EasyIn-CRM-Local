import { useRouter } from "next/router";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { LeftMenuContacts } from "~/components/pages/Contact/LeftMenuContacts";
import { RightMenuContact } from "~/components/pages/Contact/RightMenuContact";
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { CreateProperty } from "~/components/pages/PropertiesSettings/CreateProperty/CreateProperty";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function ContactsPropertyEdit() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  const isDetached = id === DETACHED_PROPERTIES_ID;

  return (
    <MainLayout>
      {isDetached ? <LeftMenuMain /> : <LeftMenuContacts id={id} />}
      <CreateProperty contactId={id} />
      {isDetached ? <RightMenu /> : <RightMenuContact contactId={id} isDisabled />}
    </MainLayout>
  );
}
