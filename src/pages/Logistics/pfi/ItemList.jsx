import { Button, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import formatNumber from 'utils/functions';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { axiosInstance } from 'utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { GetPackagingType } from 'Redux/Apis/GetApiCalls';
import CustomNumberField from 'components/NoArrowTextField';
import SelectFieldPadding from 'components/selectFieldPadding';

const ItemList = ({ poGRNData, po_id, po_data }) => {
  const dispatch = useDispatch();
  const { quoPackagingType } = useSelector((state) => state.quotation);
  const [marginLine, setMarginLine] = useState({});
  const [PoData, setPoData] = useState({});
  const [quotationItm, setQuotationItm] = useState([]);

  useEffect(() => {
    GetPackagingType(dispatch);
  }, []);

  const getData = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/po/list', {
        params: {
          po_id: id
        }
      });
      setPoData(data);
      console.log(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getData(poGRNData?.po_id);
    try {
      axiosInstance.get(`/api/po/itemlist?po_id=${po_id}`).then(({ data }) => {
        const mapdata = data?.map((item, index) => ({
          item_id: item.item_id,
          id: index + 1,
          item_type: item?.ItemsMaster?.item_type,
          itemSpecification: item?.ItemsMaster?.item_code,
          itemDescription: item?.ItemsMaster?.item_description,
          uom: item?.uom,
          item_name: item?.ItemsMaster?.item_name,
          opoQty: formatNumber(item.po_qty),
          quoteQty: item.quote_qtd,
          rate: item.rate,
          remarks: item.remarks
        }));
        const mapper = mapdata?.map((item) => ({
          ...item,
          currency: po_data?.opo_master?.quotation_master?.currency
        }));
        setQuotationItm(mapper);
      });
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const handleInputTextField = (e, id) => {
    const { name, value } = e.target;
    setMarginLine((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: Number(value) }
    }));
  };
  const handleSubmitQuantity = async (e) => {
    e.preventDefault();
    console.log(quotationItm);
    const itemList = Object.values(marginLine);
    const mappedData = {
      buying_house_id: 5,
      po_id: po_data?.po_id,
      vendor_id: po_data?.vendor_id,
      po_item_id_lists: quotationItm.map((item, index) => ({ grn_qty: itemList[index].quantity, po_item_id: item.item_id }))
    };
    const { data } = await axiosInstance.post('/api/bhouse/grnentry', mappedData);
    toast.success(data.message);
  };
  const calculateTotalpacks = (itemCost) => {
    let totalCost = {};
    for (let key in itemCost) {
      const qty = itemCost[key].qty;
      const pack_size = itemCost[key].pack_size;
      totalCost[key] = qty / pack_size;
    }
    // setSum((preVal) => preVal + totalCost);
    return totalCost;
  };
  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'itemSpecification', headerName: 'Item Specification', width: 150 },
    { field: 'itemDescription', headerName: 'Item Description', width: 150 },
    { field: 'opoQty', headerName: 'PO Quantity', width: 150 },
    // { field: 'quoteQty', headerName: 'Quote Quantity', width: 150 },
    {
      field: 'rate',
      headerName: 'PO Rate',
      width: 100,
      valueGetter: (_, data) => {
        console.log(data.rate);
      }
    },
    { field: 'currency', headerName: 'Currency', width: 100 },
    { field: 'remarks', headerName: 'PO Remarks', width: 100 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150,
      renderCell: (params) => (
        <CustomNumberField
          type="number"
          name="quantity"
          value={marginLine[params.row.id]?.quantity || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    },
    {
      field: 'pack_type',
      headerName: 'Pack Type',
      width: 150,
      renderCell: (params) => (
        <div style={{ height: '100%', display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Select
            fullWidth
            as={SelectFieldPadding}
            variant="outlined"
            name="pack_type"
            value={marginLine[params.row.id]?.pack_type || ''}
            onChange={(e) => handleInputTextField(e, params.row.id)}
          >
            <MenuItem value="0" selected>
              <em>select</em>
            </MenuItem>
            {quoPackagingType.map((data) => (
              <MenuItem key={data.package_id} value={data.package_id}>
                {data.package_type}
              </MenuItem>
            ))}
          </Select>
        </div>
      )
    },
    {
      field: 'pack_size',
      headerName: 'Pack Size',
      width: 150,
      renderCell: (params) => (
        <CustomNumberField
          type="number"
          name="pack_size"
          value={marginLine[params.row.id]?.pack_size || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    },
    {
      field: 'no_of_packs',
      headerName: 'Number of Packs',
      width: 150,
      renderCell: (params) => (
        <CustomNumberField
          type="number"
          name="no_of_packs"
          // value={calculateTotalpacks(itemCost)[params.row.id] || ''}
          value={marginLine[params.row.id]?.no_of_packs || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    }
  ];

  return (
    <>
      {/* <Typography variant="h6">
        <h3 style={{ padding: '0', margin: '0' }}>
          PO Number (
          <span className="text-primary" style={{ color: 'blue' }}>
            {poGRNData?.po_num}
          </span>
          ) PO Date (
          <span className="text-primary" style={{ color: 'blue' }}>
            {poGRNData?.created_on.split('T')[0]}
          </span>
          )
        </h3>
      </Typography> */}
      {/* <Box>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{PoData?.VendorsMaster?.vendor_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Currency:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{poGRNData?.currency}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Delivery Terms:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography>{poGRNData?.delivery_terms}</Typography>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box> */}
      <div>
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            // minHeight: '30vh',
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '30px !important',
              padding: '0px !important',
              '&:hover': {
                backgroundColor: '#e0f7fa'
              }
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              border: '1px solid rgba(224, 224, 224, 1)',
              height: '25px !important',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'start'
            },
            '& .MuiDataGrid-scrollbar': {
              height: '8px'
            }
          }}
          rows={quotationItm}
          columns={stockItemColumns}
          pagination={false}
          hideFooterPagination
        />
      </div>
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
        {/* <Button variant="outlined" color="error" sx={{ ml: 2 }}>
          Close
        </Button> */}
        <Button variant="contained" onClick={handleSubmitQuantity} sx={{ ml: 2 }}>
          Save
        </Button>
      </div>
    </>
  );
};

export default ItemList;
