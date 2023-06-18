import { withActions } from '@storybook/addon-actions/decorator';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Za-z].*', handles: ['click'] },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withActions],
};

export default preview;
