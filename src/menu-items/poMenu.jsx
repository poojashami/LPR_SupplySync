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
          id: 'po_draft',
          title: <FormattedMessage id="Draft" />,
          type: 'item',
          url: '/po/draft',
          target: false
        },
        {
          id: 'po_approve',
          title: <FormattedMessage id="Approve LPO" />,
          type: 'item',
          url: '/po/approve',
          target: false
        },
        {
          id: 'issued_lpo',
          title: <FormattedMessage id="Issued LPO" />,
          type: 'item',
          url: '/po/issued_lpo',
          target: false
        }
        
      ]
    }
  ]
};

export default PO_Menu;
