import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { Button } from "~/components/UI/Buttons/Button";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Input } from "~/components/UI/Input/Input";
import { Loader } from "~/components/UI/Loader/Loader";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Account } from "~/icons/records/Account";
import { axiosClient } from "~/service/axios";

export const CreateForm = () => {
  const router = useRouter();

  const onBackButtonClick = () => {
    router.back();
  };

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof CompanySchema>) => {
      return axiosClient.post("/accounts/create", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      router.push("/accounts");
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to create account",
      });
    },
  });

  const CompanySchema = z.object({
    accountName: z.string().min(1, "Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CompanySchema>>({
    mode: "onSubmit",
    resolver: zodResolver(CompanySchema),
  });

  const onSubmit = () => {
    handleSubmit((data) => {
      mutation.mutate({
        accountName: data.accountName,
      });
    })();
  };

  return (
    <MiddleSection>
      <BackHeaderRound
        title="Create new account"
        onClick={onBackButtonClick}
        Icon={Account}
      />

      {mutation.isPending ? (
        <div className="flex justify-center items-center mt-[180px] w-full">
          <Loader />
        </div>
      ) : (
        <Scrollbar className="flex flex-col items-center h-full w-full py-[60px]">
          <div className="flex flex-col max-w-[500px] w-full gap-[0px]">
            <Input
              label="Account Name"
              placeholder="Account Name"
              {...register("accountName")}
              error={errors.accountName?.message}
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
              <Button onClick={onSubmit}>Save</Button>
            </div>
          </div>
        </Scrollbar>
      )}
    </MiddleSection>
  );
};
