import type { NextPage } from "next";
import { RecordList } from "~/components/pages/Main/RecordList"
import { LeftMenuResponse } from "~/components/pages/Response/LeftMenuResponse"
import { RightMenu } from "~/components/UI/RightMenu/RightMenu"
import { MainLayout } from "~/layouts/MainLayout/MainLayout"

const Response: NextPage = () => {
  return (
    <MainLayout>
      <LeftMenuResponse />
      <RecordList />
      <RightMenu />
    </MainLayout>
  );
};

export default Response;
