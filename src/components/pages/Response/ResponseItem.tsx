import classNames from "classnames";
import Link from "next/link";
import {  MessageResponseData } from "~/service/types";
import { extractContent } from "~/lib/utils/extractContent";

interface ResponseItemProps {
  item: MessageResponseData;
  activeContactId?: string;
}

export const ResponseItem = ({
  item,
  activeContactId,
}: ResponseItemProps) => {
  const extractedContent = extractContent(item.text);
  return (
    <Link href={`/response/${item.contact_id}`}>
      <div
        className={classNames(
          "px-[16px] py-[12px] rounded-[8px] border text-display-14 cursor-pointer",
          activeContactId === item.contact_id
            ? "border-strong-green text-text-moderate"
            : "text-text-weak hover:border-hover-2 border-gray-moderate"
        )}
      >
        <p className="font-medium mb-[4px]">{item.name}</p>
        <p className="line-clamp-2">{extractedContent}</p>
      </div>
    </Link>
  );
};
