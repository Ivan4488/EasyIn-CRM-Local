import { RecordLayoutWrapper } from "~/components/UI/Record/RecordLayoutWrapper";
import { RecordAvatar } from "~/components/UI/Record/RecordAvatar/RecordAvatar";
import { Team as TeamIcon } from "~/icons/records/Team";
import { TeamMember } from "~/service/types";

interface TeamProps {
  teamMember: TeamMember;
  onSelect: () => void;
}

export const TeamListItem = ({ teamMember, onSelect }: TeamProps) => {
  // console.log(teamMember);
  return (
    <RecordLayoutWrapper
      selectorKey="team"
      Icon={<TeamIcon />}
      id={teamMember.id}
      type="team"
      onSelect={onSelect}
      href={`/team/${teamMember.id}`}
    >
      <div className="flex items-center">
        <div className="border-gray-moderate w-[32px] h-[32px] rounded-full border border-solid flex items-center justify-center ml-[20px] bg-hover-1">
          <RecordAvatar title={teamMember.name || teamMember.email || "New User"} />
        </div>

        {teamMember.name && (
          <>
            <div className="p-[20px] flex justify-center items-center text-display-18 font-bold">
              {teamMember.name}
            </div>

            <span className="text-gray-moderate"> | </span>
          </>
        )}

        <div className="ml-[20px] flex justify-center items-center text-display-18 text-gray-moderate font-bold">
          {teamMember.email}
        </div>
      </div>
    </RecordLayoutWrapper>
  );
};
