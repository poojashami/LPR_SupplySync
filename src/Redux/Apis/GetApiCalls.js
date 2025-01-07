import { axiosInstance } from '../../utils/axiosInstance';
import { loginStart, loginSuccess, loginFailure } from '../Slices/AuthSlice';
import {
  usersFetchStart,
  usersFetchSuccess,
  usersFetchFailure,
  rolesFetchStart,
  rolesFetchSuccess,
  rolesFetchFailure,
  departmentsFetchStart,
  departmentsFetchSuccess,
  departmentsFetchFailure,
  designationsFetchStart,
  designationsFetchSuccess,
  designationsFetchFailure
} from '../Slices/usersSlice';
import { setConSizes } from '../Slices/StaticSlice';
import {
  itemsFetchStart,
  itemsFetchSuccess,
  itemsFetchFailure,
  categoryFetchStart,
  categoryFetchSuccess,
  categoryFetchFailure,
  subCategoryFetchStart,
  subCategoryFetchSuccess,
  subCategoryFetchFailure,
  itemCategoriesFetchStart,
  itemCategoriesFetchSuccess,
  itemCategoriesFetchFailure,
  nafdacsFetchStart,
  nafdacsFetchSuccess,
  nafdacsFetchFailure,
  nafdacsNameFetchStart,
  nafdacsNameFetchSuccess,
  nafdacsNameFetchFailure,
  criasFetchStart,
  criasFetchSuccess,
  criasFetchFailure,
  itemUOMFetchStart,
  itemUOMFetchSuccess,
  itemUOMFetchFailure,
  superCategoryFetchStart,
  superCategoryFetchSuccess,
  superCategoryFetchFailure
} from '../Slices/ItemSlice';
import { vendorsFetchStart, vendorsFetchSuccess, vendorsFetchFailure } from '../Slices/VendorSlice';
import { getAllOprStart, getAllOprSuccess, getAllOprFailure, getAllSuperCategorySuccess } from '../Slices/OprSlice';
import { verticleFetchStart, verticleFetchSuccess, verticleFetchFailure } from '../Slices/VerticalSlice';
import {
  quotationFetchStart,
  quotationFetchSuccess,
  quotationFetchFailure,
  quotationItemFetchStart,
  quotationItemFetchSuccess,
  quotationItemFetchFailure,
  quotationChargesFetchStart,
  quotationChargesFetchFailure,
  quotationChargesFetchSuccess,
  quotationByRFQFetchStart,
  quotationByRFQFetchSuccess,
  quotationByRFQFetchFailure,
  packagingTypeFetchStart,
  packagingTypeFetchSuccess,
  packagingTypeFetchFailure
} from '../Slices/QuotationSlice';
import { PFIFetchStart, PFIFetchSuccess, PFIFetchFailure } from '../Slices/PFISlice';
import { deliveryTermsFetchStart, deliveryTermsFetchSuccess, deliveryTermsFetchFailure } from '../Slices/deliveryTermsSlice';
import {
  paymentTermsFetchStart,
  paymentTermsFetchSuccess,
  paymentTermsFetchFailure,
  paymentTypeFetchStart,
  paymentTypeFetchSuccess,
  paymentTypeFetchFailure
} from '../Slices/PaymentTerms';
import { leadTimeFetchStart, leadTimeFetchSuccess, leadTimeFetchFailure } from '../Slices/LeadTimeSlice';
import {
  purchaseOrderFetchStart,
  purchaseOrderFetchSuccess,
  purchaseOrderFetchFailure,
  POItemsFetchStart,
  POItemsFetchSuccess,
  POItemsFetchFailure,
  CIFetchStart,
  CIFetchSuccess,
  CIFetchFailure,
  SingleCIFetchStart,
  SingleCIFetchSuccess,
  SingleCIFetchFailure
} from '../Slices/POSlice';
import { setAddressTypes, setVerticles } from '../Slices/StaticSlice';
import { ApprovalsFetchStart, ApprovalsFetchSuccess, ApprovalsFetchFailure } from '../Slices/ApprovalsSlice.js';
import {
  rfqsFetchStart,
  rfqsFetchSuccess,
  rfqsFetchFailure,
  rfqsByIdFetchStart,
  rfqsByIdFetchSuccess,
  rfqsByIdFetchFailure,
  rfqsDetailsFetchStart,
  rfqsDetailsFetchSuccess,
  rfqsDetailsFetchFailure,
  rfqsItemsByRfqIdFetchStart,
  rfqsItemsByRfqIdFetchSuccess,
  rfqsItemsByRfqIdFetchFailure,
  rfqsVendorsByRfqIdFetchStart,
  rfqsVendorsByRfqIdFetchSuccess,
  rfqsVendorsByRfqIdFetchFailure,
  setRfqDocList,
  portDestinationFetchStart,
  portDestinationFetchSuccess,
  portDestinationFetchFailure
} from '../Slices/RFQSlice';
import { fetchCompaniesStart, fetchCompaniesSuccess, fetchCompaniesError } from '../Slices/CompanySlice';
import { toast } from 'react-toastify';

let token = localStorage.getItem('token');

//Companies Apis
export const GetCompanies = async (dispatch) => {
  dispatch(fetchCompaniesStart());
  try {
    const { data } = await axiosInstance.get('/api/company/list', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(fetchCompaniesSuccess({ data }));
  } catch (error) {
    dispatch(fetchCompaniesError(error?.response?.data?.success));
  }
};
//Companies Apis ends

// Get Approval Matrix By DocId or DocNum Start
export const GetApprovals = async (dispatch, quo_num) => {
  dispatch(ApprovalsFetchStart());

  try {
    const { data } = await axiosInstance.get('/api/quotation/approvals', {
      params: {
        quo_num: quo_num
      }
    });
    dispatch(ApprovalsFetchSuccess({ data: data }));
  } catch (error) {
    dispatch(ApprovalsFetchFailure(error?.response?.data?.success));
  }
};
// Get Approval Matrix By DocId or DocNum End

// Get Container Sizes  Start
export const GetContainerSizes = async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/api/operation/container/type/dropdown');
    dispatch(setConSizes({ data: data }));
  } catch (error) {
    toast.error(error?.message || 'An Error Occurred');
  }
};
// Get Container Sizes  End

//static apis
export const GetAddressTypes = async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/api/address/type', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(setAddressTypes({ data }));
  } catch (error) {
    toast.info('Cannot Connect to Server' + error);
  }
};

export const GetSupperCategoriesTypes = async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/api/category/supercategory', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(data);
    dispatch(getAllSuperCategorySuccess({ data }));
  } catch (error) {
    toast.info('Cannot Connect to Server :' + error);
  }
};

// -----------------------Get CI List

export const GetCIList = async (dispatch) => {
  dispatch(CIFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/po/list', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(CIFetchSuccess({ data }));
  } catch (error) {
    dispatch(CIFetchFailure(error));
    toast.info('Cannot Connect to Server :' + error);
  }
};

export const GetCIListByCiId = async (dispatch, ci_id) => {
  dispatch(SingleCIFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/po/list', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { ci_id }
    });
    dispatch(SingleCIFetchSuccess({ data }));
  } catch (error) {
    dispatch(SingleCIFetchFailure(error));
    toast.info('Cannot Connect to Server :' + error);
  }
};

// -----------------------

export const GetItemSuperCategoriesTypes = async (dispatch) => {
  dispatch(superCategoryFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/category/supercategory', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(data);
    dispatch(superCategoryFetchSuccess({ data }));
  } catch (error) {
    dispatch(superCategoryFetchFailure());
    toast.info('Cannot Connect to Server :' + error);
  }
};

export const GetRFQ_DocList = async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/api/reqdoc/list', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(setRfqDocList({ data }));
  } catch (error) {
    toast.info('Cannot Connect to Server :' + error);
  }
};

export const GetVerticles = async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/api/vertical/dropdown', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(setVerticles({ data }));
  } catch (error) {
    toast.info('Cannot Connect to Server' + error);
  }
};

//static apis end
//Auth API's
export const Login = async (dispatch, formdata) => {
  dispatch(loginStart());
  try {
    const { data } = await axiosInstance.post('/api/user/login', formdata);
    localStorage.setItem('token', data.servicetoken);
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error?.response?.data?.success));
  }
};
//Auth API's ends

//vendor Master Api
export const GetVendors = async (dispatch) => {
  dispatch(vendorsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/vendor/vendors', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(vendorsFetchSuccess({ data }));
  } catch (error) {
    dispatch(vendorsFetchFailure(error?.response?.data?.success));
  }
};
//vendor Master Api ends

//user Master Api
export const GetUsers = async (dispatch) => {
  dispatch(usersFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/user/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(usersFetchSuccess({ data }));
  } catch (error) {
    dispatch(usersFetchFailure(error?.response?.data?.success));
  }
};

export const GetRoles = async (dispatch) => {
  dispatch(rolesFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/role/roles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(rolesFetchSuccess({ data }));
  } catch (error) {
    dispatch(rolesFetchFailure(error?.response?.data?.success));
  }
};

export const GetDepartments = async (dispatch) => {
  dispatch(departmentsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/dept/departments', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(departmentsFetchSuccess({ data }));
  } catch (error) {
    dispatch(departmentsFetchFailure(error?.response?.data?.success));
  }
};

export const GetDesignations = async (dispatch) => {
  dispatch(designationsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/dept/designations', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(designationsFetchSuccess({ data }));
  } catch (error) {
    dispatch(designationsFetchFailure(error?.response?.data?.success));
  }
};

//User Master Api ends

//item Master Api
export const GetNafdacsCategories = async (dispatch) => {
  dispatch(nafdacsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/nafdaccategory/names', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(nafdacsFetchSuccess({ data }));
  } catch (error) {
    dispatch(nafdacsFetchFailure(error?.response?.data?.success));
  }
};

export const GetNafdacNames = async (dispatch) => {
  dispatch(nafdacsNameFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/nafdac/nafdacs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(nafdacsNameFetchSuccess({ data }));
  } catch (error) {
    dispatch(nafdacsNameFetchFailure(error?.response?.data?.success));
  }
};

export const GetCrias = async (dispatch) => {
  dispatch(criasFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/cria/crias', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(criasFetchSuccess({ data }));
  } catch (error) {
    dispatch(criasFetchFailure(error?.response?.data?.success));
  }
};

export const GetCategory = async (dispatch, id) => {
  dispatch(categoryFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/category/', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        item_super_category_id: id || 0
      }
    });
    dispatch(categoryFetchSuccess({ data: data.data }));
  } catch (error) {
    dispatch(categoryFetchFailure(error?.response?.data?.success));
  }
};

export const GetSubCategory = async (dispatch, id) => {
  dispatch(subCategoryFetchStart());
  try {
    const { data } = await axiosInstance.get(`/api/itemsubgroup/subgroups?groupid=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        params: {
          id
        }
      }
    });
    dispatch(subCategoryFetchSuccess({ data }));
  } catch (error) {
    dispatch(subCategoryFetchFailure(error?.response?.data?.success));
  }
};

export const GetItems = async (dispatch) => {
  dispatch(itemsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/item/items', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(itemsFetchSuccess({ data: data }));
  } catch (error) {
    dispatch(itemsFetchFailure(error?.response?.data?.success));
  }
};

export const GetItemCategories = async (dispatch) => {
  dispatch(itemCategoriesFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/itemcategory/itemcategories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(itemCategoriesFetchSuccess({ data: data }));
  } catch (error) {
    dispatch(itemCategoriesFetchFailure(error?.response?.data?.success));
  }
};

export const GetItemUOMs = async (dispatch) => {
  dispatch(itemUOMFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/uom/uoms', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('uom data', data);
    dispatch(itemUOMFetchSuccess({ data: data }));
  } catch (error) {
    dispatch(itemUOMFetchFailure(error?.response?.data?.success));
  }
};
//item Master Api ends

//Opr APis
export const GetOpr = async (dispatch, id) => {
  console.log(id);
  dispatch(getAllOprStart());
  try {
    const { data } = await axiosInstance.get(`/api/opr/oprs`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        id
      }
    });
    dispatch(getAllOprSuccess({ data }));
  } catch (error) {
    dispatch(getAllOprFailure(error?.response?.data?.success));
  }
};

export const GetOprDraft = async (dispatch, id) => {
  dispatch(getAllOprStart());
  try {
    const { data } = await axiosInstance.get(`/opr/draft/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(getAllOprSuccess({ data }));
  } catch (error) {
    dispatch(getAllOprFailure(error?.response?.data?.success));
  }
};

export const GetVerticle = async (dispatch) => {
  dispatch(verticleFetchStart());
  try {
    const { data } = await axiosInstance.get('/vertical', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(verticleFetchSuccess({ data }));
  } catch (error) {
    dispatch(verticleFetchFailure(error?.response?.data?.success));
  }
};

//Opr APis ends

// PFI Get by Id & All PFI's
export const GetPFI = async (dispatch, pfi_id) => {
  dispatch(PFIFetchStart());
  try {
    if (pfi_id) {
      const { data } = await axiosInstance.get('/api/pfi', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { pfi_id }
      });
      dispatch(PFIFetchSuccess({ data }));
    } else {
      const { data } = await axiosInstance.get('/api/pfi', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(PFIFetchSuccess({ data }));
    }
  } catch (error) {
    dispatch(PFIFetchFailure(error?.response?.data?.success));
  }
};

// Quotations start
export const GetQuotation = async (dispatch, quo_id) => {
  dispatch(quotationFetchStart());
  try {
    if (quo_id) {
      const { data } = await axiosInstance.get('/api/quotation/quotes', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { quo_id }
      });
      dispatch(quotationFetchSuccess({ data }));
    } else {
      const { data } = await axiosInstance.get('/api/quotation/quotes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(quotationFetchSuccess({ data }));
    }
  } catch (error) {
    dispatch(quotationFetchFailure(error?.response?.data?.success));
  }
};

export const GetAllQuotationsByRFQ = async (dispatch, rfq_id) => {
  dispatch(quotationByRFQFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/quotation/quotes', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        rfq_id: rfq_id
      }
    });
    dispatch(quotationByRFQFetchSuccess({ data }));
  } catch (error) {
    dispatch(quotationByRFQFetchFailure(error?.response?.data?.success));
  }
};

export const GetPOItems = async (dispatch, po_id) => {
  dispatch(POItemsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/po/itemlist', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        po_id
      }
    });
    dispatch(POItemsFetchSuccess({ data }));
  } catch (error) {
    dispatch(POItemsFetchFailure(error?.response?.data?.success));
  }
};
// Quotations ends

// Get All Lead time for quotation start
export const GetLeadTime = async (dispatch) => {
  dispatch(leadTimeFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/leadtime', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(leadTimeFetchSuccess({ data }));
  } catch (error) {
    dispatch(leadTimeFetchFailure(error?.response?.data?.success));
  }
};
// Get All Lead time for quotation ends

// Get All Payment Terms for quotation start
export const GetPaymentTerms = async (dispatch) => {
  dispatch(paymentTermsFetchStart());
  try {
    const { data } = await axiosInstance.get('api/payment/terms/dropdown', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(paymentTermsFetchSuccess({ data }));
  } catch (error) {
    dispatch(paymentTermsFetchFailure(error?.response?.data?.success));
  }
};
// Get All Payment Terms for quotation ends

// Get All Delivery Terms for quotation form start
export const GetDeliveryTerms = async (dispatch) => {
  dispatch(deliveryTermsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/delivery/terms', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(deliveryTermsFetchSuccess({ data }));
  } catch (error) {
    dispatch(deliveryTermsFetchFailure(error?.response?.data?.success));
  }
};
// Get All Delivery Terms for quotation form  ends

// Get Quotation Item form start
export const GetQuotationItem = async (dispatch, quo_id, quo_item_id, token) => {
  dispatch(quotationItemFetchStart()); // Dispatch action to indicate start of fetching

  try {
    let url = '/api/quoteitems/items';
    let params = {};

    if (quo_id) {
      params = { quo_id };
    } else if (quo_item_id) {
      params = { quo_item_id };
    }

    const { data } = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params // Pass params object here
    });
    dispatch(quotationItemFetchSuccess({ data })); // Dispatch action with fetched data on success
  } catch (error) {
    dispatch(quotationItemFetchFailure(error?.response?.data?.message || 'Failed to fetch quotation items')); // Dispatch action with error message on failure
  }
};
// Get Quotation Item ends

// Get Payment Type form start
export const GetPaymentType = async (dispatch, token) => {
  dispatch(paymentTypeFetchStart()); // Dispatch action to indicate start of fetching

  try {
    let url = '/api/payment-types';

    const { data } = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(data);
    dispatch(paymentTypeFetchSuccess({ data })); // Dispatch action with fetched data on success
  } catch (error) {
    dispatch(paymentTypeFetchFailure(error?.response?.data?.message || 'Failed to fetch Payment Types')); // Dispatch action with error message on failure
  }
};
// Get Payment Type ends

// Get Quotation Charges start
export const GetQuotationCharges = async (dispatch, quo_id, additional_cost_id, token) => {
  dispatch(quotationChargesFetchStart()); // Dispatch action to indicate start of fetching

  try {
    let url = '/api/quotation/additionalcost';
    let params = {};

    if (quo_id) {
      params = { quo_id };
    } else if (additional_cost_id) {
      params = { additional_cost_id };
    }

    const { data } = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    });

    dispatch(quotationChargesFetchSuccess({ data }));
  } catch (error) {
    dispatch(quotationChargesFetchFailure(error?.response?.data?.message || 'Failed to fetch Quotation Charges')); // Dispatch action with error message on failure
  }
};

//Packing Type in Quotation

export const GetPackagingType = async (dispatch) => {
  dispatch(packagingTypeFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/package/type/drpdn', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(packagingTypeFetchSuccess({ data }));
  } catch (error) {
    dispatch(packagingTypeFetchFailure(error?.response?.data?.success));
  }
};

// Get Quotation Charges ends

// RFQ APIs

export const GetPurchaseOrder = async (dispatch, po_id) => {
  dispatch(purchaseOrderFetchStart());
  try {
    let params = {}; // Initialize params as an empty object

    if (po_id) {
      params.po_id = po_id; // Assign po_id to params if it exists
    }

    const { data } = await axiosInstance.get('/api/po/list', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params // Use the params object
    });

    dispatch(purchaseOrderFetchSuccess({ data }));
  } catch (error) {
    dispatch(purchaseOrderFetchFailure(error?.response?.data?.success || error.message));
  }
};

export const GetPortDestination = async (dispatch) => {
  dispatch(portDestinationFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/port/destination/dropdown', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(portDestinationFetchSuccess({ data }));
  } catch (error) {
    dispatch(portDestinationFetchFailure(error?.response?.data?.success));
  }
};

export const GetRfq = async (dispatch) => {
  dispatch(rfqsFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/rfq/rfqs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(rfqsFetchSuccess({ data }));
  } catch (error) {
    dispatch(rfqsFetchFailure(error?.response?.data?.success));
  }
};

export const GetRfqItemsById = async (dispatch) => {
  dispatch(rfqsByIdFetchStart());
  try {
    const { data } = await axiosInstance.get('/api/rfq/rfqs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(rfqsByIdFetchSuccess({ data }));
  } catch (error) {
    dispatch(rfqsByIdFetchFailure(error?.response?.data?.success));
  }
};

export const GetRfqDetails = async (dispatch, id) => {
  dispatch(rfqsDetailsFetchStart());
  try {
    const { data } = await axiosInstance.get(`/api/rfq/rfq/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(rfqsDetailsFetchSuccess({ data }));
  } catch (error) {
    dispatch(rfqsDetailsFetchFailure(error?.response?.data?.success));
  }
};

export const GetRfqItemsByRfqId = async (dispatch, rfqid) => {
  dispatch(rfqsItemsByRfqIdFetchStart());
  try {
    const { data } = await axiosInstance.get(`/api/rfqitem/itemsbyrfqid`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { rfqid }
    });
    dispatch(rfqsItemsByRfqIdFetchSuccess({ data }));
  } catch (error) {
    console.log(error);
    dispatch(rfqsItemsByRfqIdFetchFailure(error?.response?.data?.success));
  }
};

export const GetRfqVendorsByRfqId = async (dispatch, rfqid) => {
  dispatch(rfqsVendorsByRfqIdFetchStart());
  try {
    const { data } = await axiosInstance.get(`/api/rfq/vendors`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { rfqid }
    });
    dispatch(rfqsVendorsByRfqIdFetchSuccess({ data }));
  } catch (error) {
    console.log(error);
    dispatch(rfqsVendorsByRfqIdFetchFailure(error?.response?.data?.success));
  }
};

//RFQ APIs
