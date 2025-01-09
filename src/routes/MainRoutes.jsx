import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
const Dashboard = Loadable(lazy(() => import('pages/extra-pages/dashboard')));

import LPRList from 'pages/lpr/LPRList';
import LPRView from 'pages/lpr/LPRView';
import RfqList from 'pages/rfq/RfqList';
import RFQView from 'pages/rfq/RFQView';
import POView from 'pages/po/POView';
import POList from 'pages/po/POList';
import QuoteList from 'pages/quote/QuoteList';
import QuoteView from 'pages/quote/QuoteView';
import QuoteCompare from 'pages/quote/QuoteCompare';
import QuoteApprove from 'pages/quote/QuoteApprove';
import POApprove from 'pages/po/POApprove';
import POReqPayment from 'pages/po/POReqPayment';
import TreasuryPayment from 'pages/treasury/TreasuryPayment';
import TreasuryApprove from 'pages/treasury/TreasuryApprove';
import CreateLPRForm from 'pages/lpr/CreateLPRForm';

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'lpr/create',
          element: <CreateLPRForm />
        },
        {
          path: 'lpr/approve',
          element: <LPRList />
        },
        {
          path: 'lpr/view',
          element: <LPRView />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'rfq/rfqlist',
          element: <RfqList />
        },
        {
          path: 'rfq/rfqview',
          element: <RFQView />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'quote/create',
          element: <QuoteList />
        },
        {
          path: 'quote/compare',
          element: <QuoteCompare />
        },
        {
          path: 'quote/approve',
          element: <QuoteApprove />
        },
        {
          path: 'quote/view',
          element: <QuoteView />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'po/create',
          element: <POList />
        },
        {
          path: 'po/view',
          element: <POView />
        },
        {
          path: 'po/approve',
          element: <POApprove />
        },
        {
          path: '/po/request-payment',
          element: <POReqPayment />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'treasury/payment',
          element: <TreasuryPayment />
        },
        {
          path: 'treasury/approve',
          element: <TreasuryApprove />
        }
      ]
    }
  ]
};

export default MainRoutes;
