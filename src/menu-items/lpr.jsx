import { FormattedMessage } from 'react-intl';
import ListAltIcon from '@mui/icons-material/ListAlt';

const icons = {
  LPR_Icon: ListAltIcon
};

const LPR = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'lpr',
      title: <FormattedMessage id="LPR" />,
      type: 'collapse',
      icon: icons.LPR_Icon,
      children: [
        {
          id: 'create_lpr',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/lpr/create',
          target: false
        },
        {
          id: 'approve_lpr',
          title: <FormattedMessage id="Approve" />,
          type: 'item',
          url: '/lpr/approve',
          target: false
        },
        {
          id: 'view_lpr',
          title: <FormattedMessage id="View" />,
          type: 'item',
          url: '/lpr/view',
          target: false
        }
      ]
    }
  ]
};

export default LPR;
