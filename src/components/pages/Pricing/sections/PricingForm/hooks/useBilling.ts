import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";

export type Plan = "FREE" | "PAID";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | null;

export interface BillingData {
  plan: Plan;
  subscription_status: SubscriptionStatus;
  seat_count: number;
  seat_limit: number | null;
  watched_profiles_count: number;
  watched_profiles_limit: number | null;
  has_subscription: boolean;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  card_last4: string | null;
  card_brand: string | null;
}

export const useBilling = () => {
  return useQuery({
    queryKey: ["billing"],
    queryFn: () => axiosClient.get<BillingData>("/billing"),
    staleTime: 60 * 1000, // 1 minute
    retry: 3,
  });
};
