import { FormattedMessage } from 'react-intl';
import { DocumentText } from 'iconsax-react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
const icons = {
  quotationPage: DocumentText,
  AttachMoneyIcon: AttachMoneyIcon
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //
const quotation = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'maintenance',
      title: <FormattedMessage id="Quotation" />,
      type: 'collapse',
      icon: icons.AttachMoneyIcon,
      children: [
        {
          id: 'ItemCreate',
          title: <FormattedMessage id="Create Quotation" />,
          type: 'item',
          url: '/quotation/create',
          target: false
        },
        {
          id: 'ItemView',
          title: <FormattedMessage id="View Quotation" />,
          type: 'item',
          url: '/quotation/view',
          target: false
        },
        {
          id: 'oprlist',
          title: <FormattedMessage id="Compare Quotations #" />,
          type: 'item',
          url: 'opo/list',
          target: false
        },
        // ,
        // {
        //   id: 'Compare',
        //   title: <FormattedMessage id="Comparision" />,
        //   type: 'item',
        //   url: '/comparision',
        //   target: false
        // }
      ]
    }
  ]
};

export default quotation;
