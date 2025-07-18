// This file contains custom SVG components to match the design's multi-color icons.

const commonProps = {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export const OrderListsIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
    <defs>
      <linearGradient id="orderGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="url(#orderGradient)" stroke="none" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="url(#orderGradient)" />
    <path d="m9 14l2 2l4 -4" stroke="#A7F3D0" strokeWidth="2.5" />
  </svg>
);

export const ProductIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
    <defs>
      <linearGradient id="productGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" stroke="url(#productGradient)" />
    <path d="M21 14v-4" stroke="url(#productGradient)" />
    <path d="M3 14v-4" stroke="url(#productGradient)" />
    <path d="M12 22v-8" stroke="url(#productGradient)" />
    <path d="m21 10-9 5-9-5" stroke="url(#productGradient)" />
    <path d="m7.5 15.5 4.5-2.5 4.5 2.5" stroke="url(#productGradient)" />
  </svg>
);

export const CategoriesIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
    <defs>
      <linearGradient id="catGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
    </defs>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="url(#catGradient)" />
    <path d="M14 2v6h6" stroke="url(#catGradient)" />
    <path d="M16 13H8" stroke="url(#catGradient)" strokeWidth="2" />
    <path d="M16 17H8" stroke="url(#catGradient)" strokeWidth="2" />
    <path d="M10 9H8" stroke="url(#catGradient)" strokeWidth="2" />
  </svg>
);

export const CustomersIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
     <defs>
      <linearGradient id="custGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="url(#custGradient)" />
    <path d="M20 20V10a2 2 0 0 0-2-2h-4" stroke="url(#custGradient)" />
    <path d="M4 20v-7a2 2 0 0 1 2-2h4" stroke="url(#custGradient)" />
  </svg>
);

export const DraftIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
    <defs>
      <linearGradient id="draftGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
    </defs>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="url(#draftGradient)" />
    <path d="M14 2v6h6" stroke="url(#draftGradient)" />
    <path d="M16 13H8" stroke="url(#draftGradient)" />
    <path d="M16 17H8" stroke="url(#draftGradient)" />
  </svg>
);

export const AccountsIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
     <defs>
      <linearGradient id="accGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#accGradient)" />
    <circle cx="12" cy="10" r="4" stroke="url(#accGradient)" />
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" stroke="url(#accGradient)" />
  </svg>
);

export const SettingIcon = ({ className }) => (
  <svg {...commonProps} className={className}>
    <defs>
      <linearGradient id="setGradient" x1="0" y1="0" x2="1"y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="url(#setGradient)" />
    <circle cx="12" cy="12" r="3" stroke="url(#setGradient)" />
  </svg>
);