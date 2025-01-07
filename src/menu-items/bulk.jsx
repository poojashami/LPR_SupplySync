import { FormattedMessage } from 'react-intl';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const icons = {
  BulkIcon: DashboardCustomizeIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const bulkroute = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'bulk',
      title: <FormattedMessage id="Bulk" />,
      type: 'collapse',
      icon: icons.BulkIcon,
      children: [
        {
          id: 'npausd',
          title: <FormattedMessage id="Prov. NPA USD" />,
          type: 'item',
          url: '/bulk/npa-usd',
          target: false
        },
        {
          id: 'npangn',
          title: <FormattedMessage id="Prov. NPA NGN" />,
          type: 'item',
          url: '/bulk/npa-ngn',
          target: false
        },
        {
          id: 'terminalusd',
          title: <FormattedMessage id="Prov. Bulk Terminal(USD)" />,
          type: 'item',
          url: '/bulk/bulk-terminal-usd',
          target: false
        },
        {
          id: 'terminalngn',
          title: <FormattedMessage id="Prov. Bulk Terminal(NGN)" />,
          type: 'item',
          url: '/bulk/bulk-terminal-ngn',
          target: false
        },
        {
          id: 'sealevy',
          title: <FormattedMessage id="Nimasa Sea Protection Levy" />,
          type: 'item',
          url: '/bulk/nimasa-sea-protection-levy',
          target: false
        },
        {
          id: 'nimasa',
          title: <FormattedMessage id="Nimasa" />,
          type: 'item',
          url: '/bulk/nimasa',
          target: false
        },
        {
          id: 'finalnpausd',
          title: <FormattedMessage id="Final NPA USD" />,
          type: 'item',
          url: '/bulk/final-npa-usd',
          target: false
        },
        {
          id: 'finalnpangn',
          title: <FormattedMessage id="Final NPA NGN" />,
          type: 'item',
          url: '/bulk/final-npa-ngn',
          target: false
        },
        {
          id: 'finalterminalusd',
          title: <FormattedMessage id="Final Bulk Terminal(USD)" />,
          type: 'item',
          url: '/bulk/final-bulk-terminal-usd',
          target: false
        },
        {
          id: 'finalterminalngn',
          title: <FormattedMessage id="Final Bulk Terminal(NGN)" />,
          type: 'item',
          url: '/bulk/final-bulk-terminal-ngn',
          target: false
        }
      ]
    }
  ]
};

export default bulkroute;
