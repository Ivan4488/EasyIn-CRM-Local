import { RecordLayoutWrapper } from "~/components/UI/Record/RecordLayoutWrapper";
import { RecordAvatar } from "~/components/UI/Record/RecordAvatar/RecordAvatar";
import { Account as AccountIcon } from "~/icons/records/Account";
import { getSupabaseImg } from "~/service/supabase";
import { AccountData } from "~/service/types";

interface AccountProps {
  account: AccountData;
  onSelect: () => void;
}

export const AccountListItem = ({ account, onSelect }: AccountProps) => {
  return (
    <RecordLayoutWrapper
      selectorKey="accounts"
      Icon={<AccountIcon />}
      id={account.id}
      type="account"
      onSelect={onSelect}
      href={`/accounts/${account.id}`}
    >
      <div className="flex items-center">
        <div className="border-gray-moderate w-[32px] h-[32px] rounded-full border border-solid flex items-center justify-center ml-[20px] bg-hover-1">
          <RecordAvatar
            title={account.name}
            avatar={getSupabaseImg({
              img: account.avatar,
              bucket: "account-imgs",
            })}
          />
        </div>

        <div className="p-[20px] flex justify-center items-center text-display-18 font-bold">
          {account.name}
        </div>

        {account.is_active && (
          <div className="px-[8px] py-[4px] rounded-[4px] bg-strong-green text-black-moderate font-medium">
            Active
          </div>
        )}
      </div>
    </RecordLayoutWrapper>
  );
};
