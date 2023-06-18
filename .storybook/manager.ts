import { addons } from '@storybook/manager-api';

addons.setConfig({
  // Show story component as full screen
  isFullscreen: false,
  // Display panel that shows a list of stories
  showNav: true,
  // Display panel that shows addon configurations
  showPanel: true,
  // Where to show the addon panel (bottom or right)
  panelPosition: 'bottom',
  // Enable/disable shortcuts
  enableShortcuts: false,
  // Show/hide toolbar
  showToolbar: false,
  // Storybook Theme, see next section
  theme: undefined,
  // Id to select an addon panel
  selectedPanel: undefined,
  // Select the default active tab on Mobile
  initialActive: 'canvas',
});
