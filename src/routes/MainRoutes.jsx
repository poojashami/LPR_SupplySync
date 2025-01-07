import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';
import CompanyForPfi from 'pages/purchaseOrder/companyForPfi';

import VendorsPages from 'pages/master/Vendor/vender';
import UsersPages from 'pages/master/Users/users';
import ItemsPages from 'pages/master/Items/items';
import ServiceMasterPage from 'pages/master/ServicesMaster/ServicesMaster';
import NafdacCertificate from 'pages/permit/nafdacCertificate';
import SonCertificate from 'pages/permit/sonCertificate';
import Pending from 'pages/permit/pending';

//RFQ DROP DWON LIST ITEM PAGE
import GenrateRfqPage from 'pages/rfq/GenrateRfqPage';
import RfqListPage from 'pages/rfq/RfqListPage';
import NewQuotationPage from 'pages/rfq/X QuotationPage';
import PurchaseOrderPage from 'pages/rfq/X PurchaseOrderPage';
import CreateQuotation from 'pages/rfq/quotation/rfq_lists';
import ViewQuotation from 'pages/rfq/quotation/quatation-page';
import EmailView from 'pages/email/emailView';
import Insurance from 'pages/purchaseOrder/Insurance';
import FormM from 'pages/Logistics/pfi/FormM';
import InsuranceTable from 'pages/Logistics/pfi/InsuraceTable';
import PFIForm from 'pages/Logistics/pfi/pfiForm';
import CIForm from 'pages/Logistics/pfi/ciForm';
import NafdacTable from 'pages/Logistics/pfi/NafdacPermit';
import DraftPFIPage from 'pages/Logistics/pfi/DraftPage';
import Soncap from 'pages/PostShipment/Soncap/Soncap';
import ShippingEntry from 'pages/PostShipment/ShippingEntry/ShipingEntry';
import Paar from 'pages/PostShipment/Paar/Paar';
import ShipmentEntryTable from 'pages/PostShipment/ShippingEntry/ShipmentEntryTable';
import SoncapTable from 'pages/PostShipment/Soncap/SoncapTable';
import PaarTable from 'pages/PostShipment/Paar/PaarTable';
import AssessmentTable from 'pages/Operations/Assessment/AssessmentTable';
import SonTable from 'pages/Operations/Son/SonTable';
import ShippingOperationsTable from 'pages/Operations/ShippingOperations/ShippingOperationsTable';
import TransportOperationsTable from 'pages/Operations/TransportOperations/TransportOperationsTable';
import GovtChargesTable from 'pages/Operations/GovtCharges/GovtChargesTable';
import OtherChargesTable from 'pages/Operations/OtherCharges/OtherChargesTable';
import TerminalOperationsTable from 'pages/Operations/TerminalOperations/TerminalTable';
import ShippingTypesFCL from 'pages/Operations/ShippingOperations/ShippingType';
import ShippingLapse from 'pages/Operations/ShippingOperations/ShippingLapse';
import ShippingExpense from 'pages/Operations/ShippingOperations/ShippingExpense';
import ShippingContainerDetails from 'pages/Operations/ShippingOperations/ContainerDetail';
import ApprovalPending from 'pages/Approval/ApprovalPending';
import NafdacTableData from 'pages/Operations/Nafdac/NafdacTableData';
import SonOperaions from 'pages/Operations/Son/SonOperations';
import TranportOperationsForm from 'pages/Operations/TransportOperations/TransportOperationsForm';
import ContainerAllocation from 'pages/Operations/TransportOperations/ContainerAllocation.jsx';
import TransportExpense from 'pages/Operations/TransportOperations/TransportExpense';
import CardTable from 'pages/CardDN/Card/CardTables';
import DebitNoteTable from 'pages/CardDN/DebitNote/DebitNoteTable';
import LcPfiTable from 'pages/Logistics/pfi/lcPfiTable';
import PfiSonTable from 'pages/Logistics/pfi/SonTable';
import PoSpoTable from 'pages/ServicesPurchaseOrder/PoSpo/PoSpoTable';
import QuotationSpoTable from 'pages/ServicesPurchaseOrder/QuotationSpo/QuotationSpoTable';
import RfqSpoTable from 'pages/ServicesPurchaseOrder/RfqSpo/RfqSpoTable';
import GenerateRfqSpo from 'pages/ServicesPurchaseOrder/RfqSpo/GenerateRfqSpo';
import GenerateQuoTable from 'pages/ServicesPurchaseOrder/QuotationSpo/GenerateQuoTable';
import ShippingAdvise from 'pages/Operations/ShippingOperations/ShippingAdvise';
import ShippingInstruction from 'pages/purchaseOrder/ShippingInstruction';
import Shipment_Advise from 'pages/purchaseOrder/Shipment_AdviseBH';
import Quote_Compare from 'pages/OPO/OPO_Generate_Compare';

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));
const Dashboard = Loadable(lazy(() => import('pages/extra-pages/dashboard')));
const QuotationPage = Loadable(lazy(() => import('pages/rfq/quotation/quatation-page')));
const FormateForm = Loadable(lazy(() => import('pages/formate/format')));
const PO = Loadable(lazy(() => import('pages/purchaseOrder/po_index')));
const OPR = Loadable(lazy(() => import('pages/opr/oprMain')));
const BIDPage = Loadable(lazy(() => import('pages/bid/bidForm')));
const ForexPage = Loadable(lazy(() => import('pages/forexPurchase/ForexForm')));
const KnockPage = Loadable(lazy(() => import('pages/knockOff/KnockOffForm')));
const Po_page = Loadable(lazy(() => import('pages/purchaseOrder/po_form')));
const OPO_List = Loadable(lazy(() => import('pages/OPO/OPO_List')));
const TreasuryPage = Loadable(lazy(() => import('../pages/purchaseOrder/treasary')));
const Goods_Dispatch = Loadable(lazy(() => import('pages/purchaseOrder/Goods_Dispatch')));
const OPO_view_list = Loadable(lazy(() => import('pages/OPO/OPO_view_list_PO')));
const OPO_view_list_pfi = Loadable(lazy(() => import('pages/OPO/OPO_view_list_PFI')));
const List_pfi = Loadable(lazy(() => import('pages/purchaseOrder/PFI_List')));

// const OPO_Generate = Loadable(lazy(() => import('pages/opo/OPO_Generate')));

import OPO_List_Generate from 'pages/OPO/OPO_List_Generate';
import OPO_Generate from 'pages/OPO/OPO_Generate';
import EditOrp from 'pages/opr/EditOrp';
import BankCharges from 'pages/bankcharges/BankCharges';
import UnitPage from 'pages/bankcharges/UnitPage';
import PurchaseOrderTable from 'pages/CommercialInvoice/PurchaseOrderTable';
import OtherGovtChargesTable from 'pages/PostShipment/OtherGovtCharges/OtherGovtChargesTable';
import CustomClearanceTable from 'pages/PostShipment/CustomClearance/CustomClearanceTable';
import ExchangeControllTable from 'pages/Operations/ExchangeControll/ExchangeControllTale';
import ContainerTrackngTable from 'pages/Operations/ContainerTracking/ContainerTrackingTale';
import NPAUSDPage from 'pages/Operations/Bulk/NPAUSDPage';
import NPANGNPage from 'pages/Operations/Bulk/NPANGNPage';
import BulkTerminalUSD from 'pages/Operations/Bulk/BulkTerminalUSD';
import BulkTerminalNGN from 'pages/Operations/Bulk/BulkTerminalNGN';
import NimashaSeaProtection from 'pages/Operations/Bulk/NimashaSeaProtection';
import Nimasa from 'pages/Operations/Bulk/Nimasa';
import FinalNPAUSDPage from 'pages/Operations/Bulk/FinalNPAUSDPage';
import FinalNPANGNPage from 'pages/Operations/Bulk/FinalNPANGNPage';
import FinalBulkTerminalUSD from 'pages/Operations/Bulk/FinalBulkTerminalUSD';
import FinalBulkTerminalNGN from 'pages/Operations/Bulk/FinalBulkTerminalNGN';
import OPOList from 'pages/OPO/OPOList';
import POList from '../pages/purchaseOrder/Purchase_list';
import CreateQuote from 'pages/ServicesPurchaseOrder/createquote/CreateQuote';
import QuoteSeaFrieght from 'pages/ServicesPurchaseOrder/createquote/QuoteSeaFrieghtLCL';
import QuoteSeaFrieghtFCL from 'pages/ServicesPurchaseOrder/createquote/QuoteSeaFrieghtFCL';
import QuoteSeaFrieghtLCL from 'pages/ServicesPurchaseOrder/createquote/QuoteSeaFrieghtLCL';
import QuoteAirFrieght from 'pages/ServicesPurchaseOrder/createquote/QuoteAirFrieght';
import QuoteComparision from 'pages/ServicesPurchaseOrder/createquote/QuoteComparision';
import Discrepancy from 'pages/Logistics/pfi/Discrepancy';
import LPRListRFQPage from 'pages/lprListForRfq/LPRListForRfq';

// const POList = Loadable(lazy(() => import('pages/purchaseOrder/Purchase_list')));
const Comparision = Loadable(lazy(() => import('pages/comparison/comparison')));
const EmailPage = Loadable(lazy(() => import('pages/email/email')));
const PaymentPage = Loadable(lazy(() => import('pages/payment/payment')));
const MasterTabPage = Loadable(lazy(() => import('pages/mastertab/masterTab')));
// Master Tabs start
const BranchMaster = Loadable(lazy(() => import('pages/masterForm/branch')));
const BuyingHouse = Loadable(lazy(() => import('pages/masterForm/buyingHouse')));
const UOMMaster = Loadable(lazy(() => import('pages/masterForm/unitOfMeasurement')));
const CategoryMaster = Loadable(lazy(() => import('pages/masterForm/category')));
const CompanyMaster = Loadable(lazy(() => import('pages/masterForm/company')));
const CurrencyMaster = Loadable(lazy(() => import('pages/masterForm/currency')));
const DeleveryTermMaster = Loadable(lazy(() => import('pages/masterForm/deliveryTerm')));
const DepartmentMaster = Loadable(lazy(() => import('pages/masterForm/department')));
const DesignationMaster = Loadable(lazy(() => import('pages/masterForm/designation')));
const DivisionMaster = Loadable(lazy(() => import('pages/masterForm/division')));
const GroupMaster = Loadable(lazy(() => import('pages/masterForm/group')));
const SubGroupMaster = Loadable(lazy(() => import('pages/masterForm/subgroup')));
const LeadTimeMaster = Loadable(lazy(() => import('pages/masterForm/leadTime')));
const PaymentTypeMaster = Loadable(lazy(() => import('pages/masterForm/PaymentType')));
const PenaltyTermMaster = Loadable(lazy(() => import('pages/masterForm/penaltyTerms')));
const PaymentTermMaster = Loadable(lazy(() => import('pages/masterForm/paymentTerms')));
const RoleMaster = Loadable(lazy(() => import('pages/masterForm/role')));
const SeriesMaster = Loadable(lazy(() => import('pages/masterForm/seriesMaster')));
const ShipmentModeMasgter = Loadable(lazy(() => import('pages/masterForm/shipmentMode')));
const VerticalMaster = Loadable(lazy(() => import('pages/masterForm/verical')));
const NafDacMaster = Loadable(lazy(() => import('pages/masterForm/nafdac')));
const StatusMaster = Loadable(lazy(() => import('pages/masterForm/status.jsx')));
const DeliveryTimelineMaster = Loadable(lazy(() => import('pages/masterForm/deliveryTimeline')));
const ExpenseChargesMaster = Loadable(lazy(() => import('pages/masterForm/addExpenseCharges')));
const ContainerTypeMaster = Loadable(lazy(() => import('pages/masterForm/containerType')));
const ShipAdviseContainerTypeMaster = Loadable(lazy(() => import('pages/masterForm/shipmentAdConType')));
const TransOPLapseMaster = Loadable(lazy(() => import('pages/masterForm/transportOperationLapse')));
const PayemtnTypeTrans = Loadable(lazy(() => import('pages/masterForm/paymentTypeTransport')));
const CountryMaster = Loadable(lazy(() => import('pages/masterForm/countryMaster')));
const StateMaster = Loadable(lazy(() => import('pages/masterForm/stateMaster')));
const CityMaster = Loadable(lazy(() => import('pages/masterForm/cityMaster')));
const ContainerDetails = Loadable(lazy(() => import('pages/Operations/ContainerDetails/Container')));
const InwardPage = Loadable(lazy(() => import('pages/Operations/inward/InwardPOList')));
const ServicePOAcceptance = Loadable(lazy(() => import('pages/ServicesPurchaseOrder/PoSpo/po_form')));
const OutwardPage = Loadable(lazy(() => import('pages/Operations/outward/InwardList')));
const OPOCompare = Loadable(lazy(() => import('pages/OPO/OPO_Compare')));
const OPO_List_Approval = Loadable(lazy(() => import('pages/OPO/OPO_Approval')));
// logistic
// const LogisticRFQ = Loadable(lazy(() => import('pages/Logistics/rfq/rfq')));
// const LogisticPO = Loadable(lazy(() => import('pages/Logistics/rfq/rfq')));
// const LogisticQuotation = Loadable(lazy(() => import('pages/Logistics/rfq/rfq')));
// const LogisticPayment = Loadable(lazy(() => import('pages/Logistics/rfq/rfq')));
// const LogisticCI = Loadable(lazy(() => import('pages/Logistics/ci/ci')));
const LogisticPFI = Loadable(lazy(() => import('pages/Logistics/pfi/pfi')));
// Master Tabs End
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
          path: 'lpr-list-for-rfq',
          element: <LPRListRFQPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'opr/edit',
          element: <EditOrp />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dd',
          element: <CompanyForPfi />
        }
      ]
    },

    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/po/create',
          element: <PO />
        },
        {
          path: '/po/view',
          element: <POList />
        },
        {
          path: '/po/accept',
          element: <Po_page />
        },
        {
          path: '/po/treasury',
          element: <TreasuryPage />
        },
        {
          path: '/po/shipment/advice',
          element: <ShippingAdvise />
        },
        {
          path: '/po/shipment/advice_bh',
          element: <Shipment_Advise />
        },
        {
          path: '/po/generate/commercialInvoice',
          element: <PurchaseOrderTable />
        }
      ]
    },

    // RFQ Select Menu
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'rfq/genraterfq',
          element: <GenrateRfqPage />
        },
        {
          path: 'rfq/rfqlist',
          element: <RfqListPage />
        },
        {
          path: 'rfq/quotation',
          element: <NewQuotationPage />
        },
        {
          path: 'rfq/polist',
          element: <PurchaseOrderPage />
        }
      ]
    },

    //OPO pages
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'opo/list',
          element: <OPO_List />
        },
        {
          path: 'opo/view',
          element: <OPOList />
        },
        {
          path: 'opo/generate_list',
          element: <OPO_List_Generate />
        },

        {
          path: 'opo/generate',
          element: <OPO_Generate />
        },

        {
          path: '/opo/generateCompare',
          element: <Quote_Compare />
        },

        {
          path: 'opo/compare',
          element: <OPOCompare />
        },
        {
          path: 'opo/opo_list',
          element: <OPO_List_Approval />
        },
        {
          path: 'opo/opo_view_list_po',
          element: <OPO_view_list />
        },
        {
          path: 'opo/opo_view_list_pfi',
          element: <OPO_view_list_pfi />
        },
        {
          path: 'opo/list_pfi',
          element: <List_pfi />
        }
      ]
    },

    //Qutation Module
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'quotation/create',
          element: <CreateQuotation />
        },
        {
          path: 'quotation/view',
          element: <ViewQuotation />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'quotation-page',
          element: <QuotationPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'payment',
          element: <PaymentPage />
        }
      ]
    },

    //Permit drop downmodlue
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'permit/navdac',
          element: <NafdacCertificate />
        },
        {
          path: 'permit/son',
          element: <SonCertificate />
        },
        {
          path: 'permit/pending',
          element: <Pending />
        }
      ]
    },

    // MASTER Data second Version
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'master/vendor',
          element: <VendorsPages />
        },
        {
          path: 'master/users',
          element: <UsersPages />
        },
        {
          path: 'master/items',
          element: <ItemsPages />
        },
        {
          path: 'master/masterService',
          element: <ServiceMasterPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'mastertab',
          element: <MasterTabPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'comparision',
          element: <Comparision />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'email',
          element: <EmailPage />
        },
        {
          path: 'emailPFI',
          element: <EmailView />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'formate',
          element: <FormateForm />
        }
      ]
    },

    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    },
    {
      path: '*',
      element: <MaintenanceError />
    },

    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/po/create',
          element: <PO />
        },
        // {
        //   path: '/po/view',
        //   element: <POList />
        // },
        // {
        //   path: '/po/accept',
        //   element: <Po_page />
        // },
        {
          path: '/po/treasury',
          element: <TreasuryPage />
        },
        {
          path: '/po/shipping/instructions',
          element: <ShippingInstruction />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'branch',
          element: <BranchMaster />
        },
        {
          path: 'uom',
          element: <UOMMaster />
        },
        {
          path: 'buyingHouse',
          element: <BuyingHouse />
        },
        {
          path: 'category',
          element: <CategoryMaster />
        },
        {
          path: 'company',
          element: <CompanyMaster />
        },
        {
          path: 'currency',
          element: <CurrencyMaster />
        },
        {
          path: 'deleiveryTerms',
          element: <DeleveryTermMaster />
        },
        {
          path: 'department',
          element: <DepartmentMaster />
        },
        {
          path: 'designation',
          element: <DesignationMaster />
        },
        {
          path: 'division',
          element: <DivisionMaster />
        },
        {
          path: 'group',
          element: <GroupMaster />
        },

        {
          path: 'subgroup',
          element: <SubGroupMaster />
        },
        {
          path: 'leadTime',
          element: <LeadTimeMaster />
        },
        {
          path: 'paymentType',
          element: <PaymentTypeMaster />
        },
        {
          path: 'penaltyTerm',
          element: <PenaltyTermMaster />
        },
        {
          path: 'paymentTerms',
          element: <PaymentTermMaster />
        },
        {
          path: 'role',
          element: <RoleMaster />
        },
        {
          path: 'seriesMaster',
          element: <SeriesMaster />
        },
        {
          path: 'shipmentmode',
          element: <ShipmentModeMasgter />
        },
        {
          path: 'vertical',
          element: <VerticalMaster />
        },
        {
          path: 'nafdac',
          element: <NafDacMaster />
        },
        {
          path: 'statusmaster',
          element: <StatusMaster />
        },
        {
          path: 'deliveryTimeLine',
          element: <DeliveryTimelineMaster />
        },
        {
          path: 'expenseCharges',
          element: <ExpenseChargesMaster />
        },
        {
          path: 'containerType',
          element: <ContainerTypeMaster />
        },
        {
          path: 'shipmentAdviseContainerType',
          element: <ShipAdviseContainerTypeMaster />
        },
        {
          path: 'transportOperationLapse',
          element: <TransOPLapseMaster />
        },
        {
          path: 'paymentTypeTrans',
          element: <PayemtnTypeTrans />
        },
        {
          path: 'countryMaster',
          element: <CountryMaster />
        },
        {
          path: 'stateMaster',
          element: <StateMaster />
        },
        {
          path: 'cityMaster',
          element: <CityMaster />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'pfi/draftpfi',
          element: <DraftPFIPage />
        },
        {
          path: 'pfi',
          element: <LogisticPFI />
        },
        {
          path: 'pfi/insurance',
          element: <InsuranceTable />
        },
        {
          path: 'logistics/pfiForm',
          element: <PFIForm />
        },
        {
          path: 'logistics/ciForm',
          element: <CIForm />
        },
        {
          path: 'pfi/addinsurance',
          element: <Insurance />
        },
        {
          path: 'pfi/formm',
          element: <FormM />
        },
        {
          path: 'pfi/lc',
          element: <LcPfiTable />
        },
        {
          path: 'pfi/sonpc',
          element: <PfiSonTable />
        },
        {
          path: 'pfi/nafdac',
          element: <NafdacTable />
        },
        {
          path: 'pfi/discepancy',
          element: <Discrepancy />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/postshipmemt/shipping',
          element: <ShipmentEntryTable />
        },
        {
          path: '/postshipmemt/shippingentry',
          element: <ShippingEntry />
        },
        {
          path: '/postshipmemt/soncap',
          element: <SoncapTable />
        },
        {
          path: '/postshipmemt/soncap/view',
          element: <Soncap />
        },
        {
          path: '/postshipmemt/paar',
          element: <PaarTable />
        },
        {
          path: '/postshipmemt/paar/view',
          element: <Paar />
        },
        {
          path: '/postshipmemt/other/govt/charges',
          element: <OtherGovtChargesTable />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/operations/assessment',
          element: <AssessmentTable />
        },
        {
          path: '/operations/nafdac',
          element: <NafdacTableData />
        },
        {
          path: '/operations/son',
          element: <SonTable />
        },
        {
          path: '/operaions/son/view',
          element: <SonOperaions />
        },
        {
          path: '/operations/shipping',
          element: <ShippingOperationsTable />
        },
        {
          path: '/operations/terminal/operation',
          element: <TerminalOperationsTable />
        },
        {
          path: '/operations/custom/operation',
          element: <ContainerAllocation />
        },
        {
          path: '/operations/transport/expense',
          element: <TransportExpense />
        },
        {
          path: '/operations/transport/operation',
          element: <TransportOperationsTable />
        },
        {
          path: '/operations/transport/container/allocation',
          element: <ContainerAllocation />
        },
        {
          path: '/operations/transport/form',
          element: <TranportOperationsForm />
        },
        {
          path: '/operations/govt/charges',
          element: <GovtChargesTable />
        },
        {
          path: '/operations/other/charges',
          element: <OtherChargesTable />
        },
        {
          path: 'operations/shippingtype',
          element: <ShippingTypesFCL />
        },
        {
          path: 'operations/container_details',
          element: <ContainerDetails />
        },

        {
          path: 'operations/inward',
          element: <InwardPage />
        },
        {
          path: '/operations/outward',
          element: <OutwardPage />
        },
        {
          path: '/exchange/controll',
          element: <ExchangeControllTable />
        },
        {
          path: '/operations/container/tracking',
          element: <ContainerTrackngTable />
        }
      ]
    },
    // bulk
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'bulk/npa-usd',
          element: <NPAUSDPage />
        },
        {
          path: 'bulk/npa-ngn',
          element: <NPANGNPage />
        },
        {
          path: 'bulk/bulk-terminal-usd',
          element: <BulkTerminalUSD />
        },
        {
          path: 'bulk/bulk-terminal-ngn',
          element: <BulkTerminalNGN />
        },
        {
          path: '/bulk/nimasa-sea-protection-levy',
          element: <NimashaSeaProtection />
        },
        {
          path: '/bulk/nimasa',
          element: <Nimasa />
        },
        {
          path: 'bulk/final-npa-usd',
          element: <FinalNPAUSDPage />
        },
        {
          path: 'bulk/final-npa-ngn',
          element: <FinalNPANGNPage />
        },
        {
          path: 'bulk/final-bulk-terminal-usd',
          element: <FinalBulkTerminalUSD />
        },
        {
          path: 'bulk/final-bulk-terminal-ngn',
          element: <FinalBulkTerminalNGN />
        }
      ]
    },
    // bulk end
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/service/po/rfq',
          element: <GenerateRfqSpo />
        },
        {
          path: '/service/po/rfq/view',
          element: <RfqSpoTable />
        },
        {
          path: '/service/po/quotation',
          element: <GenerateQuoTable />
        },
        {
          path: '/service/po/quotation/view',
          element: <QuotationSpoTable />
        },
        {
          path: '/service/po/quotation/comparison',
          element: <ShippingOperationsTable />
        },
        {
          path: '/service/po/list',
          element: <PoSpoTable />
        },
        {
          path: '/service/po/acceptance_list',
          element: <ServicePOAcceptance />
        },
        {
          path: '/service/po/create_quote',
          element: <CreateQuote />
        },
        {
          path: '/service/po/sea_freight_fcl',
          element: <QuoteSeaFrieghtFCL />
        },
        {
          path: '/service/po/sea_freight_lcl',
          element: <QuoteSeaFrieghtLCL />
        },
        {
          path: '/service/po/air_freight',
          element: <QuoteAirFrieght />
        },
        {
          path: '/service/po/quote_comparision',
          element: <QuoteComparision />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'bankcharges',
          element: <BankCharges />
        },
        {
          path: 'unit',
          element: <UnitPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/card/dn/card',
          element: <CardTable />
        },
        {
          path: 'card/dn/debit/note',
          element: <DebitNoteTable />
        }
      ]
    },
    // individual path for navigate
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'lapse',
          element: <ShippingLapse />
        },
        {
          path: 'expense',
          element: <ShippingExpense />
        },
        {
          path: 'containerDetails',
          element: <ShippingContainerDetails />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'bid',
          element: <BIDPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'forex-purchase',
          element: <ForexPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'custom-clearance',
          element: <CustomClearanceTable />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'knockof',
          element: <KnockPage />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'approval/pending',
          element: <ApprovalPending />
        }
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/dispatch',
          element: <Goods_Dispatch />
        }
      ]
    }
  ]
};

export default MainRoutes;
