import { MiddleCutOut } from "~/components/UI/MiddleSection/MiddleCutOut";
import { usePropertyHistory } from "./utils/usePropertyHistory";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import classNames from "classnames";
import { getPropertyValues, getPropertySources, getMailboxEntries } from "./utils/getPropertyValues";
import { PropertyChip } from "./PropertyChip";
import { MailboxPropertyChip } from "./MailboxPropertyChip";

export const HistoryTable = () => {
  const { data } = usePropertyHistory();
  const propertyType = data?.data.property.type;

  // CONTACT_EMAILS and COMPANY_EMPLOYEE_COUNT both flatten: every entry in the jsonValue
  // array becomes its own display row (one DB row may expand to N display rows).
  type HistoryItem = NonNullable<typeof data>["data"]["history"][0];
  type DisplayRow =
    | { kind: "single"; id: string; propertyValue: HistoryItem; rowIndex: number }
    | { kind: "mailbox"; id: string; entry: NonNullable<ReturnType<typeof getMailboxEntries>>[0]; date: string; rowIndex: number };

  const rows: DisplayRow[] = [];
  let rowIndex = 0;
  (data?.data.history ?? []).forEach((propertyValue) => {
    if (propertyType === "CONTACT_EMAILS" || propertyType === "COMPANY_EMPLOYEE_COUNT") {
      const entries = getMailboxEntries({ property: propertyValue, type: propertyType });
      if (entries && entries.length > 0) {
        const dateStr = new Date(propertyValue.valid_from).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
        entries.forEach((entry, idx) => {
          rows.push({ kind: "mailbox", id: `${propertyValue.id}-${idx}`, entry, date: dateStr, rowIndex: rowIndex++ });
        });
      } else {
        rows.push({ kind: "single", id: propertyValue.id, propertyValue, rowIndex: rowIndex++ });
      }
    } else {
      rows.push({ kind: "single", id: propertyValue.id, propertyValue, rowIndex: rowIndex++ });
    }
  });

  return (
    <div className="flex justify-center h-full overflow-hidden">
      <MiddleCutOut>
        <Scrollbar className="h-full">
          <div className="flex flex-col">
            <div className="flex flex-col p-[16px] border-b border-gray-moderate">
              <p className="text-display-16 font-semibold">
                {data?.data.property.name}
              </p>
            </div>

            <div className="text-text-weak font-semibold">
              <div className="grid grid-cols-4 text-display-12 px-[20px] py-[8px] border-b border-gray-moderate bg-[rgb(41,46,47)]">
                <p className="col-span-2">Property Value</p>
                <p>Source</p>
                <p>Date</p>
              </div>

              {rows.map((row) => {
                if (row.kind === "mailbox") {
                  return (
                    <div
                      key={row.id}
                      className={classNames(
                        "grid grid-cols-4 text-[13px] min-h-[64px] items-start px-[20px] border-b border-gray-moderate",
                        { "bg-black-moderate": row.rowIndex % 2 === 1 }
                      )}
                    >
                      <div className="col-span-2 flex flex-col gap-[10px] py-[16px]">
                        <MailboxPropertyChip entry={row.entry} />
                      </div>
                      <p className="pt-[30px] pb-[16px]"></p>
                      <p className="pt-[30px] pb-[16px]">{row.date}</p>
                    </div>
                  );
                }

                // "single" row — all non-mailbox property types
                const propertyValue = row.propertyValue;
                return (
                  <div
                    key={row.id}
                    className={classNames(
                      "grid grid-cols-4 text-[13px] min-h-[64px] items-start px-[20px] border-b border-gray-moderate",
                      { "bg-black-moderate": row.rowIndex % 2 === 1 }
                    )}
                  >
                    <div className="col-span-2 flex flex-col gap-[10px] py-[16px]">
                      <div className="flex flex-wrap gap-2">
                        {getPropertyValues({
                          property: propertyValue,
                          type: propertyType!,
                        }).map((value) => (
                          <PropertyChip key={value} value={value} />
                        ))}
                      </div>
                    </div>
                    <p className="py-[16px]">
                      {getPropertySources({
                        property: propertyValue,
                        type: propertyType!,
                      })}
                    </p>
                    <p className="py-[16px]">
                      {new Date(propertyValue.valid_from).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Scrollbar>
      </MiddleCutOut>
    </div>
  );
};
