import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  IconButton,
  Paper,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { styled } from '@mui/material/styles';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';

export default function PFIView({ pfiData }) {
  console.log('pfiData', pfiData);
  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additionalCharges: true,
    ItemDetails: true,
    statusDetails: true,
    bankDetails: true
  });

  const [ItemData, setItemData] = useState([]);
  const [bankLists, setBankLists] = useState([]);
  const [selectBank, setSelectBank] = useState();
  const [selectBankDetails, setSelectBankDetails] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/pfi/addbank', {
        pfi_id: pfiData.pfi_id,
        v_banks_detail_id: selectBank
      });
      toast.success('Bank Added Successfully');
    } catch (error) {
      console.error('Error:', error); // Handle errors here
    }
  };

  const stockItemColumns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    { field: 'item_type', headerName: 'Item Category', width: 100 },
    { field: 'item_code', headerName: 'Item Code', width: 100 },
    { field: 'bh_item_name', headerName: 'BH Item Name', width: 200 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'hsn_code', headerName: 'HSN Code', width: 100 },
    {
      headerName: 'NAFDAC Req.',
      field: 'nafdacRequired',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'SON Req.',
      field: 'son_required',
      width: 100,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    {
      headerName: 'CRIA Req.',
      field: 'cria_required',
      width: 150,
      renderCell: (params) => <span>{params.value === 'true' ? 'Yes' : 'No'}</span>
    },
    { field: 'opo_qty', headerName: 'Quantity', width: 100 },
    { field: 'rate', headerName: `Rate (${pfiData?.currency})`, width: 100 },
    { field: 'line_total', headerName: 'Line Total', width: 100 },
    { field: 'pack_type', headerName: 'Pack Type', width: 100 },
    { field: 'pack_size', headerName: 'Pack Size', width: 100 },
    { field: 'no_packs', headerName: 'No. of Packs', width: 100 }
  ];

  useEffect(() => {
    let filterBank = bankLists?.filter((i) => i.v_banks_detail_id == selectBank);
    setSelectBankDetails(filterBank);
  }, [selectBank]);

  useEffect(() => {
    let fetchBanks = async () => {
      const { data } = await axiosInstance.get('/api/vendor/bankdropdn');
      console.log('data', data);
      setBankLists(data);
    };
    fetchBanks();
    setItemData(
      pfiData?.pfi_line_items?.map((item, index) => ({
        id: index + 1,
        item_type: item?.item_type,
        item_code: item?.item_code,
        item_name: item?.item_name,
        bh_item_name: item?.bh_item_name,
        hsn_code: item?.ItemsMaster?.hsn_code,
        nafdacRequired: item?.ItemsMaster?.nafdacRequired,
        son_required: item?.ItemsMaster?.son_required,
        cria_required: item?.quotation_item?.cria_required,
        opo_qty: item?.opo_qty,
        rate: item?.rate,
        line_total: item?.line_total,
        remarks: item?.remarks,
        no_packs: item?.no_packs,
        pack_size: item?.pack_size,
        pack_type: item?.pack_type_name
      }))
    );
  }, []);

  useEffect(() => {
    setSelectBank(pfiData?.VendorsBanksDetailsMaster?.bank_type_id);
    let filterBank = bankLists?.filter((i) => i.v_banks_detail_id == pfiData?.VendorsBanksDetailsMaster?.bank_type_id);
    setSelectBankDetails(filterBank);
  }, [pfiData, bankLists]);

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h7" fontWeight={600}>
              {sectionLabel}
            </Typography>
            <IconButton size="large" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  return (
    <>
      <Pfi_Data pfi_id={pfiData?.pfi_id} />
      <Table style={{ padding: '2vh' }}>
        {renderTableHeader('bankDetails', 'Add Bank')}
        {showTableHeading.bankDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Select Bank:
                </Typography>
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  value={Number(selectBank)}
                  onChange={(e) => setSelectBank(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '7px'
                    },
                    width: '100%'
                  }}
                >
                  {bankLists?.map((item, index) => (
                    <MenuItem key={index} value={item?.v_banks_detail_id}>
                      {item?.bank_name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank Account Number:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{selectBankDetails[0]?.bank_account_number}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank IFSC Code:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{selectBankDetails[0]?.bank_ifsc_code}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Bank Name:
                </Typography>
              </TableCell>
              <TableCell colSpan={5}>
                <Typography>{selectBankDetails[0]?.bank_name}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" type="Submit" name="Submit" onClick={handleSubmit}>
          Allocate Bank
        </Button>
      </Box>

      {/* {ItemData && (
        <>
          <Table>{renderTableHeader('ItemDetails', 'Additional Charges & Required Documents')}</Table>
          {showTableHeading.ItemDetails && (
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
              <DataGrid
                sx={{
                  minHeight: '30vh',
                  '& .MuiDataGrid-cell': {
                    border: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid rgba(224, 224, 224, 1)',
                    height: '25px !important',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  },
                  '& .MuiDataGrid-scrollbar': {
                    height: '8px'
                  }
                }}
                rows={ItemData}
                columns={stockItemColumns}
                rowHeight={25}
                hideFooter
                hideFooterPagination
              />
            </Box>
          )}
        </>
      )} */}
    </>
  );
}
