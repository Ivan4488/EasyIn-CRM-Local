import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { Input } from "~/components/UI/Input/Input";
import { Team } from "~/icons/records/Team";
import { axiosClient } from "~/service/axios";
import { UserData } from "~/service/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeftMenuStore } from "~/stores/leftMenu";
import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Loader } from "~/components/UI/Loader/Loader";

export const CreateForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const onBackButtonClick = () => {
    router.back();
  };

  const mutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return axiosClient.post<UserData>("/users/invite", data);
    },
    onError: (err, newData, context) => {
      console.log(err);
      toast({
        title: "Error",
        description: "An error occurred while inviting the team member",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      useLeftMenuStore.getState().clearMenu();
      toast({
        title: "Success",
        description: "Team member invited successfully",
        variant: "success",
      });
      router.push("/team");
    },
  });

  const TeamSchema = z.object({
    email: z.string().email("Invalid email"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof TeamSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(TeamSchema),
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <MiddleSection>
      <BackHeaderRound
        title="Invite team member"
        onClick={onBackButtonClick}
        Icon={Team}
      />

      {mutation.isPending ? (
        <div className="flex justify-center items-center mt-[180px] w-full">
          <Loader />
        </div>
      ) : (
        <Scrollbar className="flex flex-col items-center h-full w-full py-[60px]">
          <div className="flex flex-col max-w-[500px] w-full gap-[0px]">
            <Input
              label="Email"
              placeholder="Enter email address"
              {...register("email")}
              error={errors.email?.message}
            />

            <div className="flex justify-end gap-[8px] mt-[32px]">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  router.back();
                }}
              >
                Cancel
              </Button>
              <Button onClick={onSubmit}>Invite</Button>
            </div>
          </div>
        </Scrollbar>
      )}
    </MiddleSection>
  );
};
