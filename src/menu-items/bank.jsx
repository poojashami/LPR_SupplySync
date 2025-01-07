import { FormattedMessage } from 'react-intl';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const icons = {
  AccountBalanceIcon: AccountBalanceIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const bank = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'card_dn',
      title: <FormattedMessage id="Bank Charges" />,
      type: 'collapse',
      icon: icons.AccountBalanceIcon,
      children: [
        {
          id: 'buyingHouse',
          title: <FormattedMessage id="Bank Charges BH #" />,
          type: 'item',
          url: '/bankcharges',
          target: false
        },
        {
          id: 'company',
          title: <FormattedMessage id="Bank Charges PH #" />,
          type: 'item',
          url: '/unit',
          target: false
        }
      ]
    }
  ]
};

export default bank;
