import { FormattedMessage } from 'react-intl';
import { Home } from 'iconsax-react';
const icons = {
  tabIcon: Home
};

const BIDMenu = {
  id: 'bid',
  title: <FormattedMessage id="BID" />,
  type: 'group',
  url: '/bid',
  icon: icons.tabIcon
};

export default BIDMenu;
