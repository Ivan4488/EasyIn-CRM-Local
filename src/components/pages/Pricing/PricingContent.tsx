import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection"
import { PaymentMethod } from "./sections/PaymentMethod/PaymentMethod";
import { PricingForm } from "./sections/PricingForm/PricingForm";
import { TransactionHistory } from "./sections/TransactionHistory/TransactionHistory";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar"

export const PricingContent = () => {
  return (
    <MiddleSection noRightBorder>
      <Scrollbar className="py-[40px] px-[33px] h-full">
        <PricingForm />
        <PaymentMethod />
        <TransactionHistory />
      </Scrollbar>
    </MiddleSection>
  );
};
