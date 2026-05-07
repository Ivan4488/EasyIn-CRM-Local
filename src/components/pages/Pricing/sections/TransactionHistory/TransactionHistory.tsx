import { useState } from "react";
import { Transaction } from "./Transaction";
import { Download } from "~/icons/ui/Download";
import { InvoiceDetails as InvoiceDetailsIcon } from "~/icons/ui/InvoiceDetails";
import { InvoiceDetailsForm } from "./InvoiceDetails";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Cross } from "~/icons/ui/Cross";

export const TransactionHistory = () => {
  const transactions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="flex flex-col mt-[48px]">
      <h1 className="text-text-weak text-[32px] font-bold">
        Transaction History
      </h1>

      <div className="relative mt-[24px] w-[784px] max-[1200px]:w-full bg-black-weak rounded-[12px] border border-gray-moderate p-[24px]">
        {showForm ? (
          <>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute right-[16px] top-[16px] border border-gray-moderate rounded flex justify-center items-center h-[28px] w-[28px] text-text-weak hover:bg-white/[0.06] transition-colors z-10"
            >
              <Cross />
            </button>
            <InvoiceDetailsForm />
          </>
        ) : (
          <div className="flex flex-row max-[1200px]:flex-col gap-[24px]">
            <Scrollbar
              className="flex flex-col w-[525px] max-[1200px]:w-full gap-[8px] h-[212px] overflow-y-scroll pr-[24px]"
              everPresent
            >
              {transactions.map((_, index) => (
                <Transaction key={index} index={index} />
              ))}
            </Scrollbar>

            <div className="flex justify-center items-center flex-col max-[1200px]:flex-row max-[1200px]:gap-[24px]">
              <button className="flex flex-row gap-[14px] items-center p-[12px] w-[197px] group hover:bg-hover-1 rounded border hover:border-gray-moderate border-transparent">
                <div className="bg-hover-1/5 rounded-full flex items-center justify-center h-[58px] w-[58px] min-w-[58px] min-h-[58px]">
                  <Download className="!w-[24px] !h-[26px] text-text-weak" />
                </div>
                <p className="text-display-16 text-text-weak text-left group-hover:underline">
                  Download <br /> All Invoices
                </p>
              </button>

              <hr className="border-r border-gray-moderate h-[1px] w-[94px] my-[16px] max-[1200px]:hidden" />

              <button
                className="flex flex-row gap-[14px] items-center p-[12px] w-[197px] group hover:bg-hover-1 rounded border hover:border-gray-moderate border-transparent"
                onClick={() => setShowForm(true)}
              >
                <div className="bg-hover-1/5 rounded-full flex items-center justify-center h-[58px] w-[58px] min-w-[58px] min-h-[58px]">
                  <InvoiceDetailsIcon />
                </div>
                <p className="text-display-16 text-text-weak text-left group-hover:underline">
                  Invoice <br /> Details
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
