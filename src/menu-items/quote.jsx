import { FormattedMessage } from 'react-intl';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const icons = {
  Quote_Icon: AttachMoneyIcon
};

const Quote_Menu = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'quotecreate',
      title: <FormattedMessage id="Quotation" />,
      type: 'collapse',
      icon: icons.Quote_Icon,
      children: [
        {
          id: 'quote_create',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/quote/create',
          target: false
        },
        ,
        // {
        //   id: 'quote_compare',
        //   title: <FormattedMessage id="Compare" />,
        //   type: 'item',
        //   url: '/quote/compare',
        //   target: false
        // },
        // {
        //   id: 'quote_approve',
        //   title: <FormattedMessage id="Approve" />,
        //   type: 'item',
        //   url: '/quote/approve',
        //   target: false
        // },
        {
          id: 'quote_view',
          title: <FormattedMessage id="View" />,
          type: 'item',
          url: '/quote/view',
          target: false
        }
      ]
    }
  ]
};

export default Quote_Menu;
