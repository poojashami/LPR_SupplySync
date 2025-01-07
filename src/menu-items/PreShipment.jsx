import { FormattedMessage } from 'react-intl';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';

const icons = {
  AssignmentIcon: AssignmentIcon,
  DescriptionIcon: DescriptionIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const PreShipment = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'PreShipment',
      title: <FormattedMessage id="Pre Shipment" />,
      type: 'collapse',
      icon: icons.DescriptionIcon,
      children: [
        {
          id: 'sonpc',
          title: <FormattedMessage id="SON PC" />,
          type: 'item',
          url: '/pfi/sonpc',
          target: false
        },
        {
          id: 'nafdac',
          title: <FormattedMessage id="NAFDAC Permit" />,
          type: 'item',
          url: '/pfi/nafdac',
          target: false
        },
        {
          id: 'insurance',
          title: <FormattedMessage id="Insurance" />,
          type: 'item',
          url: '/pfi/insurance',
          target: false
        },
        {
          id: 'formm',
          title: <FormattedMessage id="Form M" />,
          type: 'item',
          url: '/pfi/formm',
          target: false
        },
        {
          id: 'lc',
          title: <FormattedMessage id="LC" />,
          type: 'item',
          url: '/pfi/lc',
          target: false
        },
        {
          id: 'lc',
          title: <FormattedMessage id="Discepancy" />,
          type: 'item',
          url: '/pfi/discepancy',
          target: false
        }
      ]
    }
  ]
};

export default PreShipment;
