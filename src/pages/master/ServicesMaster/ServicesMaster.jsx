import { Button, Box, Link, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import ItemForm from './ServiceMasterForm';
import ItemView from './ServiceMasterView';
import { useDispatch, useSelector } from 'react-redux';
import { GetItems } from 'Redux/Apis/GetApiCalls';
import PlusButton from 'components/CustomButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import ServiceMasterForm from './ServiceMasterForm';
import ServiceMasterView from './ServiceMasterView';
import { toast } from 'react-toastify';
import { axiosInstance } from 'utils/axiosInstance';
// ==============================|| Items Page ||============================== //

export default function ServicesMaster() {
  const dispatch = useDispatch();
  const { items, isFetching } = useSelector((state) => state.itemMaster);

  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [itemsData, setItemsData] = useState([]);
  const [viewItem, setViewItem] = useState(null);

  const getServices = async () => {
    try {
      const { data } = await axiosInstance.get('/api/service/master');
      console.log(data);
      const mappedData = data.map((item, index) => ({
        id: item.service_id,
        item_series: item.service_series,
        item_name: item.service_name,
        item_code: item.service_code,
        item_type: item.service_type
      }));

      setItemsData(mappedData);
      toast.success('Fetched Successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getServices();

    return () => {};
  }, [items]);
  console.log('items:', itemsData);

  // Define columns
  const columns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'item_series',
      headerName: 'Service Series',
      width: 150,
      renderCell: (params) => (
        <Link component="button" onClick={() => handleView(params.row.id)}>
          {params.row.item_series}
        </Link>
      )
    },
    { field: 'item_name', headerName: 'Service Name', width: 200 },
    { field: 'item_code', headerName: 'Service Code', width: 150 },
    { field: 'item_type', headerName: 'Service Type', width: 150 }
  ];

  useEffect(() => {
    getItemsData();
  }, []);

  const getItemsData = async () => {
    await GetItems(dispatch);
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setFormMode('create');
    setShowItemForm(true);
  };

  const handleEdit = (id) => {
    const item = itemsData.find((item) => item.id === id);
    setSelectedItem(item);
    setFormMode('edit');
    setShowItemForm(true);
  };

  const handleView = (id) => {
    const item = itemsData.find((item) => item.id === id);
    setViewItem(item);
  };

  const handleCloseForm = () => {
    setShowItemForm(false);
    setViewItem(false);
    setSelectedItem(null);
    setFormMode('create');
  };

  const handleFormSubmit = () => {
    getItemsData();
    setShowItemForm(false);
  };

  return (
    <>
      <MainCard
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {!showItemForm && !viewItem ? (
              <span>Service Master list</span>
            ) : (
              <span>{showItemForm ? 'Create Service Master' : 'Service Master Details'}</span>
            )}

            {!showItemForm && !viewItem ? (
              <PlusButton label="+Create Service Master" onClick={handleCreateItem} />
            ) : (
              <PlusButton label="Back" onClick={handleCloseForm} />
            )}
          </Box>
        }
      >
        {showItemForm ? (
          <ServiceMasterForm item={selectedItem} formMode={formMode} onClose={handleCloseForm} onFormSubmit={handleFormSubmit} />
        ) : viewItem ? (
          <ServiceMasterView item={viewItem} onClose={handleCloseForm} />
        ) : (
          <div>
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
          }} loading={isFetching} rows={itemsData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
          </div>
        )}
      </MainCard>
    </>
  );
}
