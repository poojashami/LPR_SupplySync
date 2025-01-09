import { FormattedMessage } from 'react-intl';
import LocalMallIcon from '@mui/icons-material/LocalMall';
const icons = {
  LocalMallIcon: LocalMallIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const Treasury = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'treasury',
      title: <FormattedMessage id="Treasury" />,
      type: 'collapse',
      icon: icons.LocalMallIcon,
      children: [
        {
          id: 'treasury',
          title: <FormattedMessage id="Payment" />,
          type: 'item',
          url: '/treasury/payment',
          target: false
        },
        {
          id: 'treasury',
          title: <FormattedMessage id="Approve" />,
          type: 'item',
          url: '/treasury/approve',
          target: false
        }
      ]
    }
  ]
};

export default Treasury;
