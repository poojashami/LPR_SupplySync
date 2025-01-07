import { FormattedMessage } from 'react-intl';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';

const icons = {
  AssignmentIcon: AssignmentIcon,
  DescriptionIcon: DescriptionIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const Pfi = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'pfi',
      title: <FormattedMessage id="PFI" />,
      type: 'collapse',
      icon: icons.DescriptionIcon,
      children: [
        // at BH Level
        {
          id: 'opoViewListPfi',
          title: <FormattedMessage id="Create PFI BH #" />,
          type: 'item',
          url: 'opo/opo_view_list_pfi',
          target: false
        },
        {
          id: 'ListPfi',
          title: <FormattedMessage id="View PFI BH #" />,
          type: 'item',
          url: 'opo/list_pfi',
          target: false
        },
        // at PH Level
        {
          id: 'draftpfi',
          title: <FormattedMessage id="Draft PFI PH #" />,
          type: 'item',
          url: '/pfi/draftpfi',
          target: false
        },

        // In direct case
        {
          id: 'directpfiBh',
          title: <FormattedMessage id="Direct PFI BH #" />,
          type: 'item',
          url: '/pfi/draftpfi',
          target: false
        },
        {
          id: 'directpfiPh',
          title: <FormattedMessage id="Direct PFI PH #" />,
          type: 'item',
          url: '/pfi/draftpfi',
          target: false
        },



        {
          id: 'pfi',
          title: <FormattedMessage id="PFI PH #" />,
          type: 'item',
          url: '/pfi',
          target: false
        },
        // {
        //   id: 'sonpc',
        //   title: <FormattedMessage id="SON PC" />,
        //   type: 'item',
        //   url: '/pfi/sonpc',
        //   target: false
        // },
        // {
        //   id: 'nafdac',
        //   title: <FormattedMessage id="NAFDAC Permit" />,
        //   type: 'item',
        //   url: '/pfi/nafdac',
        //   target: false
        // },
        // {
        //   id: 'insurance',
        //   title: <FormattedMessage id="Insurance" />,
        //   type: 'item',
        //   url: '/pfi/insurance',
        //   target: false
        // },
        // {
        //   id: 'formm',
        //   title: <FormattedMessage id="Form M" />,
        //   type: 'item',
        //   url: '/pfi/formm',
        //   target: false
        // },
        // {
        //   id: 'lc',
        //   title: <FormattedMessage id="LC" />,
        //   type: 'item',
        //   url: '/pfi/lc',
        //   target: false
        // }
      ]
    }
  ]
};

export default Pfi;
