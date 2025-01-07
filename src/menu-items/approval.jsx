import { FormattedMessage } from 'react-intl';

// assets
import { MessageProgramming } from 'iconsax-react';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
// icons
const icons = {
  maintenance: MessageProgramming,
  PlaylistAddCheckCircleIcon: PlaylistAddCheckCircleIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

// const ApprovalPage = {
//   id: 'group-pages',
//   type: 'group',
//   children: [
//     {
//       id: 'maintenance',
//       title: <FormattedMessage id="Approvals" />,
//       type: 'collapse',
//       icon: icons.PlaylistAddCheckCircleIcon,
//       children: [
//         {
//           id: 'pending',
//           title: <FormattedMessage id="Pending" />,
//           type: 'item',
//           url: '/approval/pending',
//           target: false
//         }
//       ]
//     }
//   ]
// };

const ApprovalPage = {
  id: 'Job Card',
  title: <FormattedMessage id="Job Card" />,
  type: 'group',
  url: '/approval/pending',
  icon: icons.PlaylistAddCheckCircleIcon
};

export default ApprovalPage;
