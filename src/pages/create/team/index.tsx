import { CreateForm } from "~/components/pages/Create/Team/CreateForm";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Team() {
  return (
    <MainLayout>
      <LeftMenuMain />
      <CreateForm />
      <RightMenu />
    </MainLayout>
  );
}
