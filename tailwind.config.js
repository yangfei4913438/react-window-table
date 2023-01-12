const withMT = require('@material-tailwind/react/utils/withMT');

const widthHeightConfig = {
  inherit: 'inherit',
  '2px': '2px',
  '3px': '3px',
};

module.exports = withMT({
  content: ['./src/**/*.@(js|jsx|ts|tsx|html)'],
  safelist: [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-7',
    'col-span-8',
    'col-span-9',
    'col-span-10',
    'col-span-11',
    'col-span-12',
  ],
  theme: {
    fontFamily: {
      en: ['inter', 'Myriad Set Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      cn: ['PingFang SC', 'Helvetica Neue', 'Helvetica', 'STHeitiSC-Light', 'Arial', 'sans-serif'],
      tw: ['MHei', 'Helvetica Neue', 'Helvetica', 'Arial', 'Verdana'],
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
      '3xl': '1800px',
      // => @media (min-width: 1800px) { ... }
    },
    extend: {
      width: widthHeightConfig,
      minWidth: widthHeightConfig,
      maxWidth: widthHeightConfig,
      height: widthHeightConfig,
      minHeight: widthHeightConfig,
      maxHeight: widthHeightConfig,
    },
  },
});
