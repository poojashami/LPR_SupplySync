import { FormattedMessage } from 'react-intl';
import { Home } from 'iconsax-react';
const icons = {
  tabIcon: Home
};

const KnockMenu = {
  id: 'knockof',
  title: <FormattedMessage id="Knock Off" />,
  type: 'group',
  url: '/knockof',
  icon: icons.tabIcon
};

export default KnockMenu;
