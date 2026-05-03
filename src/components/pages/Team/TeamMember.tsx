import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { TeamMemberDefaultSection } from "./TeamMemberDefaultSection";

interface TeamMemberProps {
  userId: string;
}

export const TeamMember = ({ userId }: TeamMemberProps) => {
  return (
    <MiddleSection>
      <TeamMemberDefaultSection userId={userId} />
    </MiddleSection>
  );
};
