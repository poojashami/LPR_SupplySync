import React, { useState, useCallback, useEffect } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { TableHead, IconButton, Table, TableRow, TableCell, TableBody, Typography, TextField, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContainerDetailstable from './containerDataTable';
import TerminalExpense from './terminalExpenseDetailEntry';
import LapseEntry from './lapseEntry';
import { axiosInstance } from 'utils/axiosInstance';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const EditableCell = styled(TableCell)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  '&:hover .editText': {
    visibility: 'visible'
  }
}));

const EditText = styled(Typography)(({ theme }) => ({
  visibility: 'hidden',
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: '0.75rem', // Smaller font size for the "Edit" text
  color: theme.palette.primary.main, // Primary color for "Edit"
  fontWeight: 'normal',
  paddingRight: theme.spacing(1),
  whiteSpace: 'nowrap'
}));

export default function TerminalView({ terminalData }) {
  const [data, setData] = useState({});

  useEffect(() => {
    console.log(terminalData);
    setData(terminalData);
  }, []);

  const [dataToUpdate, setDataToUpdate] = useState({});

  const [editMode, setEditMode] = useState({
    field: null
  });

  const [showContainerDetail, setShowContainerDetail] = useState(false);
  const [showTermminalExpense, setShowTermminalExpense] = useState(false);
  const [showLapseEntry, setShowLapseEntry] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  const handleEditClick = (field) => {
    setEditMode({ field });
  };

  const handleInputChange = (event, field) => {
    const newValue = event.target.value;
    setDataToUpdate({ ...dataToUpdate, [field]: newValue });
    setData((prevData) => {
      const updatedData = { ...prevData, [field]: newValue };
      setHasChanges(JSON.stringify(updatedData) !== JSON.stringify(prevData));
      return updatedData;
    });
  };

  const handleBlur = () => {
    setEditMode({ field: null });
  };

  const handle = async () => {
    try {
      const { data } = await axiosInstance.put('/api/shipping/terminal/update', { ...dataToUpdate, ci_id: terminalData.ci_no });
      toast.success(data?.msg || data?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderCell = (field) => {
    const isEditing = editMode.field === field;
    return isEditing ? (
      editMode.field === 'tdo_received_date' || editMode.field === 'tdo_valid_till' ? (
        <DatePicker
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%'
          }}
          value={dayjs()}
          onChange={(date) => handleInputChange({ target: { value: date.toString() } }, field)}
        />
      ) : (
        <TextField
          sx={{
            '& .MuiInputBase-input': {
              padding: '7px'
            },
            width: '100%'
          }}
          value={data[field]}
          onChange={(event) => handleInputChange(event, field)}
          onBlur={handleBlur}
          autoFocus
          size="small"
        />
      )
    ) : (
      <Box sx={{ position: 'relative' }}>
        <Typography>{data[field]}</Typography>
        <EditText className="editText" onClick={() => handleEditClick(field)}>
          Edit
        </EditText>
      </Box>
    );
  };

  const [showTableHeading, setShowTableHeading] = useState({
    basicDetails: true,
    otherDetails: true,
    additionalCharges: true,
    statusDetails: true
  });

  const toggleTableBody = useCallback((sectionName) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName]
    }));
  }, []);

  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
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
      {showContainerDetail ? (
        <ContainerDetailstable />
      ) : showTermminalExpense ? (
        <TerminalExpense />
      ) : showLapseEntry ? (
        <LapseEntry />
      ) : (
        <>
          <Table style={{ padding: '2vh' }}>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Supplier Name:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('supplier_name')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    CI No:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('ci_no')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    CI Date:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('ci_date')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    BL No:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('bl_no')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    BL Date:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('bl_date')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PFI No.:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('pfi_no')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    PFI Date:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('pfi_date')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Form M No.:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('formm_no')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Form M Date:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('formm_date')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    No of Container:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('no_of_container')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Agency Name:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('agency_name')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    ETA:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('eta')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Vessel Name / Flight Number:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('vessel_name')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Discharge Terminal:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('discharge_terminal')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Transfer Terminal:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('transfer_terminal')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Free Days:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('free_days')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    CBM:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('cbm')}</EditableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    TDO Received Date:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('tdo_received_date')}</EditableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    TDO Valid Till:
                  </Typography>
                </TableCell>
                <EditableCell>{renderCell('tdo_valid_till')}</EditableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handle} variant="contained" color="primary" disabled={!hasChanges}>
              Update
            </Button>
          </Box>

          {renderTableHeader('basicDetails', 'Additional Action')}
          {showTableHeading.basicDetails && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={() => setShowContainerDetail(true)}>
                Update Discharge Date || Update Transfer Date || Update TDO Validation
              </Button>
              <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={() => setShowTermminalExpense(true)}>
                Update Terminal Expense || Update Terminal Provisions
              </Button>

              <Button variant="outlined" color="primary" sx={{ mr: 2 }} onClick={() => setShowLapseEntry(true)}>
                Add Lapse
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
}
