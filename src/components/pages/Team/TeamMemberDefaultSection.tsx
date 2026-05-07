import { Team as TeamIcon } from "~/icons/records/Team";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { UserData } from "~/service/types";
import { BackHeaderRectangle, MenuItem } from "../../UI/BackHeaderRectangle/BackHeaderRectangle";
import { useRouter } from "next/router";
import { SectionLoader } from "~/components/UI/MiddleSection/SectionLoader";
import { DeleteConfirmation } from "~/components/Confirmation/DeleteConfirmation";
import { useState } from "react";

interface TeamMemberProps {
  userId: string;
}

export const TeamMemberDefaultSection = ({ userId }: TeamMemberProps) => {
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onBackButtonClick = () => {
    router.back();
  };

  const { data } = useQuery({
    queryKey: ["team", userId],
    queryFn: async () => {
      const { data } = await axiosClient.get<UserData>(`/users/${userId}`);
      return data;
    },
  });

  const menuItems: MenuItem[] = [
    {
      label: "Delete",
      onClick: () => setIsDeleteConfirmOpen(true),
    },
  ];

  if (!data) return <SectionLoader />;

  if (isDeleteConfirmOpen) {
    return (
      <DeleteConfirmation
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          // TODO: wire delete mutation when team delete endpoint is ready
          setIsDeleteConfirmOpen(false);
          router.back();
        }}
        title="Delete team member"
        subtitle="Are you sure you want to delete this team member?"
      />
    );
  }

  return (
    <>
      <BackHeaderRectangle
        title={`${data.first_name} ${data.last_name}`.trim() || data.email}
        onClick={onBackButtonClick}
        Icon={TeamIcon}
        menuItems={menuItems}
      />
    </>
  );
};
