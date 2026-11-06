// src/components/AirtelLogo.js
import React from 'react';

/**
 * Airtel brand SVG icon component.
 * Exact official vector path provided with #b22020 branding fill.
 */
export function AirtelIcon({
  className = "w-6 h-6",
  fill = "#b22020",
  size,
  style,
  ...props
}) {
  const customStyle = size ? { width: size, height: size, ...style } : style;

  return (
    <svg
      width={size || "1em"}
      height={size || "1em"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`wt-header-afi-i inline-block shrink-0 ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10.417 20.587c1.152-.407 2.187-1.045 3.222-1.683.991-.617 1.93-1.309 2.81-2.07 2.63-2.25 5.454-6.167 4.276-9.873C19.895 4.345 17.317 3 14.703 3 11.299 3 7.87 4.821 5.318 7.014c-1.287 1.219-3.545 4.267-1.489 5.807 1.64 1.213 3.967.105 5.474-.802 1.712-1.169 3.485-2.382 5.457-3.051.935-.342 2.25-.363 2.752.677.386.769.294 1.983-.231 3.094-.717 1.514-1.948 3.006-3.657 4.435-1.15.99-2.479 1.88-3.926 2.365-1.672.438-.655-1.002-.655-1.002.583-.658 1.263-1.22 1.888-1.835.291-.286.691-.677.667-1.24-.034-.762-.85-1.228-1.585-1.228-1.242 0-2.353 1.088-2.99 2.063-.445.691-1.38 2.45-.47 3.857.62.957 1.968 1.103 3.864.433Z"
        fill={fill}
      />
    </svg>
  );
}

const SIZES = {
  sm: {
    box: 'w-7 h-7 rounded-md',
    icon: 'w-4 h-4',
    title: 'text-sm',
    sub: 'text-[8px]',
  },
  md: {
    box: 'w-9 h-9 rounded-lg',
    icon: 'w-5 h-5',
    title: 'text-lg',
    sub: 'text-[9px]',
  },
  lg: {
    box: 'w-11 h-11 rounded-xl',
    icon: 'w-6 h-6',
    title: 'text-xl',
    sub: 'text-[10px]',
  },
};

/**
 * Standard brand lockup component matching project naming guidelines:
 * "AccelSaathi by Airtel Business"
 */
export function BrandLockup({
  theme = 'light', // 'light' (on white/light bg) or 'dark' (on red/dark bg)
  size = 'md',     // 'sm', 'md', 'lg'
  iconContainer = true,
  className = '',
}) {
  const isDark = theme === 'dark';
  const currentSize = SIZES[size] || SIZES.md;

  const iconBg = isDark
    ? 'bg-white shadow-xs'
    : 'bg-airtel-red-light border border-airtel-red/10 shadow-xs';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {iconContainer ? (
        <div className={`${currentSize.box} ${iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}>
          <AirtelIcon className={currentSize.icon} fill="#b22020" />
        </div>
      ) : (
        <AirtelIcon className={currentSize.icon} fill={isDark ? '#ffffff' : '#b22020'} />
      )}
      <div className="flex flex-col leading-none">
        <span className={`${currentSize.title} font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-airtel-charcoal'}`}>
          Accel<span className={isDark ? 'text-white/90' : 'text-airtel-red'}>Saathi</span>
        </span>
        <span className={`${currentSize.sub} font-bold uppercase tracking-widest ${isDark ? 'text-white/75' : 'text-airtel-slate'}`}>
          by Airtel Business
        </span>
      </div>
    </div>
  );
}

export default AirtelIcon;
