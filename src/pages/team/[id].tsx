import { useRouter } from "next/router";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { RightMenuTeam } from "~/components/pages/Team/RightMenuTeam"
import { TeamMember } from "~/components/pages/Team/TeamMember"
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Contacts() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuMain />
      <TeamMember userId={id} />
      <RightMenuTeam userId={id} />
    </MainLayout>
  );
}
