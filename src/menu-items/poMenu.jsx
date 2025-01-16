import { FormattedMessage } from 'react-intl';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const icons = {
  PO_Icon: AttachFileIcon
};

const PO_Menu = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'po_list',
      title: <FormattedMessage id="LPO" />,
      type: 'collapse',
      icon: icons.AttachMoneyIcon,
      children: [
        {
          id: 'po_create',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/po/create',
          target: false
        },
        {
          id: 'po_approve',
          title: <FormattedMessage id="Approve" />,
          type: 'item',
          url: '/po/approve',
          target: false
        },
        {
          id: 'po_view',
          title: <FormattedMessage id="View" />,
          type: 'item',
          url: '/po/view',
          target: false
        },
        {
          id: 'po_req_payemnt',
          title: <FormattedMessage id="Request Payment(Vendor)" />,
          type: 'item',
          url: '/po/request-payment',
          target: false
        }
      ]
    }
  ]
};

export default PO_Menu;
