import Link from "next/link";
import { Search } from "./Search";
import { useActiveAccount } from "~/layouts/MainLayout/Header/hooks/useActiveAccount";
import { RecordAvatar } from "~/components/UI/Record/RecordAvatar/RecordAvatar";
import { getSupabaseImg, supabaseInstance } from "~/service/supabase";
import { HeaderMenu } from "./HeaderMenu"
import { useRouter } from "next/router"

export const Header = () => {
  const { data: activeAccount, isLoading } = useActiveAccount();
  const router = useRouter();

  return (
    <header className="grid h-[72px] grid-cols-[300px_auto_300px] bg-b1-black px-[41px] py-[21px] border-b1-stroke border-b z-[20] w-full">
      <div className="flex flex-row items-center justify-between w-full max-w-[240px]">
        <Link href="/">
          <a
            className="text-display-18 w-[300px] font-bold text-white flex flex-row items-center gap-[10px]"
            role="button"
          >
            {isLoading ? (
              <div className="w-[30px] h-[30px] rounded-full border-gray-moderate border-solid border-2"></div>
            ) : (
              <RecordAvatar
                title={activeAccount?.data?.name || "EasyIn"}
                avatar={getSupabaseImg({
                  img: activeAccount?.data?.avatar || "",
                  bucket: "account-imgs",
                })}
              />
            )}
            {activeAccount?.data?.name || "EasyIn"}
          </a>
        </Link>
        <HeaderMenu onLogOut={() => {
          supabaseInstance.auth.signOut();
          router.push("/auth/signin");
        }}/>
      </div>
      <Search />
    </header>
  );
};
