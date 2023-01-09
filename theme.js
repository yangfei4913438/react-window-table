const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config.theme} */
module.exports = {
  colors: {
    primary: 'hsla(var(--primary), <alpha-value> )',
    accent: 'hsla(var(--accent), <alpha-value> )',
    success: 'hsla(var(--success), <alpha-value> )',
    warning: 'hsla(var(--warning), <alpha-value> )',
    danger: 'hsla(var(--danger), <alpha-value> )',
    secondary: 'hsla(var(--secondary), <alpha-value> )',

    gray: {
      DEFAULT: 'hsla(var(--gray-200), <alpha-value> )',
      50: 'hsla(var(--gray-50), <alpha-value> )',
      100: 'hsla(var(--gray-100), <alpha-value> )',
      200: 'hsla(var(--gray-200), <alpha-value> )',
      300: 'hsla(var(--gray-300), <alpha-value> )',
      400: 'hsla(var(--gray-400), <alpha-value> )',
      500: 'hsla(var(--gray-500), <alpha-value> )',
      600: 'hsla(var(--gray-600), <alpha-value> )',
      700: 'hsla(var(--gray-700), <alpha-value> )',
      800: 'hsla(var(--gray-800), <alpha-value> )',
      900: 'hsla(var(--gray-900), <alpha-value> )',
    },
    amber: colors.amber,
    emerald: colors.emerald,
    violet: colors.violet,
    red: colors.red,
    neutral: colors.neutral,
    black: colors.black,
    white: colors.white,

    current: 'currentColor',
    transparent: 'transparent',
  },
  fontFamily: {
    sans: 'var(--font-en-us)',
    monospace: 'var(--font-monospace)',
    author: 'Author-Variable',
    worksans: 'WorkSans-Variable',
    inter: 'Inter-Variable',
  },
  borderRadius: {
    none: 'var(--rounded-none)',
    xxs: 'var(--rounded-xxs)',
    xs: 'var(--rounded-xs)',
    sm: 'var(--rounded-sm)',
    DEFAULT: 'var(--rounded)',
    lg: 'var(--rounded-lg)',
    xl: 'var(--rounded-xl)',
    '2xl': 'var(--rounded-2xl)',
    '3xl': 'var(--rounded-3xl)',
    full: 'var(--rounded-full)',
  },
  extend: {
    borderColor: {
      DEFAULT: 'var(--light-200)',
    },
    colors: {
      body: 'hsla(var(--body), <alpha-value>)',
      'body-invert': 'hsla(var(--body-invert), <alpha-value>)',
      block: 'hsla(var(--block), <alpha-value>)',
      'fg-dynamic': 'hsla(var(--foreground-dynamic), <alpha-value> )',
      'bg-dynamic': 'hsla(var(--background-dynamic), <alpha-value> )',
      'primary-invert': 'hsla(var(--primary-invert), <alpha-value>)',
      'fade-25': 'var(--fade-25)',
      'fade-50': 'var(--fade-50)',
      'fade-100': 'var(--fade-100)',
      'fade-200': 'var(--fade-200)',
      'fade-300': 'var(--fade-300)',
      'light-50': 'var(--light-50)',
      'light-100': 'var(--light-100)',
      'light-200': 'var(--light-200)',
      'light-300': 'var(--light-300)',
      'light-400': 'var(--light-400)',
      'light-500': 'var(--light-500)',
    },
    opacity: {
      1: '.01',
      2: '.02',
      3: '.03',
      4: '.04',
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    borderWidth: {
      3: '3px',
    },
    borderRadius: {
      inherit: 'inherit',
    },
    spacing: {
      '2px': '2px',
      '3px': '3px',
      0.75: '0.188rem', // 3px
      1.25: '0.313rem', // 5px
      1.75: '0.438rem', // 7px
      2.25: '0.563rem', // 9px
      3.75: '0.938rem', // 15px
      4.5: '1.125rem', // 18px
      5.5: '1.375rem', // 22px
      6.5: '1.625rem', // 26px
      7.5: '1.875rem', // 30px
      8.5: '2.125rem', // 34px
      9.5: '2.375rem', // 38px
    },
    padding: {
      inherit: 'inherit',
    },
    width: {
      inherit: 'inherit',
      xl: 'var(--spacing-xl)',
      lg: 'var(--spacing-lg)',
      md: 'var(--spacing-md)',
      sm: 'var(--spacing-sm)',
      xs: 'var(--spacing-xs)',
      xxs: 'var(--spacing-xxs)',
    },
    height: {
      inherit: 'inherit',
      xl: 'var(--spacing-xl)',
      lg: 'var(--spacing-lg)',
      md: 'var(--spacing-md)',
      sm: 'var(--spacing-sm)',
      xs: 'var(--spacing-xs)',
      xxs: 'var(--spacing-xxs)',
    },
    minWidth: {
      inherit: 'inherit',
      xl: 'var(--spacing-xl)',
      lg: 'var(--spacing-lg)',
      md: 'var(--spacing-md)',
      sm: 'var(--spacing-sm)',
      xs: 'var(--spacing-xs)',
      xxs: 'var(--spacing-xxs)',
      '2px': '2px',
      '3px': '3px',
      1: '0.25rem',
      1.25: '0.313rem', // 5px
      1.5: '0.375rem',
      1.75: '0.438rem', // 7px
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      4.5: '1.125rem', // 18px
      5: '1.25rem',
      5.5: '1.375rem', // 22px
      6: '1.5rem',
      6.5: '1.625rem', // 26px
      7: '1.75rem',
      7.5: '1.875rem', // 30px
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
    },
    minHeight: {
      inherit: 'inherit',
      xl: 'var(--spacing-xl)',
      lg: 'var(--spacing-lg)',
      md: 'var(--spacing-md)',
      sm: 'var(--spacing-sm)',
      xs: 'var(--spacing-xs)',
      xxs: 'var(--spacing-xxs)',
      0.75: '0.188rem', // 3px
      1: '0.25rem',
      1.25: '0.313rem', // 5px
      1.5: '0.375rem',
      1.75: '0.438rem', // 7px
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      4.5: '1.125rem', // 18px
      5: '1.25rem',
      5.5: '1.375rem', // 22px
      6: '1.5rem',
      6.5: '1.625rem', // 26px
      7: '1.75rem',
      7.5: '1.875rem', // 30px
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
    },
    maxWidth: {
      16: '4rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
      80: '20rem',
      96: '24rem',
    },
    maxHeight: {
      inherit: 'inherit',
    },
    gap: {
      inherit: 'inherit',
    },
    fontSize: {
      xxs: ['0.625rem', { lineHeight: '1rem' }],
    },
    zIndex: {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      fixed: '700',
      backdrop: '800',
      modal: '810',
      dropdown: '820',
      popper: '900',
      tooltip: '1000',
      notification: '2000',
    },
    keyframes: {
      'countdown-circle': {
        '100%': {
          transform: 'rotate(180deg)',
        },
      },
      'countdown-time': {
        '0%': { padding: 0 },
        '100%': { padding: 0 },
      },
      revolving: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(calc(var(--transform) / -2))' },
      },
    },
    animation: {
      'countdown-circle': 'countdown-circle linear both',
      'countdown-time': 'countdown-time linear 1',
      revolving: 'revolving linear infinite',
    },
  },
};
