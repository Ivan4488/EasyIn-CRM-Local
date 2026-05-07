export const Search = () => {
  return (
    <div className="flex items-center justify-between">
      <input
        type="text"
        placeholder="Search"
        className="text-display-14 border-none bg-transparent text-white focus:outline-none"
      />

      <div className="h-[16px] w-[16px] rounded-full border-2 border-solid border-gray-moderate"></div>
    </div>
  );
}