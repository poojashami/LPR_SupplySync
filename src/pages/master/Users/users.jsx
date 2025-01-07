import { Button, Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import UserForm from './userForm';
import UseView from './useView';
import { GetUsers } from '../../../Redux/Apis/GetApiCalls';
import { useDispatch, useSelector } from 'react-redux';
import PlusButton from 'components/CustomButton';

export default function UsersPages() {
  const dispatch = useDispatch();
  const { isFetching, users, error } = useSelector((state) => state.usersMaster);
  const [showOprForm, setShowOprForm] = useState(false);
  const [showUserView, setShowUserView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const userData = users.map((user, index) => ({
      id: index + 1,
      user_id: user.user_id,
      userName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phoneNo: user.phone_number,
      currentAddress: `${user?.address1_line1} ${user?.address1_line2} ${user?.city1} ${user?.state1} ${user?.country1} ${user?.postal_code1}`,
      permanentAddress: `${user?.address2_line1} ${user?.address2_line2} ${user?.city2} ${user?.state2} ${user?.country2} ${user?.postal_code2}`,
      date_of_birth: user.date_of_birth,
      designation: user.design_id,
      department: user.dept_id,
      resigDate: user.registration_date,
      role: user.role,
      status: user.is_active ? 'Active' : 'Inactive'
    }));
    setUserData(userData);
  }, [users]);

  // Define columns
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => (
        <Box
          component="span"
          sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => handleView(params.row.id)}
        >
          {params.value}
        </Box>
      )
    },
    { field: 'userName', headerName: 'User Name', width: 150 },
    { field: 'resigDate', headerName: 'Resignation Date', width: 150 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'phoneNo', headerName: 'Phone Number', width: 150 },
    { field: 'date_of_birth', headerName: 'DOB', width: 150 },
    { field: 'designation', headerName: 'Designation', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'currentAddress', headerName: 'Current Address', width: 150 },
    { field: 'permanentAddress', headerName: 'Permanent Address', width: 150 },
    // { field: 'status', headerName: 'Status', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        const color = status === 'Active' ? 'green' : 'red';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography sx={{ color, fontWeight: 'bold' }}>{status}</Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="primary" onClick={() => handleEdit(params.row.id)}>
            Edit
          </Button>
        </Box>
      )
    }
  ];

  const getUserData = async () => {
    try {
      await GetUsers(dispatch);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error state
    }
  };

  const handleCreateOpr = () => {
    setSelectedUser(null);
    setFormMode('create');
    setShowOprForm(true);
    setShowUserView(false); // Hide user view
  };

  const handleEdit = (id) => {
    const user = userData.find((user) => user.id === id);
    setSelectedUser(user);
    setFormMode('edit');
    setShowOprForm(true);
    setShowUserView(false); // Hide user view
  };

  const handleView = (id) => {
    const user = userData.find((user) => user.id === id);
    setSelectedUser(user);
    setShowUserView(true); // Show user view
    setShowOprForm(false); // Hide form
  };

  const handleCloseForm = () => {
    setShowOprForm(false);
    setSelectedUser(null);
    setFormMode('create');
    setShowUserView(false);
  };

  const handleCloseView = () => {
    setShowUserView(false);
    setSelectedUser(null);
  };

  const handleSuccessfulSubmit = () => {
    setShowOprForm(false);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!showOprForm && !showUserView ? <span>User List</span> : !showUserView ? <span>Create User</span> : <span>View User</span>}
          {!showOprForm && !showUserView ? (
            <PlusButton label="+Create User" onClick={handleCreateOpr} />
          ) : (
            <PlusButton label="Back" onClick={handleCloseForm} />
          )}
        </Box>
      }
    >
      {showOprForm ? (
        <UserForm user={selectedUser} onSuccessfulSubmit={handleSuccessfulSubmit} formMode={formMode} onClose={handleCloseForm} />
      ) : showUserView ? (
        <UseView user={selectedUser} onClose={handleCloseView} />
      ) : (
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
          }} loading={isFetching} rows={userData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
      )}
    </MainCard>
  );
}
