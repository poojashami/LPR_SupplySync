import { FormattedMessage } from 'react-intl';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const icons = {
  quotation: RequestQuoteIcon
};

const rfq_page = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'rfq',
      title: <FormattedMessage id="RFQ" />,
      type: 'collapse',
      icon: icons.quotation,
      children: [
        {
          id: 'create_rfq',
          title: <FormattedMessage id="Create" />,
          type: 'item',
          url: '/rfq/rfqlist',
          target: false
        },
        {
          id: 'view_rfq',
          title: <FormattedMessage id="View" />,
          type: 'item',
          url: '/rfq/rfqview',
          target: false
        }
      ]
    }
  ]
};

export default rfq_page;
