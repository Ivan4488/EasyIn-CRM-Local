import Link from "next/link"
import { Button } from "~/components/UI/Buttons/Button"
import { AuthLayout } from "~/layouts/AuthLayout/AuthLayout"

export default function VerifyEmail() {
  return (
    <AuthLayout>
      <div className="flex justify-center flex-col w-[500px] items-center mt-[120px]">
        <h1 className="text-text-weak text-[32px] font-bold mb-[48px]">
          Sign up instructions has been sent
        </h1>
        <p className="mb-[32px] text-text-weak font-semibold text-display-15 w-[395px] text-center">
          Please check your inbox and follow further instructions to sign up
        </p>

        <div className="flex justify-end gap-[8px] w-full mt-[56px]">
          <Link href="/auth/signin">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
