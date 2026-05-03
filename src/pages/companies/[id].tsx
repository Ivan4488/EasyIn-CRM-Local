import { useRouter } from "next/router";
import { Company } from "~/components/pages/Company/Company"
import { RightMenuCompany } from "~/components/pages/Company/RightMenuCompany"
import { LeftMenuContacts } from "~/components/pages/Contact/LeftMenuContacts";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Companies() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuContacts id={id} />
      <Company id={id} />
      <RightMenuCompany />
    </MainLayout>
  );
}
