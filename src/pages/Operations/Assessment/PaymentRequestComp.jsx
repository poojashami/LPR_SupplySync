import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, TextField, Select, MenuItem, Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';



const PaymentRequestComp = ({ bank_name, bank_id, ci_id }) => {

    const [selectedMilestone, setSelectedMilestone] = useState('');
    const [milestoneAmount, setMilestoneAmount] = useState('');
    const [amount, setAmount] = useState('');
    const [bankTypeId, setBankTypeId] = useState('');
    const [selectedVendorBank, setSelectedVendorBank] = useState([]);

    const [paybleAmount, setPaybleAmount] = useState('');
    const [remarks, setRemarks] = useState('');




    // http://192.168.1.42:4000/api/payment-types/




    const handleSave = () => {
        // Handle save logic here
        console.log({
            paybleAmout: paybleAmount,
            remarks: remarks,
            bank_name: bank_name,
            // doc_type: 'Assesment Agent',
            // doc_id: '',
            // po_number: ci_num,
            // po_amount: oprViewData.total_cost,
            // advice_amount: +amount,
            // advice_date: formattedDateTime,
            // vendor_id: 7,
            // bank_type_id: bankTypeId,
            // amount_payment_term: milestoneAmount,
            // remarks: remarks,
            // payment_type_id: 0
        })
    };





    return (
        <div style={{ padding: '20px', border: '2px dashed black', borderRadius: '12px' }}>
            <Table>
                <TableBody>
                    <TableRow sx={{ marginBottom: '10px', marginTop: '10px' }}>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell colSpan={3}>
                        </TableCell>

                        <TableCell colSpan={3}>
                            <Typography variant="subtitle1">Amount Payable</Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="number"
                                value={paybleAmount}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '6px',
                                    },
                                    '& .Mui-disabled': {
                                        '-webkit-text-fill-color': '#4f4f4f',
                                    },
                                    width: '100%',
                                }}
                                onChange={(e) => (setPaybleAmount(e.target.value))}
                            />
                        </TableCell>

                        <TableCell colSpan={3}>
                            <Typography variant="subtitle1">Vendor Bank </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="text"
                                disabled
                                value={bank_name}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '6px',
                                    },
                                    '& .Mui-disabled': {
                                        '-webkit-text-fill-color': '#4f4f4f',
                                    },
                                    width: '100%',
                                }}
                            />
                        </TableCell>

                        <TableCell colSpan={3}>
                            <Typography variant="subtitle1">Remarks </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="remarks"
                                name="remarks"
                                placeholder="Remarks"
                                value={remarks}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        padding: '6px',
                                    },
                                    '& .Mui-disabled': {
                                        '-webkit-text-fill-color': '#4f4f4f',
                                    },
                                    width: '100%',
                                }}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </TableCell>
                        <TableCell
                            colSpan={3}
                            sx={{
                                '.MuiTableCell-root': {
                                    paddingBottom: '0px',
                                },
                            }}
                        >
                            <Button fullWidth onClick={handleSave} color="primary" variant="contained">
                                Confirm
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div style={{ display: 'flex', marginLeft: '50px' }}>
                <Typography variant="body1">Selected Vendor Bank Details : </Typography>
                <Typography variant="body1">
                    Bank Name: {selectedVendorBank[0]?.bank_name}, Acount No.:{selectedVendorBank[0]?.bank_account_number}, IFSC Code:
                    {selectedVendorBank[0]?.bank_ifsc_code}
                </Typography>
            </div>
        </div>
    );
};

export default PaymentRequestComp;
