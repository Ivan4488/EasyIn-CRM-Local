import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { Input } from "~/components/UI/Input/Input";
import { AuthLayout } from "~/layouts/AuthLayout/AuthLayout";
import { supabaseInstance } from "~/service/supabase";

export default function SignUp() {
  const router = useRouter();

  const onSubmit = () => {
    handleSubmit((data) => {
      supabaseInstance.auth
        .updateUser({
          password: data.password,
        })
        .then(() => {
          router.push("/");
        });
    })();
  };

  const ResetSchema = z
    .object({
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirm"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ confirmPassword: string; password: string }>({
    mode: "onSubmit",
    resolver: zodResolver(ResetSchema),
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
          <h1 className="text-[32px] text-text-weak font-bold">
            Change Password
          </h1>
        </div>

        <div className="flex flex-col gap-[24px] mb-[48px] w-full">
          <Input
            label="New Password"
            placeholder="Enter new password"
            {...register("password", { required: true })}
            error={errors.password?.message}
            type="password"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm new password"
            {...register("confirmPassword", { required: true })}
            // @ts-ignore
            error={errors.confirmPassword?.message || errors?.confirm?.message}
            type="password"
          />
        </div>

        <div className="flex justify-end gap-[8px] w-full">
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
