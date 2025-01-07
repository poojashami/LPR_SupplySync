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
          id: 'po_accept',
          title: <FormattedMessage id="PO Acceptance" />,
          type: 'item',
          url: '/po/accept',
          target: false
        },
        {
          id: 'shipping_advise',
          title: <FormattedMessage id="Shipment Advise" />,
          type: 'item',
          url: '/po/shipment/advice',
          target: false
        }
      ]
    }
  ]
};

export default po_page;
