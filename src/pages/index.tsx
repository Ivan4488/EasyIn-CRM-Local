import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LeftMenuMain } from "~/components/pages/Main/LeftMenuMain"
import { RecordList } from "~/components/pages/Main/RecordList"
import { DuplicateListMiddle } from "~/components/pages/Duplicates/DuplicateListMiddle"
import { CompanyDuplicateListMiddle } from "~/components/pages/Duplicates/CompanyDuplicateListMiddle"
import { DuplicateReviewRightMenu } from "~/components/pages/Duplicates/DuplicateReview/DuplicateReviewRightMenu"
import { CompanyDuplicateReviewRightMenu } from "~/components/pages/Duplicates/DuplicateReview/CompanyDuplicateReviewRightMenu"
import { PropertiesSettings } from "~/components/pages/PropertiesSettings/PropertiesSettings"
import { RightMenu } from "~/components/UI/RightMenu/RightMenu"
import { MainLayout } from "~/layouts/MainLayout/MainLayout"
import { useLeftMenuStore } from "~/stores/leftMenu"
import { usePropertiesStore } from "~/stores/propertiesStore"
import { PROPERTIES_CONTEXT_MAP, DETACHED_PROPERTIES_ID, PropertiesContext, PropertiesMenuKey } from "~/constants/propertiesConstants"

const PROPERTIES_ITEMS = Object.values(PROPERTIES_CONTEXT_MAP) as PropertiesMenuKey[];

const Home: NextPage = () => {
  const activeItems = useLeftMenuStore((state) => state.activeItems);
  const isDuplicatesActive = activeItems.includes("duplicates/main");
  const isCompanyDuplicatesActive = activeItems.includes("company-duplicates/main" as any);
  const isPropertiesActive = PROPERTIES_ITEMS.some((key) => activeItems.includes(key as any));
  const selectedDuplicateReviewId = useLeftMenuStore((state) =>
    state.selectedDuplicateReviewId
  );
  const selectedCompanyDuplicateReviewId = useLeftMenuStore((state) =>
    state.selectedCompanyDuplicateReviewId
  );
  const propertiesContext = usePropertiesStore((s) => s.propertiesContext);


  const router = useRouter();

  // Allow external sources (e.g. the browser extension) to deep-link into
  // property settings via /?properties=contacts  (or companies/accounts/team)
  // without needing to navigate to a routed page that requires a cold bootstrap.
  useEffect(() => {
    const param = router.query.properties;
    if (typeof param !== "string") return;
    const valid = ["contacts", "companies", "accounts", "team"] as const;
    if (!valid.includes(param as any)) return;
    const context = param as typeof valid[number];
    usePropertiesStore.getState().setPropertiesContext(context);
    useLeftMenuStore.getState().setActiveItems([PROPERTIES_CONTEXT_MAP[context] as any]);
    // Remove the query param from the URL so it doesn't persist on refresh
    void router.replace("/", undefined, { shallow: true });
  }, [router.query.properties]);

  return (
    <MainLayout>
      <LeftMenuMain />
      {isDuplicatesActive
        ? <DuplicateListMiddle />
        : isCompanyDuplicatesActive
        ? <CompanyDuplicateListMiddle />
        : isPropertiesActive
        ? <PropertiesSettings />
        : <RecordList />
      }
      {isDuplicatesActive && selectedDuplicateReviewId
        ? <DuplicateReviewRightMenu reviewId={selectedDuplicateReviewId} />
        : isCompanyDuplicatesActive && selectedCompanyDuplicateReviewId
        ? <CompanyDuplicateReviewRightMenu reviewId={selectedCompanyDuplicateReviewId} />
        : <RightMenu />
      }
    </MainLayout>
  );
};

export default Home;
