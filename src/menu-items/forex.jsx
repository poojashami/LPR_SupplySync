import { FormattedMessage } from 'react-intl';
import { Home } from 'iconsax-react';
const icons = {
  tabIcon: Home
};

const forexPurchaseMenu = {
  id: 'forex',
  title: <FormattedMessage id="FOREX Purchase" />,
  type: 'group',
  url: '/forex-purchase',
  icon: icons.tabIcon
};

export default forexPurchaseMenu;
