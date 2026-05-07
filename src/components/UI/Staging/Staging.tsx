const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true';

export const Staging = () => {
  return <>
    {isStaging && (
      <div className="fixed top-0 left-0 right-0 border-solid border-t-[6px] border-[#00ff00] z-[2147483647] pointer-events-none opacity-50"></div>
    )}
  </>
}
