import { useRouter } from "next/router";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { RightMenuTeam } from "~/components/pages/Team/RightMenuTeam";
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { CreateProperty } from "~/components/pages/PropertiesSettings/CreateProperty/CreateProperty";
import { DETACHED_PROPERTIES_ID } from "~/constants/propertiesConstants";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function TeamPropertyEdit() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  const isDetached = id === DETACHED_PROPERTIES_ID;

  return (
    <MainLayout>
      <LeftMenuMain />
      <CreateProperty contactId={id} />
      {isDetached ? <RightMenu /> : <RightMenuTeam userId={id} isDisabled />}
    </MainLayout>
  );
}
