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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    // remove spaces
    const email = getValues("email").trim();
    setValue("email", email);

    handleSubmit((data) => {
      setIsLoading(true);
      setError("");
      supabaseInstance.auth
        .signInWithPassword({
          email: data.email,
          password: data.password,
        })
        .then((response) => {
          if (response.error) {
            setError(response.error.message);
            setIsLoading(false);
            return;
          }

          const session = response.data.session;
          if (session) {
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.error_description);
          setIsLoading(false);
        });
    })();
  };

  const SignInSchema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    mode: "onSubmit",
    resolver: zodResolver(SignInSchema),
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
          <h1 className="text-[32px] text-text-weak font-bold">Log in</h1>
        </div>

        <div className="flex flex-col gap-[24px] mb-[48px] w-full">
          <Input
            label="Email"
            placeholder="Type email"
            {...register("email", { required: true })}
            error={errors.email?.message || error}
          />
          <div className="relative">
            <div className="text-display-12 text-text-weak absolute right-0">
              <Link href="/auth/forgot">
                <p className="text-display-14 text-text-weak cursor-pointer">
                  Forgot password?
                </p>
              </Link>
            </div>
            <Input
              label="Password"
              placeholder="Enter password"
              {...register("password", { required: true })}
              error={errors.password?.message}
              type="password"
            />
          </div>
        </div>

        <div className="flex justify-end gap-[8px] w-full">
          <Button className="w-full" type="submit" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </div>

        <div className="mt-[29px] text-display-15 w-full flex justify-center gap-1">
          <span className="text-text-weak">You don{"'"}t have an account?</span>
          <Link href="/auth/signup">
            <p className="text-strong-green cursor-pointer">Sign up</p>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
