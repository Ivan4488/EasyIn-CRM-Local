import { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "~/components/UI/Buttons/Button";
import { stripePromise } from "~/service/stripe";
import { useSavePaymentMethod } from "../PricingForm/hooks/useSavePaymentMethod";

interface Props {
  onCancel(): void;
}

// Stripe Element appearance — matches existing Input component exactly
const ELEMENT_OPTIONS = {
  disableLink: true,
  style: {
    base: {
      color: "#ffffff",
      fontFamily: "inherit",
      fontSize: "14px",
      fontWeight: "400",
      "::placeholder": { color: "rgba(255,255,255,0.25)" },
    },
    invalid: { color: "#fb759d" },
  },
};

// ─── Inner form — must live inside <Elements> provider ────────────────────
const CardForm = ({ onCancel }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState<string | null>(null);
  const savePaymentMethod = useSavePaymentMethod(onCancel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStripeError(null);

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
    });

    if (error) {
      setStripeError(error.message ?? "An error occurred");
      return;
    }

    savePaymentMethod.mutate(paymentMethod.id);
  };

  return (
    <div>

      <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>

        {/* Card Number */}
        <div className="w-full">
          <label className="text-display-16 font-semibold text-text-weak">
            Card Number
          </label>
          <div className="mt-[7px] block w-full rounded-[12px] border-0 bg-b1-black px-[12px] py-[13px] ring-1 ring-inset ring-gray-moderate focus-within:ring-strong-green hover:ring-hover-2 transition">
            <CardNumberElement options={ELEMENT_OPTIONS} />
          </div>
        </div>

        <div className="flex flex-row gap-[24px]">

          {/* Expiry */}
          <div className="w-full">
            <label className="text-display-16 font-semibold text-text-weak">
              Expiration Date
            </label>
            <div className="mt-[7px] block w-full rounded-[12px] border-0 bg-b1-black px-[12px] py-[13px] ring-1 ring-inset ring-gray-moderate focus-within:ring-strong-green hover:ring-hover-2 transition">
              <CardExpiryElement options={ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* CVC */}
          <div className="w-full">
            <label className="text-display-16 font-semibold text-text-weak">
              CVC
            </label>
            <div className="mt-[7px] block w-full rounded-[12px] border-0 bg-b1-black px-[12px] py-[13px] ring-1 ring-inset ring-gray-moderate focus-within:ring-strong-green hover:ring-hover-2 transition">
              <CardCvcElement options={ELEMENT_OPTIONS} />
            </div>
          </div>

        </div>

        {stripeError && (
          <p className="ml-[12px] text-display-12 text-strong-error">{stripeError}</p>
        )}

        <Button
          className="!w-full"
          type="submit"
          disabled={!stripe || savePaymentMethod.isPending}
        >
          {savePaymentMethod.isPending ? "Saving..." : "Save card"}
        </Button>

      </form>
    </div>
  );
};

// ─── Exported component — wraps form in Elements provider ─────────────────
export const AddCardForm = ({ onCancel }: Props) => (
  <Elements stripe={stripePromise}>
    <CardForm onCancel={onCancel} />
  </Elements>
);
