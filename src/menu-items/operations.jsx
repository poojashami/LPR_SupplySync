import { FormattedMessage } from 'react-intl';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'; // Updated icon import
const icons = {
  
  OperationsIcon: SettingsApplicationsIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const operations = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'operations',
      title: <FormattedMessage id="Operations" />,
      type: 'collapse',
      icon: icons.OperationsIcon,
      children: [
        // {
        //   id: 'agent',
        //   title: <FormattedMessage id="Agent" />,
        //   type: 'item',
        //   url: '/operations/agent',
        //   target: false
        // },
        {
          id: 'assessment',
          title: <FormattedMessage id="Assessment" />,
          type: 'item',
          url: '/operations/assessment',
          target: false
        },
        {
          id: 'nafdac',
          title: <FormattedMessage id="NAFDAC" />,
          type: 'item',
          url: '/operations/nafdac',
          target: false
        },
        {
          id: 'shipping_operation',
          title: <FormattedMessage id="Shipping" />,
          type: 'item',
          url: '/operations/shipping',
          target: false
        },
        // {
        //   id: 'terminal_operation',
        //   title: <FormattedMessage id="Terminal" />,
        //   type: 'item',
        //   url: '/operations/terminal/operation',
        //   target: false
        // },
        {
          id: 'CustomClearance',
          title: <FormattedMessage id="Custom Clearing" />,
          type: 'item',
          url: '/custom-clearance',
          target: false
        },
        {
          id: 'son',
          title: <FormattedMessage id="SON" />,
          type: 'item',
          url: '/operations/son',
          target: false
        },
        {
          id: 'transport_operation',
          title: <FormattedMessage id="Transport" />,
          type: 'item',
          url: '/operations/transport/operation',
          target: false
        },
        {
          id: 'OtherGovtCharges',
          title: <FormattedMessage id="Other Govt Charges" />,
          type: 'item',
          url: '/postshipmemt/other/govt/charges',
          target: false
        },
        {
          id: 'govt_Charges',
          title: <FormattedMessage id="Other Charges #" />,
          type: 'item',
          url: '/operations/govt/Charges',
          target: false
        },
        // {
        //   id: 'custom_operation',
        //   title: <FormattedMessage id="Custom" />,
        //   type: 'item',
        //   url: '/operations/custom/operation',
        //   target: false
        // },
        {
          id: 'container_tracking',
          title: <FormattedMessage id="Container Tracking" />,
          type: 'item',
          url: '/operations/container/tracking',
          target: false
        },
        {
          id: 'exchange_controll',
          title: <FormattedMessage id="Exchange Control Doc (ECD)" />,
          type: 'item',
          url: '/exchange/controll',
          target: false
        },
        // {
        //   id: 'other_charges',
        //   title: <FormattedMessage id="Other Charges" />,
        //   type: 'item',
        //   url: '/operations/other/charges',
        //   target: false
        // },
        // {
        //   id: 'inward',
        //   title: <FormattedMessage id="Inward" />,
        //   type: 'item',
        //   url: '/operations/inward',
        //   target: false
        // },
        // {
        //   id: 'outward',
        //   title: <FormattedMessage id="Outward" />,
        //   type: 'item',
        //   url: '/operations/outward',
        //   target: false
        // },
      ]
    }
  ]
};

export default operations;
