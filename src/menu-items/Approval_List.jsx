import { FormattedMessage } from 'react-intl';
import PublicIcon from '@mui/icons-material/Public';
const icons = {
  opr1: PublicIcon
};

const approval_list = {
  id: 'approval_list',
  title: <FormattedMessage id="Approval List" />,
  type: 'group',
  url: 'opo/opo_list',
  icon: icons.opr1
};

export default approval_list;
