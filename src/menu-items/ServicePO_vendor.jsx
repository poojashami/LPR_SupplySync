import { FormattedMessage } from 'react-intl';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

const icons = {
  MoveToInboxIcon: MoveToInboxIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const ServicePO = {
  id: 'group-pages',
  //title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'service_po',
      title: <FormattedMessage id="Service PO" />,
      type: 'collapse',
      icon: icons.MoveToInboxIcon,
      children: [
        {
          id: 'gen_quote',
          title: <FormattedMessage id="Generate Quotation" />,
          type: 'item',
          url: '/service/po/quotation',
          target: false
        },
        {
          id: 'quote_list',
          title: <FormattedMessage id="Quotation List" />,
          type: 'item',
          url: '/service/po/quotation/view',
          target: false
        },
        {
          id: 'pur_order_list',
          title: <FormattedMessage id=" Purchase Order List" />,
          type: 'item',
          url: '/service/po/list',
          target: false
        },
        {
          id: 'po_accept',
          title: <FormattedMessage id="PO Acceptance" />,
          type: 'item',
          url: '/service/po/acceptance_list',
          target: false
        }
      ]
    }
  ]
};

export default ServicePO;
