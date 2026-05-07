import { useRouter } from "next/router";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { PropertyHistory } from "~/components/pages/PropertyHistory/PropertyHistory";
import { RightMenuTeam } from "~/components/pages/Team/RightMenuTeam";
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function HistoryPage() {
  const router = useRouter();
  const { id: userId } = router.query;

  if (typeof userId !== "string") {
    return null;
  }

  return (
    <MainLayout>
      <LeftMenuMain />
      <PropertyHistory />
      <RightMenuTeam userId={userId} isDisabled />
    </MainLayout>
  );
}
