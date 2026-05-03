import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { IconSwitcher } from "~/components/UI/IconSwitcher/IconSwitcher";
import { Input } from "~/components/UI/Input/Input";
import { TextArea } from "~/components/UI/Textarea/Textarea";

const schemaPerson = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  country: z.string().optional(),
  vat: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  extraInfo: z.string().optional(),
});

const schemaCompany = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  country: z.string().optional(),
  vat: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  extraInfo: z.string().optional(),
});

type FormValues = {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  country?: string;
  vat?: string;
  city?: string;
  zip?: string;
  state?: string;
  address?: string;
  extraInfo?: string;
};

export const InvoiceDetailsForm = () => {
  const [isCompany, setIsCompany] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(isCompany ? schemaCompany : schemaPerson),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[24px]">
      <div className="flex flex-row items-center gap-[24px]">
        <h2 className="text-[24px] font-bold text-text-weak">Invoice details</h2>
        <IconSwitcher
        checked={isCompany}
        onCheckedChange={() => setIsCompany(!isCompany)}
      />
      </div>

      {isCompany ? (
        <Input
          label="Company name"
          {...register("companyName")}
          error={errors.companyName?.message}
        />
      ) : (
        <div className="flex flex-row gap-[24px]">
          <Input
            label="First name"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last name"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>
      )}

      <Input
        label="Email(s)"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <div className="flex flex-row gap-[24px]">
        <Input
          label="Country"
          {...register("country")}
          error={errors.country?.message}
        />
        <Input
          label="VAT"
          {...register("vat")}
          error={errors.vat?.message}
        />
      </div>

      <div className="flex flex-row gap-[24px]">
        <Input
          label="City"
          {...register("city")}
          error={errors.city?.message}
        />
        <Input
          label="ZIP"
          {...register("zip")}
          error={errors.zip?.message}
        />
      </div>

      <div className="flex flex-row gap-[24px]">
        <Input
          label="State / Province / Territory"
          {...register("state")}
          error={errors.state?.message}
        />
        <Input
          label="Address"
          {...register("address")}
          error={errors.address?.message}
        />
      </div>

      <TextArea
        label="Extra info on receipt (e.g. VAT number)"
        className="!h-[128px]"
        {...register("extraInfo")}
        error={errors.extraInfo?.message}
      />

      <Button type="submit" className="!w-full">Save details</Button>
    </form>
  );
};
