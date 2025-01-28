import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
const Dashboard = Loadable(lazy(() => import('pages/extra-pages/dashboard')));

import LPRList from 'pages/lpr/LPRList';
import RfqList from 'pages/rfq/RfqList';
import POList from 'pages/po/POList';
import POReqPayment from 'pages/po/POReqPayment';
import TreasuryPayment from 'pages/treasury/TreasuryPayment';
import TreasuryApprove from 'pages/treasury/TreasuryApprove';
import CreateLPRForm from 'pages/lpr/CreateLPRForm';
import ViewLPRList from 'pages/lpr/ViewLPRList';
import ViewGenerateRfqPage from 'pages/rfq/ViewGenerateRfqPage';
import QuoteList from 'pages/quote/QuoteList';
import QuoteComparelist from 'pages/quote/QuoteComparelist';
import LPOView from 'pages/po/LPOView';
import LPOApproveList from 'pages/po/LPOApproveList';
import CreateQuoteList from 'pages/quote/CreateQuoteList';

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
          element: <ViewLPRList />
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
          element: <ViewGenerateRfqPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'quote/create',
          element: <CreateQuoteList />
        },
        {
          path: 'quote/compare',
          element: <QuoteComparelist />
        },
       
        {
          path: 'quote/view',
          element: <QuoteList />
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
          element: <LPOView />
        },
        {
          path: 'po/approve',
          element: <LPOApproveList />
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
