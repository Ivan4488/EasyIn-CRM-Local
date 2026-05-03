import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { TeamMember } from "~/service/types"

export const useTeamMembers = () => {
  const query = useQuery({
    queryKey: ["team"],
    queryFn: () => {
      return axiosClient.get<TeamMember[]>("/users/team");
    },
  });

  return query;
};
