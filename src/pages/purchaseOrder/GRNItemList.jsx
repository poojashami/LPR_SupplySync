import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Modal, TableHead, Table, IconButton, Button, Typography, Box, TableCell, TableRow, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import CustomNumberField from 'components/NoArrowTextField';
import PO_Data from 'components/BasicDataComponent/PO_Data';
import { useNavigate } from 'react-router';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4
};

const GRNItemList = ({ poGRNData, isGRN }) => {
  const navigate = useNavigate();
  const toggleTableBody = (section) => {
    setShowTableBodies((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const [remark, setRemark] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [gdn_id, setGdn_id] = useState(0);
  const [qts, setQts] = useState({});
  const handleClose = () => {
    setRemark('');
    setOpen(false);
  };
  const [marginLine, setMarginLine] = useState({});
  const [PoData, setPoData] = useState({});
  const [quotationItm, setQuotationItm] = useState([]);
  const [showTableBodies, setShowTableBodies] = useState({
    createOPR: true,
    itemsDetail: true,
    itemsTable: true,
    viewOprDetail: false,
    poInfo: true,
    requestDetails: true,
    shipmentDetail: true
  });
  const getData = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/po/list', {
        params: {
          po_id: id
        }
      });
      setPoData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log(isGRN);
    getData(poGRNData.po_id);
    isGRN && fetch_gdn(poGRNData.po_id);
    // fetch_rdn()
    try {
      axiosInstance.get(`/api/po/itemlist?po_id=${poGRNData.po_id}`).then(({ data }) => {
        const mapdata = data?.map((item, index) => ({
          item_id: item.item_id,
          id: index + 1,
          item_type: item?.ItemsMaster?.item_type,
          item_code: item?.ItemsMaster?.item_code,
          itemDescription: item?.ItemsMaster?.item_description,
          uom: item.uom,
          item_name: item?.ItemsMaster?.item_name,
          opoQty: item.po_qty,
          quoteQty: item.quote_qtd,
          rate: item.rate,
          remarks: item.remarks
        }));
        setQuotationItm(mapdata);
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

    let mappedData;

    if (isGRN) {
      mappedData = {
        gdn_id: gdn_id,
        agency_code: 'bh',
        agency_id: 1,
        ref_doc: 'po',
        ref_doc_id: poGRNData.po_id,
        gdnitemsdata: quotationItm.map((item, index) => ({
          po_item_qty: item.opoQty,
          gdn_item_qty: itemList[index].quantity,
          item_id: item.item_id
        }))
      };
    } else {
      mappedData = {
        agency_code: 'ven',
        agency_id: poGRNData.vendor_id,
        ref_doc: 'po',
        ref_doc_id: poGRNData.po_id,
        gdnitemsdata: quotationItm.map((item, index) => ({
          po_item_qty: item.opoQty,
          gdn_item_qty: itemList[index].quantity,
          item_id: item.item_id
        }))
      };
      console.log(mappedData);
    }
    const { data } = await axiosInstance.post('/api/notes/gdn', mappedData);
    toast.success(data.message);
    navigate(-1);
  };

  const fetch_gdn = async (id) => {
    try {
      const { data } = await axiosInstance.get('/api/notes/gdn', {
        params: {
          po_id: id
        }
      });
      setGdn_id(data?.data[data?.data?.length - 1]?.gdn_id);
      const map = data?.data[data?.data?.length - 1]?.GdnItems?.map((item) => ({ [item?.item_id]: item?.gdn_item_qty }));
      setQts(
        map.reduce((acc, obj) => {
          const key = Object.keys(obj)[0];
          acc[key] = obj[key];
          return acc;
        }, {})
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category' },
    { field: 'item_code', headerName: 'Item Code' },
    { field: 'itemDescription', headerName: 'Item Description', width: 200 },
    { field: 'opoQty', headerName: 'PO Quantity' },
    // { field: 'quoteQty', headerName: 'Quote Quantity' },
    { field: 'rate', headerName: 'Rate' },
    // { field: 'remarks', headerName: 'Remarks', width: 150 },
    {
      field: 'item_id',
      headerName: 'Vendor Qty',
      width: 150,
      renderCell: (params) => (
        <span>
          {console.log(qts)} {qts[params.value]}
        </span>
      )
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 150,
      renderCell: (params) => (
        <CustomNumberField
          fullWidth
          type="number"
          name="quantity"
          value={marginLine[params.row.id]?.quantity || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    }
  ];

  const stockItemColumnsVendor = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category' },
    { field: 'item_code', headerName: 'Item Code' },
    { field: 'itemDescription', headerName: 'Item Description', width: 250 },
    { field: 'opoQty', headerName: 'OPO Quantity' },
    { field: 'quoteQty', headerName: 'Vendor Quantity', width: 150 },
    { field: 'rate', headerName: 'Rate' },
    // { field: 'remarks', headerName: 'Remarks', width: 150 },
    {
      field: 'quantity',
      headerName: 'GRN Quantity',
      width: 150,
      renderCell: (params) => (
        <CustomNumberField
          fullWidth
          type="number"
          name="quantity"
          value={marginLine[params.row.id]?.quantity || 0}
          onChange={(e) => handleInputTextField(e, params.row.id)}
        />
      )
    }
  ];
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <Box>
              <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
                {showTableBodies[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
              </IconButton>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  return (
    <>
      <Table>
        {renderTableHeader(
          'poInfo',
          <Typography variant="h6">
            <h3 style={{ padding: '0', margin: '0' }}>
              PO No. (
              <span className="text-primary" style={{ color: 'blue' }}>
                {poGRNData.po_num}
              </span>
              ) PO Date (
              <span className="text-primary" style={{ color: 'blue' }}>
                {poGRNData.created_on.split('T')[0]}
              </span>
              )
            </h3>
          </Typography>
        )}
      </Table>
      {showTableBodies.poInfo && (
        <Box>
          {/* <Table>
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
          </Table> */}
          <PO_Data po_id={poGRNData?.po_id} />
        </Box>
      )}

      <div>
        <Typography variant="h6">
          <h3>Items Details</h3>
        </Typography>
        <DataGrid
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              border: '1px solid rgba(224, 224, 224, 1)',
              height: '25px !important'
            }
          }}
          rows={quotationItm}
          columns={isGRN ? stockItemColumns : stockItemColumnsVendor}
          pagination={false}
          hideFooterPagination
        />
      </div>
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'end' }}>
        <Button onClick={handleOpen} variant="outlined" color="error" sx={{ ml: 2 }}>
          Reject
        </Button>
        <Button variant="contained" onClick={handleSubmitQuantity} sx={{ ml: 2 }}>
          Accept
        </Button>
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography sx={{ marginBottom: '12px' }} id="modal-modal-title" variant="h6" component="h2">
            You are rejecting dispatch from vendor, please add remarks to do so.
          </Typography>
          <TextField
            sx={{ marginBottom: '12px' }}
            fullWidth
            id="remark"
            label="Remarks"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            autoFocus
          />
          <Box sx={{ display: 'flex', justifyContent: 'end', gap: '12px' }}>
            <Button onClick={handleClose} variant="outlined" color="error">
              Close
            </Button>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GRNItemList;
