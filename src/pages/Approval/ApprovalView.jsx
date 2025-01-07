import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box, IconButton, Button } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { axiosInstance } from 'utils/axiosInstance';

export default function ApprovalView({ approvalViewData }) {
  const [showTableHeading, setShowTableHeading] = useState({
    oprDetails: true,
    dutyCMC: true,
    terminal: true,
    shipping: true,
    govtAgency: true,
    transport: true,
    customClearing: true,
    otherExpense: true,
    insurance: true,
    bankCharges: true,
    remittance: true,
    summary: true
  });

  const [govt_charges, setGovt_charges] = useState([]);
  const [custom_clearance, setCustom_clearance] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [transport, setTransport] = useState([]);
  const [dutycmc, setDutycmc] = useState([]);
  const [shipping, setShipping] = useState([]);
  const [other_expense, setOther_expense] = useState([]);
  const [terminal, setTerminal] = useState([]);

  console.log("approvalViewData", approvalViewData)

  useEffect(() => {
    const data = [approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.other_govt_charge].map((item, index) => ({
      id: index + 1,
      date: item?.updatedAt?.split('T')[0],
      particulars: item?.remarks,
      amount: item?.payment_total,
      processor: item?.penalty_approved_by,
      Client: '-',
      Agent: '-',
      ho_no: '-',
      accounts: '-',
      reimbursement: '-'
    }));

    const dataX = [approvalViewData?.opo_master.pfi_masters[0].govt_charge].map((item, index) => ({
      id: index + data.length + 1, // Ensure unique ID by adding `data.length`
      date: item?.invoice_date?.split('T')[0],
      particulars: item?.narration,
      amount: item?.amount,
      processor: item?.penalty_approved_by,
      Client: '-',
      Agent: '-',
      ho_no: '-',
      accounts: '-',
      reimbursement: '-'
    }));

    // Flatten the previous state to make sure we don't add a nested array
    setGovt_charges((prev) => {
      // Flatten the previous state to avoid nested arrays
      const flattenedPrev = prev.flat();
      return [...flattenedPrev, ...data, ...dataX];
    });

    const data2 = [approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.other_govt_charge].map((item, index) => ({
      id: index + 1,
      date: item?.updatedAt?.split('T')[0],
      particulars: '-',
      amount: '-',
      processor: '-',
      Client: '-',
      Agent: '-',
      ho_no: '-',
      accounts: '-',
      reimbursement: '-'
    }));
    setCustom_clearance(data2);

    const data3 = [approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.other_govt_charge].map((item, index) => ({
      id: index + 1,
      date: item?.application_date?.split('T')[0],
      particulars: item?.remarks,
      amount: item?.sum_insured_usd,
      processor: item?.updated_by,
      Client: '-',
      Agent: '-',
      ho_no: '-',
      accounts: '-',
      reimbursement: '-'
    }));
    setInsurances(data3);

    const data4 = [approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.assessment].map((item, index) => ({
      id: index + 1,
      date: item?.assessment_date?.split('T')[0],
      particulars: 'Assessment charges',
      amount: item?.total_duty,
      processor: item?.updated_by,
      Client: '-',
      Agent: '-',
      ho_no: '-',
      accounts: '-',
      reimbursement: '-'
    }));
    setDutycmc(data4);

    const data5 = [approvalViewData?.opo_master.pfi_masters[0].govt_charge].map((item, index) => ({
      id: index + 1,
      date: item?.invoice_date?.split('T')[0],
      particulars: item?.other_head,
      amount: item?.other_amount,
      processor: item?.penalty_approved_by,
      Client: '-',
      Agent: '-',
      ho_no: '-',
      accounts: '-',
      reimbursement: '-'
    }));
    setOther_expense(data5);

    fetchtransport(approvalViewData.shippment_advise_master.shipment_advise_items[0].ci_id);
    fetchshipping(approvalViewData.shippment_advise_master.shipment_advise_items[0].ci_id);
  }, []);

  const fetchtransport = async (id) => {
    try {
      const { data } = await axiosInstance('/api/operation/container/allocation/add/bill', {
        params: {
          ci_id: id
        }
      });
      const mapped = data?.map((item, index) => ({
        id: index + 1,
        date: item?.updatedAt?.split('T')[0],
        particulars: item?.narration,
        amount: item?.amount,
        processor: item?.updated_by,
        Client: '-',
        Agent: '-',
        ho_no: '-',
        accounts: '-',
        reimbursement: '-'
      }));
      setTransport(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchshipping = async (id) => {
    try {
      const { data } = await axiosInstance('/api/commercial/invoice/shipping/expense', {
        params: { ci_id: id }
      });
      const mapped =
        data
          ?.filter((item) => item?.type !== 'Terminal')
          .map((item, index) => ({
            id: index + 1,
            date: item?.updatedAt?.split('T')[0],
            particulars: item?.narration,
            amount: item?.total,
            processor: item?.updated_by,
            Client: '-',
            Agent: '-',
            ho_no: '-',
            accounts: '-',
            reimbursement: '-'
          })) || [];

      // Second API request
      const { data: data2 } = await axiosInstance('/api/commercial/invoice/shipping/expense/lapse', {
        params: { ci_id: id }
      });
      const mappedX =
        [data2].map((item, index) => ({
          id: index + 99,
          date: mapped[0]?.date?.split('T')[0],
          particulars: 'Lapse Expense',
          amount: item?.lapse_amount,
          processor: item?.updated_by,
          Client: '-',
          Agent: '-',
          ho_no: '-',
          accounts: '-',
          reimbursement: '-'
        })) || [];
      console.log('asdasd', [...mapped, ...mappedX], [data2]);
      // Merge both arrays and set the state
      setShipping([...mapped, ...mappedX]);

      const mapped2 = data
        ?.filter((item) => item?.type === 'Terminal')
        .map((item, index) => ({
          id: index + 1,
          date: item?.updatedAt?.split('T')[0],
          particulars: item?.narration,
          amount: item?.total,
          processor: item?.updated_by,
          Client: '-',
          Agent: '-',
          ho_no: '-',
          accounts: '-',
          reimbursement: '-'
        }));
      setTerminal(mapped2);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
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
  const dutyCMC = [
    { headerName: 'DATE', field: 'date' },
    { headerName: 'PARTICULARS', field: 'particulars', width: 280 },
    { headerName: 'AMOUNT', field: 'amount' },
    { headerName: 'PROCESSOR', field: 'processor' },
    {
      headerName: 'Client',
      field: 'Client',
      renderCell: () => {
        return <input type="checkbox" />;
      }
    },
    {
      headerName: 'Agent',
      field: 'Agent',
      renderCell: () => {
        return <input type="checkbox" />;
      }
    },
    {
      headerName: 'HO',
      field: 'ho_no',
      renderCell: () => {
        return <input type="checkbox" />;
      }
    },
    { headerName: 'ACCOUNTS', field: 'accounts' },
    { headerName: 'REIMBURSEMENT', field: 'reimbursement', width: 140 }
  ];
  const dutyCMCData = [
    {
      id: 1,
      date: '2024-08-01',
      particulars: 'Payment for services',
      amount: 1500,
      processor: 'John Doe',
      Client: 200,
      Agent: 300,
      ho_no: 400,
      accounts: 500,
      reimbursement: 100
    },
    {
      id: 2,
      date: '2024-08-02',
      particulars: 'Purchase of goods',
      amount: 2500,
      processor: 'Jane Smith',
      Client: 300,
      Agent: 400,
      ho_no: 500,
      accounts: 600,
      reimbursement: 200
    }
  ];
  const createData = (particular, amountLessVAT, vat, total) => {
    return { particular, amountLessVAT, vat, total };
  };

  const rows = [
    createData('Terminal', 100, 20, 65),
    createData('Shipping', 200, 40, 65),
    createData('Custom', 300, 60, 65),
    createData('Transport', 150, 30, 65),
    createData('Govt. Agency', 120, 24, 65),
    createData('Other Expenses', 80, 16, 65),
    createData('Insurance', 50, 10, 65),
    createData('Bank Charges', 75, 15, 65),
    createData('Remittance', 90, 18, 65),
    createData('Total', 1165, 233, 650) // Example totals
  ];
  return (
    <>
      <Table>
        {renderTableHeader('oprDetails', 'OPR-22-CMC-0092')}
        {showTableHeading.oprDetails && (
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  UK-MUM/CO-ORDINATOR NAME:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.co_ordinator_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PFI No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.pfi_num}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Inv No.:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.ci_num}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Description of Goods:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.pfi_description}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Unit:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.unit}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  C No:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.assessment?.c_number}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Port of Origin:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.shippment_advise_master.port_of_loading}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Vessel:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.vessel_name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Revised ETA Date:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.eta_date}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  No. of Container:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.add_shippment_containers?.length}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  GROSS WEIGHT/CBM:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.commercial_invoice?.total_gross_weight}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  CFR AMOUNT:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.paar?.cfr_invoice_amount}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  REMITTANCE TERMS:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.remittance_terms}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  B.L/AWB NUMBER:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.add_shippment_containers[0]?.bl_num}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  FORM M NO:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.opo_master?.pfi_masters[0]?.form_ms[0]?.form_m_num}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  Sender:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData.sender}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  ETA:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.shippment_advise_master?.eta}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  FREE DAYS:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.shippment_advise_master?.free_days}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                  PORT OF DESTINATION:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{approvalViewData?.shippment_instruction?.final_destination}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      {/* Duty CMC */}
      <Table sx={{ paddingTop: 2 }}>
        {renderTableHeader('dutyCMC', 'Duty')}
        {showTableHeading.dutyCMC && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={dutycmc}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Terminal */}
      <Table sx={{ paddingTop: 2 }}>
        {renderTableHeader('terminal', 'Terminal')}
        {showTableHeading.terminal && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={terminal}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Shipping */}
      <Table>
        {renderTableHeader('shipping', 'Shipping')}
        {showTableHeading.shipping && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={shipping}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Govt Agency */}
      <Table>
        {renderTableHeader('govtAgency', 'Govt. Agency Charges')}
        {showTableHeading.govtAgency && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={govt_charges}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Transport */}
      <Table>
        {renderTableHeader('transport', 'Transport')}
        {showTableHeading.transport && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={transport}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Custom Clearing */}
      <Table>
        {renderTableHeader('customClearing', 'Custom Clearing')}
        {showTableHeading.customClearing && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={custom_clearance}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Other Expense */}
      <Table>
        {renderTableHeader('otherExpense', 'Other Expense')}
        {showTableHeading.otherExpense && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={other_expense}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Insurance */}
      <Table>
        {renderTableHeader('insurance', 'Insurance')}
        {showTableHeading.insurance && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={insurances}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Bank Charges */}
      <Table>
        {renderTableHeader('bankCharges', 'Bank Charges')}
        {showTableHeading.bankCharges && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={dutyCMCData}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Remittance */}
      <Table>
        {renderTableHeader('remittance', 'Remittance')}
        {showTableHeading.remittance && (
          <DataGrid
            getRowHeight={() => 'auto'}
            sx={{
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
            rows={dutyCMCData}
            columns={dutyCMC}
            hideFooter
          />
        )}
      </Table>
      {/* Summary */}
      <Table>
        {renderTableHeader('summary', 'Summary')}
        {showTableHeading.summary && (
          <div style={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '60%' }}>PARTICULAR</TableCell>
                <TableCell sx={{ width: '20%' }} align="right">
                  AMOUNT LESS VAT
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="right">
                  VAT
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="right">
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.particular}
                  </TableCell>
                  <TableCell align="right">{row.amountLessVAT}</TableCell>
                  <TableCell align="right">{row.vat}</TableCell>
                  <TableCell align="right">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </div>
        )}
      </Table>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span>Approval Remark:</span>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="remark"
                  style={{ width: '45%', marginLeft: '10px' }} // Adjust margin if needed
                />
              </Typography>
            </TableCell>
            <TableCell>
              <Button variant="outlined" color="primary">
                Process - Receipted Expense
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
