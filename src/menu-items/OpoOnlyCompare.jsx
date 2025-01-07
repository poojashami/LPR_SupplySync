import { FormattedMessage } from 'react-intl';
import PublicIcon from '@mui/icons-material/Public';
const icons = {
  opr1: PublicIcon
};

const OPO = {
  id: 'group-pages',
  // title: <FormattedMessage id="OPO" />,
  type: 'group',
  // url: 'opo/list',
  children: [
    {
      id: 'opo',
      title: <FormattedMessage id="OPO" />,
      type: 'collapse',
      icon: icons.opr1,
      children: [
        {
          id: 'oprlist',
          title: <FormattedMessage id="Generate OPO" />,
          type: 'item',
          url: 'opo/list',
          target: false
        },
        {
          id: 'opoViewList',
          title: <FormattedMessage id="OPO List" />,
          type: 'item',
          url: 'opo/opo_view_list',
          target: false
        }
      ]
    }
  ]
};

export default OPO;
