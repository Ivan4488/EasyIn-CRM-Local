import { useState } from "react";
import { Button } from "~/components/UI/Buttons/Button";
import { Cross } from "~/icons/ui/Cross";
import { AddCardForm } from "./AddCardModal";
import { useBilling } from "../PricingForm/hooks/useBilling";

const formatBrand = (brand: string | null): string => {
  if (!brand) return "";
  const map: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "Amex",
    discover: "Discover",
    diners: "Diners",
    jcb: "JCB",
    unionpay: "UnionPay",
  };
  return map[brand.toLowerCase()] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
};

export const PaymentMethod = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: billingRes } = useBilling();
  const billing = billingRes?.data;

  const hasCard = !!billing?.card_last4;
  const cardDisplay = hasCard
    ? `${formatBrand(billing!.card_brand)}  ····  ····  ····  ${billing!.card_last4}`
    : null;

  return (
    <section className="flex flex-col mt-[48px]">
      <h1 className="text-text-weak text-[32px] font-bold">Payment method</h1>

      <div className="relative mt-[24px] py-[32px] px-[48px] bg-black-weak border rounded-[12px] border-gray-moderate max-w-[784px]">

        {showForm ? (
          <>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute right-[16px] top-[16px] border border-gray-moderate rounded flex justify-center items-center h-[28px] w-[28px] text-text-weak hover:bg-white/[0.06] transition-colors z-10"
            >
              <Cross />
            </button>
            <AddCardForm onCancel={() => setShowForm(false)} />
          </>
        ) : (
          <>
            <div className="w-[327px] flex justify-center items-center h-[48px] bg-black-moderate border border-gray-moderate rounded-[12px] text-gray-2 tracking-wide">
              {cardDisplay ?? "No credit card on file"}
            </div>
            <Button
              className="!w-[327px] mt-[16px]"
              onClick={() => setShowForm(true)}
            >
              {hasCard ? "Change card" : "Add card"}
            </Button>
          </>
        )}

      </div>
    </section>
  );
};
