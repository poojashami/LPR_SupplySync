import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import HouseIcon from '@mui/icons-material/House';
import StraightenIcon from '@mui/icons-material/Straighten';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import DomainIcon from '@mui/icons-material/Domain';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { useTheme } from '@mui/material/styles';
import getColors from '../../utils/getColors';
import PublicIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import VerifiedIcon from '@mui/icons-material/Verified';
import TimelineIcon from '@mui/icons-material/Timeline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InventoryIcon from '@mui/icons-material/Inventory';
import CommuteIcon from '@mui/icons-material/Commute';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const MasterTab = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Get the theme
  const colors = getColors(theme);

  const boxesUppper = [
    {
      icon: <AccountCircleIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'User',
      path: '/master/users'
    },
    {
      icon: <SettingsIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Item',
      path: '/master/items'
    },
    {
      icon: <StoreIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Vendor',
      path: '/master/vendor'
    },
    {
      icon: <HouseIcon sx={{ color: colors.warning, fontSize: 40 }} />,
      label: 'Buying House',
      path: '/buyingHouse'
    },
    {
      icon: <DomainIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Company',
      path: '/company'
    },
    {
      icon: <AssignmentTurnedInIcon sx={{ color: colors.info, fontSize: 40 }} />,
      label: 'Delivery Terms',
      path: '/deleiveryTerms'
    },
    {
      icon: <CorporateFareIcon sx={{ color: colors.warning, fontSize: 40 }} />,
      label: 'Department',
      path: '/department'
    },
    {
      icon: <WorkIcon sx={{ color: colors.error, fontSize: 40 }} />,
      label: 'Designation',
      path: '/designation'
    },
    {
      icon: <BusinessCenterIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'Division',
      path: '/division'
    },
    {
      icon: <PaymentIcon sx={{ color: colors.info, fontSize: 40 }} />,
      label: 'Payment Type',
      path: '/paymentType'
    },

    {
      icon: <ModeOfTravelIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'Shipment Mode',
      path: '/shipmentmode'
    },
    {
      icon: <BusinessIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Vertical',
      path: '/vertical'
    },
    {
      icon: <VerifiedIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'NAFDAC',
      path: '/permit/pending'
    },

    {
      icon: <AttachMoneyIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Expense Charges',
      path: '/expenseCharges'
    },
    {
      icon: <InventoryIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Container Type',
      path: '/containerType'
    },
    {
      icon: <DirectionsBoatIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Shipment Advise',
      path: '/shipmentAdviseContainerType'
    },
    {
      icon: <AlarmOnIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Operation Lapse',
      path: '/transportOperationLapse'
    },
    {
      icon: <CommuteIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Payment Transport',
      path: '/paymentTypeTrans'
    },
    {
      icon: <PublicIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Country',
      path: '/countryMaster'
    },
    {
      icon: <MapIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'State',
      path: '/stateMaster'
    },
    {
      icon: <LocationCityIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'City',
      path: '/cityMaster'
    }
  ];
  const boxesBottom = [
    {
      icon: <StraightenIcon sx={{ color: colors.error, fontSize: 40 }} />,
      label: 'UOM',
      path: '/uom'
    },
    {
      icon: <GroupsIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Group',
      path: '/group'
    },
    {
      icon: <GroupsIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Sub Group',
      path: '/subgroup'
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ color: colors.warning, fontSize: 40 }} />,
      label: 'Role',
      path: '/role'
    },
    {
      icon: <BookmarkIcon sx={{ color: colors.error, fontSize: 40 }} />,
      label: 'Series Master',
      path: '/seriesMaster'
    },
    {
      icon: <AccountTreeIcon sx={{ color: colors.info, fontSize: 40 }} />,
      label: 'Branch',
      path: '/branch'
    },
    {
      icon: <CategoryIcon sx={{ color: colors.primary, fontSize: 40 }} />,
      label: 'Category',
      path: '/category'
    },
    {
      icon: <CurrencyExchangeIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Currency',
      path: '/currency'
    },
    {
      icon: <TimelineIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Delivery Timeline',
      path: '/deliveryTimeLine'
    },
    {
      icon: <AccessTimeIcon sx={{ color: colors.success, fontSize: 40 }} />,
      label: 'Lead Time',
      path: '/leadTime'
    },
    {
      icon: <ReceiptIcon sx={{ color: colors.info, fontSize: 40 }} />,
      label: 'Payment Terms',
      path: '/paymentTerms'
    },
    {
      icon: <GroupsIcon sx={{ color: colors.secondary, fontSize: 40 }} />,
      label: 'Status Master',
      path: '/statusmaster'
    }
  ];
  // Sorting the boxes array alphabetically by label
  boxesUppper.sort((a, b) => a.label.localeCompare(b.label));

  const handleViewClick = (path) => {
    navigate(path);
  };

  return (
    <MainCard title="Manage Master">
      <Grid container spacing={3}>
        {boxesUppper.map((box, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Box
              height={100}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="5px"
              fontWeight={600}
              sx={{ border: '1px solid', borderColor: '#A1BCDB', cursor: 'pointer' }}
              onClick={() => handleViewClick(box.path)}
            >
              <Box sx={{ marginBottom: 1 }}>{box.icon}</Box>
              {box.label}
            </Box>
          </Grid>
        ))}
      </Grid>
      <hr style={{ border: '1px solid #A1BCDB', margin: '16px 0' }} />
      <Grid container spacing={3}>
        {boxesBottom.map((box, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Box
              height={100}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="5px"
              fontWeight={600}
              sx={{ border: '1px solid', borderColor: '#A1BCDB', cursor: 'pointer' }}
              onClick={() => handleViewClick(box.path)}
            >
              <Box sx={{ marginBottom: 1 }}>{box.icon}</Box>
              {box.label}
            </Box>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

export default MasterTab;
