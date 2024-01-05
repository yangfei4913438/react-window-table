const distance = {
  inherit: 'inherit',
  d2: '2px',
  d3: '3px',
  d4: '4px',
  'screen-10': '10%',
  'screen-20': '20%',
  'screen-30': '30%',
  'screen-40': '40%',
  'screen-50': '50%',
  'screen-60': '60%',
  'screen-70': '70%',
  'screen-80': '80%',
  'screen-90': '90%',
};

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./{stories,lib,dev,demo}/**/*.{js,ts,jsx,tsx,mdx,scss}'],
  safelist: [],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '2rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundColor: {
        body: 'var(--background-body)',
        current: 'currentColor',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      textColor: {
        body: 'var(--text-body)',
        'body-dark': 'var(--text-body-dark)',
        secondary: 'var(--text-secondary)',
        current: 'currentColor',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      fontSize: {
        small: '12px',
        normal: '14px',
        large: '18px',
      },
      width: distance,
      minWidth: distance,
      maxWidth: distance,
      height: distance,
      minHeight: distance,
      maxHeight: distance,
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
      },
    },
  },
  corePlugins: {},
  plugins: [require('tailwindcss-animate')],
};

module.exports = config;
