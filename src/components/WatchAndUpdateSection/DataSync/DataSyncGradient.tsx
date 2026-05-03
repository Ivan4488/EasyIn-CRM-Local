interface DataSyncGradientProps {
  percentage?: number; // 0-100
}

export const DataSyncGradient: React.FC<DataSyncGradientProps> = ({
  percentage = 0,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const width = (230 * clampedPercentage) / 100;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="230"
      height="27"
      viewBox="0 0 241 27"
      fill="none"
    >
      {/* right line */}
      <rect x={width + 4} y="13" width={230 - width} height="1" stroke="#3C4041" />

      {/* left line */}
      <g filter="url(#filter0_d_2565_29292)">
        <rect
          x="4"
          y="12"
          width={width}
          height="3"
          rx="1.5"
          fill="url(#paint0_linear_2565_29292)"
        />
      </g>
      
      {/* left circle */}
      <circle
        cx="5.5"
        cy="13.5"
        r="4.5"
        fill="url(#paint1_linear_2565_29292)"
      />

      {/* right circle */}
      <circle
        cx="236.5"
        cy="13.5"
        r="4.5"
        fill="url(#paint2_linear_2565_29292)"
      />

      {/* middle circle */}
      <g filter="url(#filter1_dd_2565_29292)">
        <circle
          cx={width + 4}
          cy="13.5"
          r="4.5"
          fill="url(#paint3_linear_2565_29292)"
        />
      </g>

      {/* filters */}
      <defs>
        <filter
          id="filter0_d_2565_29292"
          x="0"
          y="8"
          // width="70"
          height="11"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.054902 0 0 0 0 0.4 0 0 0 0 0.745098 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2565_29292"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2565_29292"
            result="shape"
          />
        </filter>

        <filter
          id="filter1_dd_2565_29292"
          // x={width + 4}
          y="0"
          // width={230 - width}
          height="27"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_2565_29292"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.223529 0 0 0 0 0.815686 0 0 0 0 0.709804 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2565_29292"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1.5"
            operator="dilate"
            in="SourceAlpha"
            result="effect2_dropShadow_2565_29292"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.214728 0 0 0 0 0.341141 0 0 0 0 0.318386 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_2565_29292"
            result="effect2_dropShadow_2565_29292"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_2565_29292"
            result="shape"
          />
        </filter>

        
        <linearGradient
          id="paint0_linear_2565_29292"
          x1="66"
          y1="13.5"
          x2="2.5"
          y2="13.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#39D0B5" />
          <stop offset="1" stop-color="#0E66BE" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2565_29292"
          x1="8.2"
          y1="9.9"
          x2="1"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.14" stop-color="#4898E9" />
          <stop offset="1" stop-color="#125DA7" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2565_29292"
          x1="230"
          y1="9.9"
          x2="221"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.14" stop-color="#39D0B5" />
          <stop offset="1" stop-color="#375751" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2565_29292"
          x1={width + 7.2}
          y1="9.9"
          x2={width}
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.14" stop-color="#39D0B5" />
          <stop offset="1" stop-color="#375751" />
        </linearGradient>
      </defs>
    </svg>
  );
};
