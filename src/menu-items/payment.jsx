import { FormattedMessage } from 'react-intl';
import PaymentsIcon from '@mui/icons-material/Payments';

const icons = {
  PaymentsIcon: PaymentsIcon
};

const paymentPage = {
  id: 'payment',
  title: <FormattedMessage id="Payment" />,
  type: 'group',
  url: '/payment',
  icon: icons.PaymentsIcon
};

export default paymentPage;
