import { FormattedMessage } from 'react-intl';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const icons = {
  DocumentScannerIcon: DocumentScannerIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const CardDN = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'card_dn',
      title: <FormattedMessage id="CARD / DN" />,
      type: 'collapse',
      icon: icons.DocumentScannerIcon,
      children: [
        {
          id: 'card',
          title: <FormattedMessage id="Card" />,
          type: 'item',
          url: '/card/dn/card',
          target: false
        },
        {
          id: 'debit_note',
          title: <FormattedMessage id="Debit Note" />,
          type: 'item',
          url: '/card/dn/debit/note',
          target: false
        }
      ]
    }
  ]
};

export default CardDN;
