import { useState } from "react";
import { Team } from "~/icons/records/Team";
import { WatchAndUpdate } from "~/icons/ui/WatchAndUpdate";
import { Info } from "~/icons/ui/Info";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/UI/Tooltip/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useBilling } from "./hooks/useBilling";
import { useUpdateSeatLimit } from "./hooks/useUpdateSeatLimit";
import { useUpdateWatchedProfilesLimit } from "./hooks/useUpdateWatchedProfilesLimit";
import { useCancelSubscription } from "./hooks/useCancelSubscription";
import { PRICE_PER_SEAT, PRICE_PER_WATCHED_PROFILE, FREE_SEAT_LIMIT, FREE_WATCHED_PROFILES_LIMIT } from "~/constants/billingConstants";


// ─── Shared primitives ────────────────────────────────────────────────────

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
    <path d="M14.1331 7.33333V6.66667C14.1331 4.36548 12.2677 2.5 9.96647 2.5C7.66528 2.5 5.7998 4.36548 5.7998 6.66667V7.33333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="8" width="14" height="9" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11.5V13.1667" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AutoIcon = () => (
  <span className="text-[13px] font-bold tracking-[-0.5px] leading-none">
    Auto
  </span>
);

const PrevBilling = ({ monthly }: { monthly: number }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-[13px] font-medium text-text-weak opacity-60 cursor-default">
          ${monthly} / mo
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Previous billing cycle</p>
        <TooltipArrow className="fill-gray-moderate" />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// ─── Shared limit-mode UI ─────────────────────────────────────────────────
// Slider + info tooltip + save button — identical in both cards.

interface SliderLimitModeProps {
  min: number;
  max: number;
  step: number;
  value: number;
  tooltipText: string;
  onChange: (val: number) => void;
  onSave: () => void;
}

const SliderLimitMode = ({ min, max, step, value, tooltipText, onChange, onSave }: SliderLimitModeProps) => (
  <div className="flex items-center gap-[10px] flex-1 min-w-0 ml-[12px]">
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="flex-1 min-w-0 accent-strong-green cursor-pointer"
    />
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-[32px] h-[32px] rounded-full border-2 border-gray-moderate flex items-center justify-center shrink-0 text-text-weak hover:opacity-80 transition-opacity cursor-default">
            <Info />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[220px] text-center">
          <p>{tooltipText}</p>
          <TooltipArrow className="fill-gray-moderate" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <button
      onClick={onSave}
      className="shrink-0 bg-white/[0.10] border border-white/30 rounded-[8px] px-[12px] py-[4px] text-[12px] font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-colors"
    >
      Save
    </button>
  </div>
);

// ─── Shared right-side button (Auto/Lock/Cancel) ──────────────────────────

interface LimitRightButtonProps {
  limitOpen: boolean;
  limitIsSet: boolean;
  savedLimit: number | null;
  tooltipLabel: string;
  onClick: () => void;
}

const LimitRightButton = ({ limitOpen, limitIsSet, savedLimit, tooltipLabel, onClick }: LimitRightButtonProps) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="relative flex items-center justify-center w-[56px] bg-white/[0.03] hover:bg-white/[0.07] transition-colors shrink-0 text-text-weak overflow-hidden"
        >
          {limitOpen ? (
            <span className="text-[11px] font-bold tracking-[-0.3px] leading-none">
              Close
            </span>
          ) : limitIsSet ? <LockIcon /> : <AutoIcon />}
        </button>
      </TooltipTrigger>
      {!limitOpen && (
        <TooltipContent>
          <p>{limitIsSet ? `${tooltipLabel}: ${savedLimit}` : `${tooltipLabel}: automatic`}</p>
          <TooltipArrow className="fill-gray-moderate" />
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

// ─── SeatCard ─────────────────────────────────────────────────────────────

interface SeatCardProps {
  count: number;
  monthly: number;
  prev?: { count: number; monthly: number };
  showLock?: boolean;
  savedLimitInit?: number | null;
  onSaveLimit?: (limit: number | null) => void;
}

const SeatCard = ({ count, monthly, prev, showLock, savedLimitInit = null, onSaveLimit }: SeatCardProps) => {
  const [limitOpen, setLimitOpen] = useState(false);
  const [savedLimit, setSavedLimit] = useState<number | null>(savedLimitInit);
  const [draftLimit, setDraftLimit] = useState(0);

  const openLimit = () => { setDraftLimit(savedLimit ?? 0); setLimitOpen(true); };
  const saveLimit = () => {
    const newLimit = draftLimit === 0 ? null : draftLimit;
    setSavedLimit(newLimit);
    setLimitOpen(false);
    onSaveLimit?.(newLimit);
  };
  const cancelLimit = () => setLimitOpen(false);

  const limitIsSet = savedLimit !== null;
  const displayCount = limitOpen ? (draftLimit === 0 ? null : draftLimit) : count;

  return (
    <div className="w-full flex items-stretch overflow-hidden min-h-[64px]">
      <div className="flex flex-1 items-center justify-between px-[16px] py-[12px]">

        {/* left: fixed width so slider start never shifts */}
        <div className="flex items-center shrink-0 w-[260px]">
          <div className="w-[43px] h-[40px] flex items-center justify-center shrink-0 text-text-weak">
            <Team />
          </div>
          <div className="flex items-center gap-[7px] text-[15px] font-semibold text-text-weak">
            <span>{limitOpen ? "Team limit" : "Team members"}</span>
            {!limitOpen && prev ? (
              <span className="flex items-center gap-[5px]">
                <span className="text-[13px] font-medium text-text-weak opacity-50 line-through">x{prev.count}</span>
                <span className="text-[11px] text-text-weak opacity-40">&#8594;</span>
                <span className="text-[14px] font-medium text-text-weak">x&#8194;<span className="text-[15px] font-bold text-text-strong">{count}</span></span>
              </span>
            ) : (
              <>
                {displayCount !== null ? (
                  <span className="text-[14px] font-medium text-text-weak">
                    x&#8194;<span className="text-[15px] font-bold text-text-strong">{displayCount}</span>
                  </span>
                ) : limitOpen ? (
                  <span className="text-[15px] font-bold text-text-strong">Automatic</span>
                ) : (
                  <span className="text-[14px] font-medium text-text-weak">
                    x&#8194;<span className="text-[15px] font-bold text-text-strong">{count}</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* right: price or slider */}
        {!limitOpen ? (
          <div className="flex items-center gap-[10px] shrink-0">
            {prev && <PrevBilling monthly={prev.monthly} />}
            <span className="text-[15px] font-bold text-text-weak">${monthly} / mo</span>
          </div>
        ) : (
          <SliderLimitMode
            min={0} max={50} step={1}
            value={draftLimit}
            tooltipText="Set a maximum number of seats to keep your monthly billing under a set cost. Drag to Automatic to let seats adjust freely."
            onChange={setDraftLimit}
            onSave={saveLimit}
          />
        )}
      </div>

      {showLock && (
        <LimitRightButton
          limitOpen={limitOpen}
          limitIsSet={limitIsSet}
          savedLimit={savedLimit}
          tooltipLabel="Team limit"
          onClick={limitOpen ? cancelLimit : openLimit}
        />
      )}
    </div>
  );
};

// ─── EasyProfilesCard ─────────────────────────────────────────────────────

interface EasyProfilesCardProps {
  active: number;
  monthlyRate: number;
  prev?: { active: number; monthly: number };
  showLock?: boolean;
  savedLimitInit?: number | null;
  onSaveLimit?: (limit: number | null) => void;
}

const EasyProfilesCard = ({ active, monthlyRate, prev, showLock, savedLimitInit = null, onSaveLimit }: EasyProfilesCardProps) => {
  const [limitOpen, setLimitOpen] = useState(false);
  const [savedLimit, setSavedLimit] = useState<number | null>(savedLimitInit);
  const [draftLimit, setDraftLimit] = useState(0);

  const openLimit = () => { setDraftLimit(savedLimit ?? 0); setLimitOpen(true); };
  const saveLimit = () => {
    const newLimit = draftLimit === 0 ? null : draftLimit;
    setSavedLimit(newLimit);
    setLimitOpen(false);
    onSaveLimit?.(newLimit);
  };
  const cancelLimit = () => setLimitOpen(false);

  const limitIsSet = savedLimit !== null;
  const displayCount = limitOpen ? draftLimit : active;

  return (
    <div className="w-full flex items-stretch overflow-hidden min-h-[64px]">
      <div className="flex flex-1 items-center justify-between px-[16px] py-[12px]">

        {/* left: fixed width so slider start never shifts */}
        <div className="flex items-center shrink-0 w-[260px]">
          <div className="w-[43px] h-[40px] flex items-center justify-center shrink-0 text-text-weak">
            <WatchAndUpdate />
          </div>
          <div className="flex items-center gap-[7px] text-[15px] font-semibold text-text-weak">
            <span>{limitOpen ? "Profile limit" : "Watched profiles"}</span>
            {!limitOpen && prev ? (
              <span className="flex items-center gap-[5px]">
                <span className="text-[13px] font-medium text-text-weak opacity-50 line-through">x{prev.active}</span>
                <span className="text-[11px] text-text-weak opacity-40">&#8594;</span>
                <span className="text-[14px] font-medium text-text-weak">x&#8194;<span className="text-[15px] font-bold text-text-strong">{active}</span></span>
              </span>
            ) : (
              <>
                {limitOpen && draftLimit === 0 ? (
                  <span className="text-[15px] font-bold text-text-strong">Automatic</span>
                ) : (
                  <span className="text-[14px] font-medium text-text-weak">
                    x&#8194;<span className="text-[15px] font-bold text-text-strong">{displayCount}</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* right: price or slider */}
        {!limitOpen ? (
          <div className="flex items-center gap-[10px] shrink-0">
            {prev && <PrevBilling monthly={prev.monthly} />}
            <span className="text-[15px] font-bold text-text-weak">${monthlyRate} / mo</span>
          </div>
        ) : (
          <SliderLimitMode
            min={0} max={1000} step={10}
            value={draftLimit}
            tooltipText="Set a maximum number of Watched profiles to cap your monthly spend. Drag to Automatic to let usage adjust freely."
            onChange={setDraftLimit}
            onSave={saveLimit}
          />
        )}
      </div>

      {showLock && (
        <LimitRightButton
          limitOpen={limitOpen}
          limitIsSet={limitIsSet}
          savedLimit={savedLimit}
          tooltipLabel="Profile limit"
          onClick={limitOpen ? cancelLimit : openLimit}
        />
      )}
    </div>
  );
};

// ─── TotalCard ────────────────────────────────────────────────────────────

interface TotalCardProps {
  total: number;
  prev?: number;
  onCancel?: () => void;
  cancelAtPeriodEnd?: boolean;
  periodEndDate?: string | null;
  isCanceling?: boolean;
  isFree?: boolean;
}

const TotalCard = ({ total, prev, onCancel, isCanceling, cancelAtPeriodEnd, periodEndDate, isFree }: TotalCardProps) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="w-full flex items-stretch overflow-hidden min-h-[64px]">
      {confirming ? (
        /* ── confirmation state ── */
        <>
          <div className="flex flex-1 items-center justify-between px-[16px] py-[12px]">
            <span className="text-[14px] font-medium text-text-weak opacity-80 leading-tight pl-[10px]">
              Cancel your plan and downgrade to free limits?
            </span>
            <button
              onClick={() => { setConfirming(false); onCancel?.(); }}
              disabled={isCanceling}
              className="shrink-0 bg-white/[0.06] border border-gray-moderate rounded-[8px] px-[12px] py-[4px] text-[12px] font-semibold text-strong-error hover:bg-white/10 transition-colors ml-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCanceling ? "Canceling..." : "Confirm"}
            </button>
          </div>
          <button
            onClick={() => setConfirming(false)}
            className="relative flex items-center justify-center w-[56px] bg-white/[0.03] hover:bg-white/[0.07] transition-colors shrink-0 text-text-weak overflow-hidden"
          >
            <span className="text-[11px] font-bold tracking-[-0.3px] leading-none">
              Keep
            </span>
          </button>
        </>
      ) : (
        /* ── default state ── */
        <>
          <div className="flex flex-1 items-center justify-between px-[16px] py-[12px]">
            <span className="text-[15px] font-semibold text-text-weak pl-[10px]">Total</span>
            <div className="flex items-center gap-[10px] shrink-0">
              {prev !== undefined && (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-[13px] font-medium text-text-weak opacity-60 cursor-default">
                        ${prev.toFixed(2)} / mo
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Previous billing cycle</p>
                      <TooltipArrow className="fill-gray-moderate" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <span className="text-[15px] font-bold text-text-weak">${total.toFixed(2)} / mo</span>
            </div>
          </div>
          {cancelAtPeriodEnd ? (
            <div className="flex items-center justify-center w-[56px] shrink-0">
              <span className="text-[9px] font-bold tracking-[-0.2px] leading-[1.2] text-center text-text-weak px-[4px]">
                Ends {periodEndDate ? new Date(periodEndDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "soon"}
              </span>
            </div>
          ) : onCancel ? (
            <button
              onClick={() => setConfirming(true)}
              className="relative flex items-center justify-center w-[56px] bg-white/[0.03] hover:bg-white/[0.07] transition-colors shrink-0 text-text-weak hover:text-strong-error overflow-hidden group"
            >
              <span className="text-[11px] font-bold tracking-[-0.3px] leading-none opacity-60 group-hover:opacity-100 transition-opacity">
                Cancel
              </span>
            </button>
          ) : isFree ? (
            <div className="relative flex items-center justify-center w-[56px] bg-white/[0.03] shrink-0 overflow-hidden">
              <span className="text-[11px] font-bold tracking-[-0.3px] leading-none opacity-60 text-text-weak">
                Free
              </span>
            </div>
          ) : (
            <div className="w-[56px] shrink-0" />
          )}
        </>
      )}
    </div>
  );
};

// ─── PricingForm ──────────────────────────────────────────────────────────

export const PricingForm = () => {
  const { data: billingRes, isLoading, isError } = useBilling();
  const updateSeatLimit = useUpdateSeatLimit();
  const updateWatchedProfilesLimit = useUpdateWatchedProfilesLimit();
  const cancelSubscription = useCancelSubscription();

  const billing = billingRes?.data;

  const plan = billing?.plan ?? "FREE";
  const isFree = plan === "FREE";

  const seatCount = billing?.seat_count ?? 0;
  const watchedCount = billing?.watched_profiles_count ?? 0;
  const cancelAtPeriodEnd = billing?.cancel_at_period_end ?? false;
  const periodEndDate = billing?.current_period_end ?? null;

  // Free-tier reference counts (used for cancel-at-period-end preview)
  const freeSeatCount = FREE_SEAT_LIMIT;
  const freeWatchedCount = FREE_WATCHED_PROFILES_LIMIT;
  const seatCardCount = cancelAtPeriodEnd ? freeSeatCount : seatCount;

  // Paid monthly amounts — always $0 on free plan
  const currentMonthly = isFree ? 0 : seatCount * PRICE_PER_SEAT;
  const easyMonthly = isFree ? 0 : parseFloat((watchedCount * PRICE_PER_WATCHED_PROFILE).toFixed(2));
  const totalMonthly = currentMonthly + easyMonthly;

  if (isLoading) {
    return (
      <section className="flex flex-col">
        <h1 className="text-text-weak text-[32px] font-bold">Pricing</h1>
        <div className="mt-[24px] w-full max-w-[784px] border border-gray-moderate rounded-[12px] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              {i > 0 && <div className="h-px bg-gray-moderate/50" />}
              <div className="flex items-center px-[16px] py-[12px] min-h-[64px] gap-[12px]">
                <div className="w-[43px] h-[32px] rounded-[8px] bg-white/[0.06] animate-pulse shrink-0" />
                <div className="h-[14px] w-[140px] rounded-full bg-white/[0.06] animate-pulse" />
                <div className="ml-auto h-[14px] w-[80px] rounded-full bg-white/[0.06] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || !billing) {
    return (
      <section className="flex flex-col">
        <h1 className="text-text-weak text-[32px] font-bold">Pricing</h1>
        <div className="mt-[24px] text-strong-error text-[14px]">Failed to load billing info. Please refresh.</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <h1 className="text-text-weak text-[32px] font-bold">Pricing</h1>
      <div className="mt-[24px] w-full max-w-[784px] border border-gray-moderate rounded-[12px] overflow-hidden">
        <SeatCard
          count={seatCardCount}
          monthly={cancelAtPeriodEnd ? 0 : currentMonthly}
          prev={cancelAtPeriodEnd ? { count: seatCount, monthly: currentMonthly } : undefined}
          savedLimitInit={billing.seat_limit}
          onSaveLimit={(limit) => updateSeatLimit.mutate(limit)}
          showLock
        />
        <div className="h-px bg-gray-moderate/50" />
        <EasyProfilesCard
          active={cancelAtPeriodEnd ? freeWatchedCount : watchedCount}
          monthlyRate={cancelAtPeriodEnd ? 0 : easyMonthly}
          prev={cancelAtPeriodEnd ? { active: watchedCount, monthly: easyMonthly } : undefined}
          savedLimitInit={billing.watched_profiles_limit}
          onSaveLimit={(limit) => updateWatchedProfilesLimit.mutate(limit)}
          showLock
        />
        <div className="h-px bg-gray-moderate/50" />
        <TotalCard
          total={cancelAtPeriodEnd ? 0 : totalMonthly}
          prev={cancelAtPeriodEnd ? totalMonthly : undefined}
          onCancel={(cancelAtPeriodEnd || isFree) ? undefined : () => cancelSubscription.mutate()}
          isFree={isFree}
          isCanceling={cancelSubscription.isPending}
          cancelAtPeriodEnd={cancelAtPeriodEnd}
          periodEndDate={periodEndDate}
        />
      </div>
    </section>
  );
};
