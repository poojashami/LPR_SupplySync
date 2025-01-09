import { FormattedMessage } from 'react-intl';
import BuildIcon from '@mui/icons-material/Build';

const icons = {
  LocalMallIcon: BuildIcon
};

const ServicesPO = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'services',
      title: <FormattedMessage id="Service PO" />,
      type: 'collapse',
      icon: icons.LocalMallIcon,
      children: [
        {
          id: 'services',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/services/payment',
          target: false
        },
        {
          id: 'services',
          title: <FormattedMessage id="Payment Request" />,
          type: 'item',
          url: '/services/approve',
          target: false
        }
      ]
    }
  ]
};

export default ServicesPO;
