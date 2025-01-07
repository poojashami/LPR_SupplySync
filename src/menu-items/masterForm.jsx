import { FormattedMessage } from 'react-intl';
import AssignmentIcon from '@mui/icons-material/Assignment';

const icons = {
  AssignmentIcon: AssignmentIcon
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const masterForm = {
  id: 'group-pages',
  type: 'group',
  children: [
    {
      id: 'masterform',
      title: <FormattedMessage id="MasterForm" />,
      type: 'collapse',
      icon: icons.AssignmentIcon,
      children: [
        {
          id: 'branch',
          title: <FormattedMessage id="Branch" />,
          type: 'item',
          url: '/branch',
          target: false
        },
        {
          id: 'buyinghouse',
          title: <FormattedMessage id="Buying House" />,
          type: 'item',
          url: '/buyingHouse',
          target: false
        },
        {
          id: 'uom',
          title: <FormattedMessage id="UOM" />,
          type: 'item',
          url: '/uom',
          target: false
        },
        {
          id: 'category',
          title: <FormattedMessage id="Category" />,
          type: 'item',
          url: '/category',
          target: false
        },
        {
          id: 'company',
          title: <FormattedMessage id="Company" />,
          type: 'item',
          url: '/company',
          target: false
        },
        {
          id: 'currency',
          title: <FormattedMessage id="Currency" />,
          type: 'item',
          url: '/currency',
          target: false
        },
        {
          id: 'deleiveryTerms',
          title: <FormattedMessage id="Deleivery Terms" />,
          type: 'item',
          url: '/deleiveryTerms',
          target: false
        },
        {
          id: 'department',
          title: <FormattedMessage id="Department" />,
          type: 'item',
          url: '/department',
          target: false
        },
        {
          id: 'designation',
          title: <FormattedMessage id="Designation" />,
          type: 'item',
          url: '/designation',
          target: false
        },
        {
          id: 'division',
          title: <FormattedMessage id="Division" />,
          type: 'item',
          url: '/division',
          target: false
        },
        {
          id: 'group',
          title: <FormattedMessage id="Group" />,
          type: 'item',
          url: '/group',
          target: false
        },
        {
          id: 'subgroup',
          title: <FormattedMessage id="Sub Group" />,
          type: 'item',
          url: '/subgroup',
          target: false
        },
        {
          id: 'leadTime',
          title: <FormattedMessage id="Lead Time" />,
          type: 'item',
          url: '/leadTime',
          target: false
        },
        {
          id: 'paymentType',
          title: <FormattedMessage id="Payment Type" />,
          type: 'item',
          url: '/paymentType',
          target: false
        },
        {
          id: 'penaltyTerm',
          title: <FormattedMessage id="Penalty Terms" />,
          type: 'item',
          url: '/penaltyTerm',
          target: false
        },
        {
          id: 'paymentTerms',
          title: <FormattedMessage id="Payment Terms" />,
          type: 'item',
          url: '/paymentTerms',
          target: false
        },
        {
          id: 'role',
          title: <FormattedMessage id="Role" />,
          type: 'item',
          url: '/role',
          target: false
        },
        {
          id: 'seriesMaster',
          title: <FormattedMessage id="Series Master" />,
          type: 'item',
          url: '/seriesMaster',
          target: false
        },
        {
          id: 'shipmentmode',
          title: <FormattedMessage id="Shipment Mode" />,
          type: 'item',
          url: '/shipmentmode',
          target: false
        },
        {
          id: 'statusmaster',
          title: <FormattedMessage id="Status Master" />,
          type: 'item',
          url: '/statusmaster',
          target: false
        },
        {
          id: 'vertical',
          title: <FormattedMessage id="Vertical" />,
          type: 'item',
          url: '/vertical',
          target: false
        },
        {
          id: 'nafdac',
          title: <FormattedMessage id="NAFDAC" />,
          type: 'item',
          url: '/nafdac',
          target: false
        },
        {
          id: 'deliveryTimeLine',
          title: <FormattedMessage id="Delivery TimeLine" />,
          type: 'item',
          url: '/deliveryTimeLine',
          target: false
        },
        {
          id: 'expenseCharges',
          title: <FormattedMessage id="Add Expense Charges" />,
          type: 'item',
          url: '/expenseCharges',
          target: false
        },
        {
          id: 'containerType',
          title: <FormattedMessage id="Container Type" />,
          type: 'item',
          url: '/containerType',
          target: false
        },
        {
          id: 'shipmentAdviseContainertype',
          title: <FormattedMessage id="Shipment Type Container Type" />,
          type: 'item',
          url: '/shipmentAdviseContainerType',
          target: false
        },
        {
          id: 'countryMaster',
          title: <FormattedMessage id="Country" />,
          type: 'item',
          url: '/countryMaster',
          target: false
        },
        {
          id: 'stateMaster',
          title: <FormattedMessage id="State" />,
          type: 'item',
          url: '/stateMaster',
          target: false
        },
        {
          id: 'cityMaster',
          title: <FormattedMessage id="City" />,
          type: 'item',
          url: '/cityMaster',
          target: false
        }
      ]
    }
  ]
};

export default masterForm;
