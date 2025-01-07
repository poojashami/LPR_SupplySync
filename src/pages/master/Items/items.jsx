import { Button, Box, Link, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import ItemForm from './itemForm';
import ItemView from './itemView';
import { useDispatch, useSelector } from 'react-redux';
import { GetItems } from 'Redux/Apis/GetApiCalls';
import PlusButton from 'components/CustomButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
// ==============================|| Items Page ||============================== //

export default function ItemsPages() {
  const dispatch = useDispatch();
  const { items, isFetching } = useSelector((state) => state.itemMaster);

  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [itemsData, setItemsData] = useState([]);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    const mappedData = items.map((item, index) => ({
      id: index + 1,
      item_series: item.item_series,
      item_name: item.item_name,
      item_code: item.item_code,
      factory: item.factory,
      item_type: item.item_type,
      item_description: item.item_description,
      hsn_code: item.hsn_code,
      group_name: item.group_name,
      sub_group: item.sub_group,
      cria: item.cria,
      nafdac_name: item.nafdac_name,
      nafdac_category: item.nafdac_category,
      tolerance: item.tolerance,
      vendors: item.vendors,
      lead_time: item.lead_time,
      quantity_in_stock: item.quantity_in_stock,
      quantity_on_order: item.quantity_on_order,
      reorder_level: item.reorder_level,
      unit_price: item.unit_price,
      msrp: item.msrp,
      is_discontinued: item.is_discontinued,
      notes: item.notes,
      uom_id: item.uom_id,
      item_img: item.item_img
    }));

    setItemsData(mappedData);
    return () => {};
  }, [items]);
  console.log('items:', itemsData);

  // Define columns
  const columns = [
    { field: 'id', headerName: 'S.NO', width: 50 },
    {
      field: 'item_series',
      headerName: 'Item Series',
      width: 150,
      renderCell: (params) => (
        <Link component="button" onClick={() => handleView(params.row.id)}>
          {params.row.item_series}
        </Link>
      )
    },
    { field: 'item_type', headerName: 'Item Category', width: 150 },
    { field: 'item_code', headerName: 'Item Code', width: 150 },
    { field: 'item_name', headerName: 'Item Name', width: 200 },
    { field: 'factory', headerName: 'Factory', width: 150 },
    { field: 'item_description', headerName: 'Item Description', width: 100 },
    { field: 'hsn_code', headerName: 'Hsn Code', width: 100 },
    { field: 'group_name', headerName: 'Group', width: 150 },
    { field: 'sub_group', headerName: 'Sub Group', width: 200 },
    { field: 'cria', headerName: 'CRIA', width: 100 },
    { field: 'nafdac_name', headerName: 'Nafdac Name', width: 150 },
    { field: 'nafdac_category', headerName: 'Nafdac Category', width: 200 },
    { field: 'tolerance', headerName: 'Tolerance', width: 150 },
    { field: 'vendors', headerName: 'Vendors', width: 150 },
    { field: 'lead_time', headerName: 'Lead Time', width: 100 },
    { field: 'quantity_in_stock', headerName: 'Quantity In Stock', width: 200 },
    { field: 'quantity_on_order', headerName: 'Quantity On Order', width: 100 },
    { field: 'reorder_level', headerName: 'Reorder Level', width: 150 },
    { field: 'unit_price', headerName: 'Unit Price', width: 200 },
    { field: 'msrp', headerName: 'MSRP', width: 150 },
    { field: 'is_discontinued', headerName: 'Is Discontinued', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 100 },
    { field: 'uom_id', headerName: 'Unit Of Measurement', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const navigate = useNavigate();

        const handleEdit = (id) => {
          // Your edit action logic here
          console.log('Edit:', id);
        };

        const handleOpen = () => {
          navigate('/nafdac');
        };

        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleOpen}>
              <UploadFileIcon />
            </IconButton>
          </div>
        );
      }
    }
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
            {!showItemForm && !viewItem ? <span>Item list</span> : <span>{showItemForm ? 'Create Item' : 'Item Details'}</span>}

            {!showItemForm && !viewItem ? (
              <PlusButton label="+Create Item" onClick={handleCreateItem} />
            ) : (
              <PlusButton label="Back" onClick={handleCloseForm} />
            )}
          </Box>
        }
      >
        {showItemForm ? (
          <ItemForm item={selectedItem} formMode={formMode} onClose={handleCloseForm} onFormSubmit={handleFormSubmit} />
        ) : viewItem ? (
          <ItemView item={viewItem} onClose={handleCloseForm} />
        ) : (
          <div>
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
                  borderBottom: '2px solid rgba(224, 224, 224, 1)'
                }
              }}
              loading={isFetching}
              rows={itemsData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        )}
      </MainCard>
    </>
  );
}
