// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { MessageProgramming } from 'iconsax-react';
import FlagIcon from '@mui/icons-material/Flag';

// icons
const icons = {
  maintenance: MessageProgramming,
  FlagIcon: FlagIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const masters = {
  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'maintenance',
      title: <FormattedMessage id="Master" />,
      type: 'collapse',
      icon: icons.FlagIcon,
      children: [
        {
          id: 'Vendor',
          title: <FormattedMessage id="Vendor" />,
          type: 'item',
          url: '/master/vendor',
          target: false
        },
        {
          id: 'Users',
          title: <FormattedMessage id="Users" />,
          type: 'item',
          url: '/master/users',
          target: false
        },
        {
          id: 'Items',
          title: <FormattedMessage id="Items" />,
          type: 'item',
          url: '/master/items',
          target: false
        },
        {
          id: 'MasterService',
          title: <FormattedMessage id="Services Master" />,
          type: 'item',
          url: '/master/masterService',
          target: false
        }
      ]
    }
  ]
};

export default masters;
