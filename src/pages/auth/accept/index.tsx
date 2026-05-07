import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Input } from "~/components/UI/Input/Input";
import { AuthLayout } from "~/layouts/AuthLayout/AuthLayout";
import { axiosClient } from "~/service/axios";

export default function AcceptInvite() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return axiosClient.post("/users/accept", data);
    },
    onSuccess: (data) => {
      router.push("/");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while accepting the invite",
        variant: "destructive",
      });
      setError(error?.response?.data?.error || "");
    },
  });

  const SignUpSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<{ email: string; password: string }>({
    mode: "onSubmit",
    resolver: zodResolver(SignUpSchema),
  });

  useEffect(() => {
    const email = router.query.email;
    if (email) {
      setValue("email", email as string);
    }
  }, [router.query.email]);

  const onSubmit = () => {
    // remove spaces
    const email = getValues("email").trim();
    setValue("email", email);

    handleSubmit((data) => {
      mutation.mutate({
        password: data.password,
        email: data.email,
      });
    })();
  };
  return (
    <AuthLayout>
      <form
        className="flex flex-col max-w-[500px] w-full mt-[120px]"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex justify-center mb-[48px]">
          <h1 className="text-[32px] text-text-weak font-bold">Accept Invite</h1>
        </div>

        <div className="flex flex-col gap-[24px] mb-[48px] w-full">
          <Input
            label="Email"
            placeholder="Type email"
            {...register("email", { required: true })}
            disabled={true}
            error={errors.email?.message || error}
          />
          <Input
            label="Password"
            placeholder="Enter password"
            {...register("password", { required: true })}
            error={errors.password?.message}
            type="password"
          />
        </div>

        <div className="flex justify-end gap-[8px] w-full">
          <Button className="w-full" type="submit" isLoading={mutation.isPending}>
            Accept Invite
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
