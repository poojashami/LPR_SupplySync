import { FormattedMessage } from 'react-intl';
import { Home } from 'iconsax-react';
const icons = {
  tabIcon: Home
};

const customClearanceMenu = {
  id: 'forex',
  title: <FormattedMessage id="Custom Clearance" />,
  type: 'group',
  url: '/custom-clearance',
  icon: icons.tabIcon
};

export default customClearanceMenu;
