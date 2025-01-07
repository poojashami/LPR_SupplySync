import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CompanyForm from './companyForm';
import PlusButton from 'components/CustomButton';
import { GetCompanies } from 'Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';

export default function Company() {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const [formshow, setFormshow] = useState(false);
  const [companiesList, setCompaniesList] = useState([]);

  useEffect(() => {
    GetCompanies(dispatch);
  }, []);
  useEffect(() => {
    console.log(companies);
    const mappedList = companies.map((item, index) => ({
      id: index,
      name: item.company_name,
      status: item.status,
      createdby: item.created_by,
      updatedby: item.updated_by
    }));
    setCompaniesList(mappedList);
  }, [companies]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        const color = status === 'Active' ? 'green' : 'red';

        return <Typography sx={{ color, fontWeight: 'bold' }}>{status === 1 ? 'Inactive' : 'Active'}</Typography>;
      }
    },
    { field: 'createdby', headerName: 'Created By', width: 150 },
    { field: 'updatedby', headerName: 'Updated By', width: 150 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Company</span>
          {formshow ? (
            <PlusButton label={'Back'} onClick={() => setFormshow((val) => !val)} />
          ) : (
            <PlusButton label={'Add Company'} onClick={() => setFormshow((val) => !val)} />
          )}
        </Box>
      }
    >
      {formshow && <CompanyForm formshow={formshow} setFormshow={setFormshow} />}
      {!formshow && (
        <DataGrid getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              border: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid rgba(224, 224, 224, 1)'
            }
          }}
          rows={companiesList}
          columns={columns}
          components={{
            Pagination: () => null
          }}
          pagination={false}
        />
      )}
    </MainCard>
  );
}
