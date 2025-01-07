import { FormattedMessage } from 'react-intl';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
const icons = {
  AssignmentIcon: AssignmentIcon,
  LocalShippingIcon: LocalShippingIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const postShipment = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'postshipmemt',
      title: <FormattedMessage id="Post Shipment" />,
      type: 'collapse',
      icon: icons.LocalShippingIcon,
      children: [
        {
          id: 'shipping',
          title: <FormattedMessage id="Shipping Entry" />,
          type: 'item',
          url: '/postshipmemt/shipping',
          target: false
        },
        {
          id: 'soncap',
          title: <FormattedMessage id="SONCAP #" />,
          type: 'item',
          url: '/postshipmemt/soncap',
          target: false
        },
        {
          id: 'nafdac',
          title: <FormattedMessage id="NAFDAC #" />,
          type: 'item',
          url: '/postshipmemt/par',
          target: false
        },
        {
          id: 'paar',
          title: <FormattedMessage id="PAAR" />,
          type: 'item',
          url: '/postshipmemt/paar',
          target: false
        },
        {
          id: 'paar',
          title: <FormattedMessage id="Duty Payment #" />,
          type: 'item',
          url: '/postshipmemt/paa',
          target: false
        },
        {
          id: 'paar',
          title: <FormattedMessage id="Operational Payment #" />,
          type: 'item',
          url: '/postshipmemt/paa',
          target: false
        },
      ]
    }
  ]
};

export default postShipment;
