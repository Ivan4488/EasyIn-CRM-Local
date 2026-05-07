import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertyLockType } from "../RightMenuPropertiesList/hooks/useProperties";

// ─── Yellow left-side pieces (replaced with new 2-slice Figma design) ───────

/** Yellow left-wedge — top portion of the yellow left-side shape */
const Level1 = ({
  isActive,
  bottom,
}: {
  isActive: boolean;
  bottom: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="21"
    viewBox="0 0 7 21"
    fill="none"
    style={{ bottom: bottom + 7.41 }}
    className="absolute z-[10]"
  >
    <path
      opacity={isActive ? "1" : "0.3"}
      d="M-1.90735e-05 20.6016L6.32996 17.2969C5.30311 15.4069 4.80444 13.4214 4.80436 11.3203V1.60059L-1.90735e-05 0V20.6016Z"
      fill="url(#paint0_linear_6304_2476)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6304_2476"
        x1="7.91245"
        y1="20.6016"
        x2="-6.32999"
        y2="20.6016"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#AFEA84" />
        <stop offset="1" stopColor="#FFFC63" />
      </linearGradient>
    </defs>
  </svg>
);

/** Yellow bottom-cap — lower trapezoid portion of the yellow left-side shape */
const Level2 = ({
  isActive,
  bottom,
}: {
  isActive: boolean;
  bottom: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="10"
    viewBox="0 0 18 10"
    fill="none"
    style={{ bottom: bottom }}
    className="absolute z-[10]"
  >
    <path
      opacity={isActive ? "1" : "0.3"}
      d="M17.0526 9.22168H10.9909L8.90101 9.20703H0V3.79297L7.26439 0C7.67689 0.578534 8.14132 1.14904 8.66139 1.70996C9.53149 2.64835 10.4752 3.46951 11.4933 4.17871L13.079 5.17188C14.256 5.81329 15.5203 6.32749 16.8778 6.71191C16.9354 6.72823 16.994 6.74118 17.0526 6.75488V9.22168Z"
      fill="url(#paint0_linear_6304_2477)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6304_2477"
        x1="-4.26316"
        y1="9.22168"
        x2="34.1052"
        y2="9.22168"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#AFEA84" />
        <stop offset="1" stopColor="#FFFC63" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Teal right-side pieces (untouched — exactly as original) ────────────────

const Level4 = ({
  isActive,
  bottom,
}: {
  isActive: boolean;
  bottom: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="5"
      viewBox="0 0 6 5"
      fill="none"
      style={{ bottom: bottom, left: 20.18 }}
      className="absolute z-[10]"
    >
      <path
        opacity={isActive ? "1" : "0.3"}
        d="M3.91343 0C2.75346 0.626029 1.50902 1.12901 0.17484 1.50684C0.11721 1.52316 0.058606 1.5361 -1.62006e-05 1.5498V4.0166H5.98395L3.91343 0Z"
        fill="#39D0B5"
      />
    </svg>
  );
};

const Level5 = ({
  isActive,
  bottom,
}: {
  isActive: boolean;
  bottom: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      style={{ bottom: bottom, left: 25.68 }}
      className="absolute z-[10]"
    >
      <path
        opacity={isActive ? "1" : "0.3"}
        d="M4.40192 0C3.96174 0.634685 3.45808 1.25855 2.88928 1.87207C2.00313 2.82778 1.03987 3.66089 -9.17818e-06 4.37891L2.57195 9.36914H11.5497V3.7334L4.40192 0Z"
        fill="#39D0B5"
      />
    </svg>
  );
};

const Level6 = ({
  isActive,
  bottom,
}: {
  isActive: boolean;
  bottom: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="21"
      viewBox="0 0 7 21"
      fill="none"
      style={{ bottom: bottom + 7.41, left: 31 }}
      className="absolute z-[10]"
    >
      <path
        opacity={isActive ? "1" : "0.3"}
        d="M6.2356 0L1.43122 1.60059V11.3203C1.43114 13.3573 0.964084 15.2868 -1.2994e-05 17.125L6.2356 20.3809V0Z"
        fill="#39D0B5"
      />
    </svg>
  );
};

export const getCurrentLevel = (lockType?: PropertyLockType) => {
  if (!lockType) {
    return 3;
  }

  switch (lockType) {
    case PropertyLockType.WATCH_AND_UPDATE:
      return 0;
    case PropertyLockType.ONE_CLICK_UPDATE:
      return 1;
    case PropertyLockType.REVIEW_MODE:
      return 2;
    case PropertyLockType.FILL_AND_PROTECT:
      return 3;
    case PropertyLockType.PERSONAL_DEFAULT:
      return 4;
    case PropertyLockType.VISIBLE_FULLY_LOCKED:
      return 5;
    case PropertyLockType.HIDDEN_FULLY_LOCKED:
      return 6;
  }
};

export const Levels = ({
  propertyHeight,
  propertyId,
}: {
  propertyHeight?: number;
  propertyId: string;
}) => {
  const propertiesStore = usePropertiesStore();
  const property = propertiesStore.properties.find(
    (property) => property.id === propertyId
  );
  const lockType = property?.lockType;
  const currentLevel = getCurrentLevel(lockType);
  const bottom = propertyHeight ? propertyHeight / 2 - 19 : 0;

  return (
    <div
      className="absolute top-0 left-0"
      style={{ height: propertyHeight ?? 38 }}
    >
      <div className="relative" style={{ height: propertyHeight ?? 38 }}>
        {/* Teal right-side pieces — untouched */}
        <Level6 isActive={currentLevel >= 6} bottom={bottom} />
        <Level5 isActive={currentLevel >= 5} bottom={bottom} />
        <Level4 isActive={currentLevel >= 4} bottom={bottom} />

        {/* Yellow left-side pieces — new 2-slice Figma design (both active together at automation levels) */}
        <Level2 isActive={currentLevel <= 2} bottom={bottom} />
        <Level1 isActive={currentLevel <= 0} bottom={bottom} />
      </div>
    </div>
  );
};
