import { axiosInstance } from '../utils/axiosInstance';

export const getLoadDivisions = async () => {
  try {
    const response = await axiosInstance.get('/api/division/dropdown');
    return response.data.map((division) => ({
      id: division.division_id,
      name: division.division_name
    }));
  } catch (error) {
    throw new Error('Error fetching divisions');
  }
};

export const getDeliveryTime = async () => {
  try {
    const response = await axiosInstance.get('/api/delivery/timeline/');
    return response.data.map((timeline) => ({
      id: timeline.delivery_timeline_id,
      name: timeline.delivery_timeline_name
    }));
  } catch (error) {
    throw new Error('Error fetching timeline');
  }
};

export const getShipmentMode = async () => {
  try {
    const response = await axiosInstance.get('/api/shipMode/modes/dropdown');

    return response.data.map((shipmentMode) => ({
      id: shipmentMode.shipment_mode_id,
      name: shipmentMode.shipment_mode_name
    }));
  } catch (error) {
    throw new Error('Error fetching shipment mode');
  }
};

export const getShipmentType = async () => {
  try {
    const response = await axiosInstance.get('/api/shipment/type/dropdown');

    return response.data.map((shipmentType) => ({
      id: shipmentType.shipment_type_id,
      name: shipmentType.shipment_type_name
    }));
  } catch (error) {
    throw new Error('Error fetching shipment mode');
  }
};

export const getReqByDepartment = async () => {
  try {
    const response = await axiosInstance.get('/api/dept/departments');

    return response.data.map((department) => ({
      id: department.dept_id,
      name: department.dept_name
    }));
  } catch (error) {
    throw new Error('Error fetching department');
  }
};

export const getVertical = async () => {
  try {
    const response = await axiosInstance.get('/api/vertical/');
    return response.data.map((item) => ({
      id: item.vertical_id,
      name: item.vertical_name
    }));
  } catch (error) {
    throw new Error('Error fetching vertical');
  }
};

export const getBuyingHouse = async () => {
  try {
    const response = await axiosInstance.get('/api/bh/dropdown');
    return response.data.map((item) => ({
      id: item.buying_house_id,
      name: item.country
    }));
  } catch (error) {
    throw new Error('Error fetching buying house');
  }
};

export const getStockitems = async (id) => {
  try {
    const response = await axiosInstance.get('/api/opr/additems', {
      params: {
        super_category_id: id
      }
    });
    console.log(response);
    const data_list = response?.data?.data?.map((item) => ({
      id: item.item_id,
      name: item.item_name,
      itemCode: item.item_code,
      uom: item.uom_id
      // uom: 'kgs'
    }));
    console.log(data_list);
    return data_list;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching items');
  }
};

export const getUomByStockitemsId = async (id) => {
  try {
    const response = await axiosInstance.get('/api/uom/uoms', {
      params: {
        uom_ids: id
      }
    });
    console.log(response);
    const data_list = response?.data?.map((item) => ({
      id: item.uom_id,
      name: item.uom_name
    }));
    console.log(data_list);
    return data_list;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching items');
  }
};
