import { Header } from "./Header"
import { Staging } from "~/components/UI/Staging/Staging";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Staging />
      <div className="flex h-screen justify-center bg-b1-black bg-gradient">
        <div className="w-full">
          <Header />
          <div className="flex flex-col justify-center items-center">{children}</div>
        </div>
      </div>
    </>
  );
};
