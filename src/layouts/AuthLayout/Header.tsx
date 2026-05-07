import Link from "next/link"

export const Header = () => {
  return (
    <header className="grid h-[72px] px-[101px] py-[41px] z-[20] w-full">
      <Link href="/">
        <div className="text-display-18 w-[300px] font-bold text-text-moderate flex flex-row items-center gap-[10px]" role="button">
          <div className="w-[30px] h-[30px] rounded-full border-gray-moderate border-solid border-2"></div>
          EasyIn
        </div>
      </Link>
    </header>
  )
};