import { FormattedMessage } from 'react-intl';
import ListAltIcon from '@mui/icons-material/ListAlt';

const icons = {
  Grn_Icon: ListAltIcon
};

const GRN_Menu = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'grn',
      title: <FormattedMessage id="GRN" />,
      type: 'collapse',
      icon: icons.Grn_Icon,
      children: [
        {
          id: 'create_grn',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/grn/create',
          target: false
        },

        {
          id: 'view_grn',
          title: <FormattedMessage id="View" />,
          type: 'item',
          url: '/grn/view',
          target: false
        },
        {
          id: 'approve_grn',
          title: <FormattedMessage id="Debit Note / Credit Note" />,
          type: 'item',
          url: '/grn/approve',
          target: false
        },
      ]
    }
  ]
};

export default GRN_Menu;
