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
          id: 'itemlist',
          title: <FormattedMessage id="Generate RFQ" />,
          type: 'item',
          url: '/service/po/rfq',
          target: false
        },
        {
          id: 'rfq_list',
          title: <FormattedMessage id="RFQ List" />,
          type: 'item',
          url: '/service/po/rfq/view',
          target: false
        },
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
        },
        {
          id: 'quotes',
          title: <FormattedMessage id="Create Quote" />,
          type: 'item',
          url: '/service/po/create_quote',
          target: false
        },
        {
          id: 'sea_freight_fcl',
          title: <FormattedMessage id="Sea Freight FCL" />,
          type: 'item',
          url: '/service/po/sea_freight_fcl',
          target: false
        },
        {
          id: 'sea_freight_lcl',
          title: <FormattedMessage id="Sea Freight LCL" />,
          type: 'item',
          url: '/service/po/sea_freight_lcl',
          target: false
        },
        {
          id: 'air_freight',
          title: <FormattedMessage id="Air Freight" />,
          type: 'item',
          url: '/service/po/air_freight',
          target: false
        },
        {
          id: 'quote_com',
          title: <FormattedMessage id="Quote Compare" />,
          type: 'item',
          url: '/service/po/quote_comparision',
          target: false
        }
      ]
    }
  ]
};

export default ServicePO;
