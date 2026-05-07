import classNames from "classnames"
import { Header } from "./Header/Header";
import { Staging } from "~/components/UI/Staging/Staging";

interface MainLayoutProps {
  disableThirdColumn?: boolean;
  children: React.ReactNode;
}

export const MainLayout = ({ disableThirdColumn, children }: MainLayoutProps) => {
  return (
    <>
      <Staging />
      <div className="flex h-screen justify-center bg-b1-black bg-gradient">
        <div className="w-full flex flex-col min-w-[1000px]">
          <Header />

          <div className={classNames("grid overflow-hidden h-full", disableThirdColumn ? "grid-cols-[300px_1fr]" : "grid-cols-[300px_1fr_300px]")}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
