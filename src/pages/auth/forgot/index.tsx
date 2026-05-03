import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { Input } from "~/components/UI/Input/Input";
import { AuthLayout } from "~/layouts/AuthLayout/AuthLayout";
import { supabaseInstance } from "~/service/supabase";

export default function ForgotPassword() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const ForgotSchema = z.object({
    email: z.string().email("Invalid email"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: "onSubmit",
    resolver: zodResolver(ForgotSchema),
  });

  const onSubmit = () => {
    handleSubmit(async (data) => {
      setIsLoading(true);
      setError("");
      const { error } = await supabaseInstance.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/reset`,
        }
      );
      setIsLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/auth/forgotInstructionsSent");
    })();
  };

  return (
    <AuthLayout>
      <form
        className="flex justify-center flex-col w-[500px] items-center mt-[120px]"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <h1 className="text-text-weak text-[32px] font-bold mb-[48px]">
          Forgot password?
        </h1>
        <Input
          label="Enter your email to receive a password reset link."
          id="email"
          placeholder="Type email"
          {...register("email", { required: true })}
          error={errors.email?.message || error}
        />
        <div className="flex justify-end gap-[8px] w-full mt-[56px]">
          <Button className="w-full" type="submit" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
