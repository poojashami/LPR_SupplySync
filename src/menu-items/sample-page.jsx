// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import DashboardIcon from '@mui/icons-material/Dashboard';

// type

// icons
const icons = {
  samplePage: DashboardIcon
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const samplePage = {
  id: 'Dashboard',
  title: <FormattedMessage id="Dashboard" />,
  type: 'group',
  url: '/dashboard',
  icon: icons.samplePage
};

export default samplePage;
