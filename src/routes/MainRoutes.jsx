import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
const Dashboard = Loadable(lazy(() => import('pages/extra-pages/dashboard')));

import LPRList from 'pages/lpr/LPRList';
import RfqList from 'pages/rfq/RfqList';
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
import ViewLPRList from 'pages/lpr/ViewLPRList';
import ViewGenerateRfqPage from 'pages/rfq/ViewGenerateRfqPage';
import CreateQuote from 'pages/quote/CreateQuote';

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
          element: <CreateQuote />
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
