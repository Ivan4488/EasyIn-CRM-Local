import { Company as CompanyIcon } from "~/icons/records/Company";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { CompanyData } from "~/service/types";
import { BackHeaderRectangle } from "../../UI/BackHeaderRectangle/BackHeaderRectangle";
import { useRouter } from "next/router";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { SectionLoader } from "~/components/UI/MiddleSection/SectionLoader";
import { PhotoInputMiddle } from "~/components/UI/Properties/Variants/PhotoInput/PhotoInputMiddle";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { useMemo, useState } from "react";
import { MenuItem } from "~/components/UI/BackHeaderRectangle/BackHeaderRectangle";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation";
import { useDeleteRecord } from "../hooks/useDeleteRecord";
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl";

interface CompanyProps {
  id: string;
}

export const Company = ({ id }: CompanyProps) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { mutate: deleteCompany } = useDeleteRecord({
    onMutate: () => {
      onBackButtonClick();
    },
  });

  const onBackButtonClick = () => {
    router.push("/");
  };

  const handleDeleteCompany = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleMergeCompany = () => {
    // TODO: Implement merge functionality
    console.log("Merge company", id);
  };

  const handleExportCompany = () => {
    // TODO: Implement export functionality
    console.log("Export company", id);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Delete",
      onClick: handleDeleteCompany,
    },
    {
      label: "Merge",
      onClick: handleMergeCompany,
      disabled: true,
    },
    {
      label: "Export",
      onClick: handleExportCompany,
      disabled: true,
    },
  ];

  const { data } = useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const { data } = await axiosClient.get<CompanyData>(
        `/companies/find/${id}`
      );
      return data;
    },
  });

  const { middleSection } = useRightMenuNavigationStore();

  const img = useMemo(() => {
    if (!data?.avatar) {
      return undefined;
    }
    return getAccountImgUrl(data.avatar);
  }, [data]);

  if (!data) {
    return <SectionLoader />;
  }

  return (
    <MiddleSection>
      {middleSection === "photo-input" ? (
        <PhotoInputMiddle />
      ) : (
        <>
          {isDeleteConfirmOpen ? (
            <DeleteConfirmation
              onCancel={() => setIsDeleteConfirmOpen(false)}
              onConfirm={() => {
                deleteCompany([{ id: id, type: "company" }]);
              }}
              title="Delete company"
              subtitle="Are you sure you want to delete this company?"
            />
          ) : (
            <BackHeaderRectangle
              title={data.name}
              onClick={onBackButtonClick}
              Icon={CompanyIcon}
              avatar={img}
              menuItems={menuItems}
            />
          )}
        </>
      )}
    </MiddleSection>
  );
};
