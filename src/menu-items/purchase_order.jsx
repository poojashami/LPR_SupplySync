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
        // {
        //   id: 'itemlist',
        //   title: <FormattedMessage id="Generate PO" />,
        //   type: 'item',
        //   url: '/po/create',
        //   target: false
        // },
        {
          id: 'opoViewList',
          title: <FormattedMessage id="Create PO" />,
          type: 'item',
          url: 'opo/opo_view_list_po',
          target: false
        },
        {
          id: 'opoViewList',
          title: <FormattedMessage id="Approve PO #" />,
          type: 'item',
          url: 'opo/opo_view_list_p',
          target: false
        },
        {
          id: 'poView',
          title: <FormattedMessage id="View PO" />,
          type: 'item',
          url: '/po/view',
          target: false
        },
        {
          id: 'poAccept',
          title: <FormattedMessage id="PO Acceptance" />,
          type: 'item',
          url: '/po/accept',
          target: false
        },
        {
          id: 'comercialInvoice',
          title: <FormattedMessage id="Purchase Inward #" />,
          type: 'item',
          url: '/po/generate/commercialInvoic',
          target: false
        },
      ]
    }
  ]
};

export default po_page;
