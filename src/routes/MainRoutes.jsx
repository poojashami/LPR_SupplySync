import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
const Dashboard = Loadable(lazy(() => import('pages/extra-pages/dashboard')));

import LPRList from 'pages/lpr/LPRList';
import RfqList from 'pages/rfq/RfqList';
import TreasuryPayment from 'pages/treasury/TreasuryPayment';
import TreasuryApprove from 'pages/treasury/TreasuryApprove';
import CreateLPRForm from 'pages/lpr/CreateLPRForm';
import ViewLPRList from 'pages/lpr/ViewLPRList';
import QuoteList from 'pages/quote/QuoteList';
import QuoteComparelist from 'pages/quote/QuoteComparelist';
import CreateQuoteList from 'pages/quote/CreateQuoteList';
import GRNList from 'pages/grn/GRNList';
import RfqViewList from 'pages/rfq/RfqViewList';
import CreatePOList from 'pages/po/CreatePOList';

import LPODocumentPage from 'pages/po/LPODocumentPage';
import LPOEmailForm from 'pages/po/LPOEmailForm';
import MainLPOListTable from 'pages/po/MainLPOListTable';

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
          element: <RfqViewList />
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
          element: <CreatePOList />
        },
        {
          path: 'po/draft',
          element: <MainLPOListTable mode={'draft'} />
        },
        {
          path: 'po/approve',
          element: <MainLPOListTable mode={'approve'} />
        },
        {
          path: 'po/issued_lpo',
          element: <MainLPOListTable mode={'issued_lpo'} />
        },
        {
          path: 'po/lpo_doc',
          element: <LPODocumentPage />
        },
        {
          path: 'po/email',
          element: <LPOEmailForm />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'grn/create',
          element: <GRNList />
        },
        {
          path: 'grn/approve',
          element: <LPRList />
        },
        {
          path: 'grn/view',
          element: <ViewLPRList />
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
