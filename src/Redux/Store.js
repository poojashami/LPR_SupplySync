import { configureStore } from '@reduxjs/toolkit';
import VerticalSlice from './Slices/VerticalSlice';
import VendorSlice from './Slices/VendorSlice';
import usersSlice from './Slices/usersSlice';
import ItemSlice from './Slices/ItemSlice';
import AuthSlice from './Slices/AuthSlice';
import RFQSlice from './Slices/RFQSlice';
import OprSlice from './Slices/OprSlice';
import QuotationSlice from './Slices/QuotationSlice';
import LeadTimeSlice from './Slices/LeadTimeSlice';
import deliveryTermsSlice from './Slices/deliveryTermsSlice';
import paymentTermsSlice from './Slices/PaymentTerms';
import POSlice from './Slices/POSlice';
import MailSlice from './Slices/MailSlice';
import StaticSlice from './Slices/StaticSlice';
import CompanySlice from './Slices/CompanySlice';
import ApprovalsSlice from './Slices/ApprovalsSlice';
import PFISlice from './Slices/PFISlice';

export default configureStore({
  reducer: {
    verticle: VerticalSlice,
    vendorMaster: VendorSlice,
    usersMaster: usersSlice,
    itemMaster: ItemSlice,
    auth: AuthSlice,
    rfq: RFQSlice,
    opr: OprSlice,
    PFISlice: PFISlice,
    quotation: QuotationSlice,
    leadTime: LeadTimeSlice,
    deliveryTerms: deliveryTermsSlice,
    paymentTerms: paymentTermsSlice,
    purchaseOrder: POSlice,
    mail: MailSlice,
    static: StaticSlice,
    company: CompanySlice,
    Approvals: ApprovalsSlice
  }
});
