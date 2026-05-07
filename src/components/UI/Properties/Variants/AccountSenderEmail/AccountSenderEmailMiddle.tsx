import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { Button } from "~/components/UI/Buttons/Button";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Input } from "~/components/UI/Input/Input";
import { MiddleCutOut } from "~/components/UI/MiddleSection/MiddleCutOut";
import { axiosClient } from "~/service/axios";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";
import { Loader } from "~/components/UI/Loader/Loader";

export const AccountSenderEmailMiddle = () => {
  const rightMenuNavigationStore = useRightMenuNavigationStore();
  const onBackButtonClick = () => {
    rightMenuNavigationStore.setMiddleSection("default");
  };
  const propertiesStore = usePropertiesStore();
  const accountEmailPropertyId =
    rightMenuNavigationStore.accountEmailPropertyId;
  const accountEmailProperty = accountEmailPropertyId
    ? propertiesStore.getPropertyById(accountEmailPropertyId)
    : undefined;
  const accountEmailValue = accountEmailProperty?.stringValue;

  const domainPropertyId = rightMenuNavigationStore.domainPropertyId;
  const domainProperty = domainPropertyId
    ? propertiesStore.getPropertyById(domainPropertyId)
    : undefined;

  const router = useRouter();
  const accountId = router.query.id as string;

  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (email: string) => {
      return axiosClient.post(`/accounts/${accountId}/send-test-email`, {
        emailTo: email,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Email sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to send email",
      });
    },
  });

  const AccountSenderEmailSchema = z.object({
    email: z.string().email("Invalid email"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: "onSubmit",
    resolver: zodResolver(AccountSenderEmailSchema),
  });

  const onSendButtonClick = () => {
    handleSubmit((data) => {
      mutation.mutate(data.email);
    })();
  };

  const emailSent = mutation.isSuccess;

  return (
    <>
      <BackHeaderRound
        title="Test Email"
        onClick={onBackButtonClick}
        Icon={() => <Mail className="text-text-weak w-[16px] h-[16px]" />}
      />
      <div className="flex justify-center">
        <MiddleCutOut>
          {mutation.isPending ? (
            <div className="flex p-[16px]">
              <Loader />
            </div>
          ) : emailSent ? (
            <div className="p-[16px] flex flex-col gap-[16px]">
              <div className="flex flex-row gap-[6px] items-center pt-[16px] px-[20px] pb-[20px] border border-solid border-gray-moderate rounded-[12px] bg-hover-1">
                Email sent successfully
              </div>
            </div>
          ) : (
            <div className="p-[16px] flex flex-col gap-[16px]">
              <div className="flex flex-row gap-[6px] items-center pt-[16px] px-[20px] pb-[20px] border border-solid border-gray-moderate rounded-[12px] bg-hover-1">
                The email will be sent from{" "}
                <span className="font-semibold">{accountEmailValue}</span>
              </div>
              <Input
                label="Send to"
                className="w-full mt-[24px]"
                {...register("email")}
                error={errors.email?.message}
              />

              <div className="flex flex-row justify-end">
                <Button
                  onClick={onSendButtonClick}
                  disabled={!domainProperty?.isDomainVerified}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </MiddleCutOut>
      </div>
    </>
  );
};
