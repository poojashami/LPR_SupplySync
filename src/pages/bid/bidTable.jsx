import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from 'components/MainCard';
import Typography from '@mui/material/Typography';
import { axiosInstance } from "utils/axiosInstance";



// Define the columns based on the data structure
const columns = [
    { field: "bid_id", headerName: "Bid ID", width: 100 },
    { field: "bid_type", headerName: "Bid Type", width: 150, editable: true },
    { field: "purchase_date", headerName: "Purchase Date", width: 150 },
    { field: "currency", headerName: "Currency", width: 100 },
    { field: "supplier_id", headerName: "Supplier ID", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "formm_no", headerName: "Formm No", width: 100 },
    { field: "lc_no", headerName: "LC No", width: 150 },
    { field: "purchase_company_id", headerName: "Purchase Company ID", width: 150 },
    { field: "bank", headerName: "Bank", width: 150 },
    { field: "amount", headerName: "Amount", width: 120 },
    { field: "adjustment", headerName: "Adjustment", width: 120 },
    { field: "iff_loan", headerName: "IFF Loan", width: 120 },
    { field: "total_bidded", headerName: "Total Bidded", width: 120 },
    { field: "rate", headerName: "Rate", width: 100 },
    { field: "transaction_date", headerName: "Transaction Date", width: 150 },
    { field: "maturity_date", headerName: "Maturity Date", width: 150 },
    { field: "remarks", headerName: "Remarks", width: 250 },
    { field: "created_by", headerName: "Created By", width: 150 },
    { field: "updated_by", headerName: "Updated By", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
];

// Map the provided data to rows


// Render the DataGrid component
export default function DataGridDemo({ fetchbid }) {
    const [bidData, setBidData] = useState([])

    //fetch bid data
    useEffect(() => {
        const fetchBid = async () => {
            try {
                let response = await axiosInstance.get('/api/bid/getall')
                setBidData(response.data.data)
            } catch (error) {

            }
        }
        fetchBid();
    }, [fetchbid])


    return (
        <Box sx={{ height: 600, width: "100%", marginTop: "10px" }}>
            <Typography variant="h7" fontWeight={600} sx={{ marginBottom: "15px" }}>
                Bid List
            </Typography>
            <Box sx={{ marginTop: "15px", paddingLeft: "20px", height: "400px" }}>
                <DataGrid
                    rows={bidData}
                    columns={columns}
                    getRowId={(row) => row.bid_id} // Specify the unique identifier for each row
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 25,
                            },
                        },
                    }}
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
                    pageSizeOptions={[20, 25, 35]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>

    );
}
