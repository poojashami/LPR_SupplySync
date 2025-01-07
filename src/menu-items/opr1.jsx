import { FormattedMessage } from 'react-intl';
import ImportExportIcon from '@mui/icons-material/ImportExport';
const icons = {
  LPR_RFQ_ICON: ImportExportIcon
};

const LPR_RFQ = {
  id: 'lpr-list-for-rfq',
  title: <FormattedMessage id="LPR List for RFQ" />,
  type: 'group',
  url: '/lpr-list-for-rfq',
  icon: icons.LPR_RFQ_ICON
};

export default LPR_RFQ;
