import { FormattedMessage } from 'react-intl';
import { Element } from 'iconsax-react'; // Updated icon import
const icons = {
  tabIcon: Element // Updated to the new icon
};

const MasterTab = {
  id: 'masterTab',
  title: <FormattedMessage id="Manage Master" />,
  type: 'group',
  url: '/mastertab',
  icon: icons.tabIcon
};

export default MasterTab;
