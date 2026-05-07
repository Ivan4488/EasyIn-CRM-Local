import { CreateForm } from "~/components/pages/Create/Contact/CreateFrom"
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain"
import { RightMenu } from "~/components/UI/RightMenu/RightMenu";
import { MainLayout } from "~/layouts/MainLayout/MainLayout"

export default function Contact() {
  return (
    <MainLayout>
      <LeftMenuMain />
      <CreateForm />
      <RightMenu />
    </MainLayout>
  );
}
