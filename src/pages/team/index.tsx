import type { NextPage } from "next";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain"
import { RightMenu } from "~/components/UI/RightMenu/RightMenu"
import { MainLayout } from "~/layouts/MainLayout/MainLayout"
import { TeamList } from "~/components/pages/Team/TeamList"

const Team: NextPage = () => {
  return (
    <MainLayout>
      <LeftMenuMain />
      <TeamList />
      <RightMenu />
    </MainLayout>
  );
};

export default Team;
