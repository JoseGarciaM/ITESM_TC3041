const colors = require('tailwindcss/colors');

module.exports = {
  important: true,
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      's': '640px',
      'm': '767px',
      'l': '992px',
      'xl': '1024px',
      'xxl': '1280px',
      'xxxl': '1536px',
    },
    fontFamily: {
      sans: [
        'Inter',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    extend: {
      zIndex: {
        '-20': '-20',
        '-10': '-10',
        '100': '100',
        '110': '110',
        '120': '120',
        '130': '130',
        '140': '140',
        '150': '150',
      },
      scale: {
        '0': '0',
        '25': '.25',
        '30': '.30',
        '40': '.40',
        '60': '.60',
      },
      gridTemplateColumns: {
        '5-auto': 'repeat(5, minmax(0, auto))',
      },
      transitionDuration: {
        '0': '0ms',
      },
      transitionDelay: {
        '0': '0ms',
      },
    },
  },
  variants: {
    extend: {
      visibility: ['hover', 'group-hover'],
    },
  },
  plugins: [
    require('precss'),
    require('@tailwindcss/typography'),
    require('tailwindcss-padding-safe')(),
    require('tailwindcss-margin-safe')(),
    require('tailwindcss-font-inter')({
      importFontFace: false,
    }),
  ],
};
