import { Company } from "~/icons/records/Company";
import { Contact } from "~/icons/records/Contact";
import { Message } from "~/icons/records/Message";
import { RecordType } from "~/service/types";
import { RecordAvatar } from "./RecordAvatar/RecordAvatar";
import classNames from "classnames";
import { extractContent } from "~/lib/utils/extractContent";
import { toEllipsis } from "~/lib/utils/toEllipsis";
import { RecordLayoutWrapper } from "./RecordLayoutWrapper";
import { useMemo } from "react"
import { getAccountImgUrl } from "~/lib/utils/getAccountImageUrl"

interface RecordProps {
  id: string;
  type: RecordType;
  href: string;
  title: string;
  onSelect: () => void;
  avatar?: string;
}

const getIcon = (type: RecordType) => {
  switch (type) {
    case "message":
      return <Message />;
    case "contact":
      return <Contact />;
    case "company":
      return <Company />;
  }
};

const selectorKey = "recordList";

export const Record = ({ type, title, avatar, id, href, onSelect }: RecordProps) => {
  const extractedContent = toEllipsis(extractContent(title), 50);

  const img = useMemo(() => {
    if (!avatar) {
      return undefined;
    }

    return getAccountImgUrl(avatar);
  }, [avatar]);

  return (
    <RecordLayoutWrapper
      selectorKey={selectorKey}
      id={id}
      type={type}
      onSelect={onSelect}
      href={href}
      Icon={getIcon(type)}
    >
      <div className="flex items-center">
        <div
          className={classNames(
            "border-gray-moderate w-[32px] h-[32px] rounded-full border border-solid flex items-center justify-center ml-[20px]",
            "bg-hover-1"
          )}
        >
          <RecordAvatar
            title={extractedContent}
            avatar={img}
          />
        </div>

        <div className="p-[20px] flex justify-center items-center text-display-18 font-bold">
          {extractedContent}
        </div>
      </div>
    </RecordLayoutWrapper>
  );
};
