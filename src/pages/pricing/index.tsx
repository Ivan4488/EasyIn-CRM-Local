import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain";
import { PricingContent } from "~/components/pages/Pricing/PricingContent"
import { MainLayout } from "~/layouts/MainLayout/MainLayout";

export default function Pricing() {
  return (
    <MainLayout disableThirdColumn>
      <LeftMenuMain />
      <PricingContent />
    </MainLayout>
  );
}
