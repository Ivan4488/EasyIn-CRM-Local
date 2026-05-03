import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { useToast } from "~/components/UI/hooks/use-toast"
import { Input } from "~/components/UI/Input/Input";
import { AuthLayout } from "~/layouts/AuthLayout/AuthLayout";
import { axiosClient } from "~/service/axios";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      redirect: string;
    }) => {
      return axiosClient.post("/users/signup", data);
    },
    onSuccess: (data) => {
      router.push("/auth/verify");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while signing up",
        variant: "destructive",
      });
      setError(error?.response?.data?.error || "");
    },
  });

  const onSubmit = () => {
    // remove spaces
    const email = getValues("email").trim();
    setValue("email", email);

    handleSubmit((data) => {
      mutation.mutate({
        password: data.password,
        email: data.email,
        redirect: `${window.location.origin}/auth/confirmed`,
      });
    })();
  };

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
          <h1 className="text-[32px] text-text-weak font-bold">Sign up</h1>
        </div>

        <div className="flex flex-col gap-[24px] mb-[48px] w-full">
          <Input
            label="Email"
            placeholder="Type email"
            {...register("email", { required: true })}
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
            Sign up
          </Button>
        </div>

        <div className="mt-[29px] text-display-15 w-full flex justify-center gap-1">
          <span className="text-text-weak">You have an account?</span>
          <Link href="/auth/signin">
            <p className="text-strong-green cursor-pointer">Log in</p>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
