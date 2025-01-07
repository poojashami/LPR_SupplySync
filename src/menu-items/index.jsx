import samplePage from './sample-page';
import rfq_page from './rfq';
import quotation from './quotation';
import opr1 from './opr1';
import masters from './masters';
import permit from './permit';
import po_page from './purchase_order';
import emailPage from './email';
import paymentPage from './payment';
import MasterTab from './masterTab';
import Pfi from './Pfi';
import postShipment from './post-shipment';
import operations from './operations';
import ApprovalPage from './approval';
import CardDN from './CardDN';
import ServicePO from './ServicePO';
import OPO from './Opo';
import OpoOnlyCompare from './OpoOnlyCompare';
import approval_list from './Approval_List';
import po_page_treasury from './purchase_order_treasury';
import ServicePOVendor from './ServicePO_vendor';
import BIDMenu from './bid';
import PurchaseOrderVendor from './purchase_order_vendor';
import bank from './bank';
import KnockMenu from './knockof';
import forexPurchaseMenu from './forex';
import bulkroute from './bulk';
import customClearanceMenu from './customclearance';
import CommercialInvoice from './CommercialInvoice';
import ShipmentStatus from './ShipmentStatus';
import Treasury from './Treasury';
import PreShipment from './PreShipment';
import LPR_RFQ from './opr1';

const MenuItems = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const user_role = userInfo.role || 'default';

  const menuItems = {
    admin: [samplePage, LPR_RFQ]
  };

  return { items: menuItems[user_role] || menuItems.default };
};

export default MenuItems;
