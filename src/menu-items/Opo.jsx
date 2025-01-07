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
        // {
        //   id: 'oprlist',
        //   title: <FormattedMessage id="Comparison OPO" />,
        //   type: 'item',
        //   url: 'opo/generate_list',
        //   target: false
        // },
        {
          id: 'compare_list',
          title: <FormattedMessage id="Create OPO" />,
          type: 'item',
          url: 'opo/list',
          target: false
        },
        {
          id: 'opoViewList',
          title: <FormattedMessage id="Approve OPO #" />,
          type: 'item',
          url: 'opo/opo_view_list_p',
          target: false
        },
        {
          id: 'opoList',
          title: <FormattedMessage id="View OPO" />,
          type: 'item',
          url: 'opo/view',
          target: false
        },
        // {
        //   id: 'opoViewListPfi',
        //   title: <FormattedMessage id="Generate PFI" />,
        //   type: 'item',
        //   url: 'opo/opo_view_list_pfi',
        //   target: false
        // },
        // {
        //   id: 'ListPfi',
        //   title: <FormattedMessage id="PFI List" />,
        //   type: 'item',
        //   url: 'opo/list_pfi',
        //   target: false
        // }
      ]
    }
  ]
};

export default OPO;
