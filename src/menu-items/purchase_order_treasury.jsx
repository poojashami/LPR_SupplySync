import { FormattedMessage } from 'react-intl';
import LocalMallIcon from '@mui/icons-material/LocalMall';
const icons = {
  LocalMallIcon: LocalMallIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const po_page = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'rfq',
      title: <FormattedMessage id="Purchase Order" />,
      type: 'collapse',
      icon: icons.LocalMallIcon,
      children: [
        {
          id: 'treasury',
          title: <FormattedMessage id="Treasury" />,
          type: 'item',
          url: '/po/treasury',
          target: false
        }
      ]
    }
  ]
};

export default po_page;
