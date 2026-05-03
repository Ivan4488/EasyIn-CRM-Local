import { useRouter } from "next/router";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { LeftMenuContacts } from "~/components/pages/Contact/LeftMenuContacts";
import { RightMenuCompany } from "~/components/pages/Company/RightMenuCompany";
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { CreateProperty } from "~/components/pages/PropertiesSettings/CreateProperty/CreateProperty";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function CompaniesPropertyEdit() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  const isDetached = id === DETACHED_PROPERTIES_ID;

  return (
    <MainLayout>
      {isDetached ? <LeftMenuMain /> : <LeftMenuContacts id={id} />}
      <CreateProperty contactId={id} />
      {isDetached ? <RightMenu /> : <RightMenuCompany isDisabled />}
    </MainLayout>
  );
}
