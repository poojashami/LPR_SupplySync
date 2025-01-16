import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Table,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  InputAdornment,
  Select,
  MenuItem
} from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const RFQView = () => {
  const [showTableHeading, setShowTableHeading] = useState({
    rfqView: true,
    lprForm: true,
    heading2: true,
    heading3: true
  });
  const { leadTime, shipmentMode, shipmentType, rfqDelivery, portDestination, respond_time } = useSelector((state) => state.static);
  const [remarksArr, setRemarksArr] = useState([{ remark: '' }]);
  const handleInputChangeFile = (e, index, key) => {
    const updatedRemarks = [...remarksArr];
    updatedRemarks[index][key] = e.target.value;
    setRemarksArr(updatedRemarks);
  };
  const addFileEntry = () => {
    setRemarksArr([...remarksArr, { remark: '' }]);
  };

  const removeFileEntry = (index) => {
    const updatedRemarks = remarksArr.filter((_, i) => i !== index);
    setRemarksArr(updatedRemarks);
  };
  const toggleTableBody = (section) => {
    setShowTableHeading((prevState) => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const renderTableHeader = (sectionName, sectionLabel) => (
    <TableHead sx={{ backgroundColor: '#EAF1F6' }}>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={500}>
              {sectionLabel}
            </Typography>
            <IconButton size="small" onClick={() => toggleTableBody(sectionName)} sx={{ height: '30px' }}>
              {showTableHeading[sectionName] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
  const shipmentData = [
    { label: 'Consignee Name', value: 'Tech Corp' },
    { label: 'Consignee Code', value: 'LPR1234' },
    { label: 'Contact Number', value: '+1 123-456-7890' },
    { label: 'Contact Email', value: 'example@techcorp.com' },
    { label: 'Address', value: '123 Tech Street, North Division, Electronics City' }
  ];
  return (
    // <Box>
    //   <Table>{renderTableHeader('rfqView', 'View RFQ')}</Table>
    //   {showTableHeading.rfqView && (
    //     <Grid item xs={12} sm={12} sx={{ padding: '10px' }}>
    //       <Grid container spacing={2}>
    //         {shipmentData
    //           .reduce((acc, item, index) => {
    //             if (index % 4 === 0) acc.push([]);
    //             acc[acc.length - 1].push(item);
    //             return acc;
    //           }, [])
    //           .map((row, rowIndex) => (
    //             <Grid container item xs={12} key={rowIndex} spacing={2}>
    //               {row.map((item, itemIndex) => (
    //                 <Grid item xs={3} key={itemIndex}>
    //                   <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
    //                     <Typography variant="h6" sx={{ marginRight: 1, fontWeight: '500', fontSize: '11px', color: '#333' }}>
    //                       {item.label}:
    //                     </Typography>
    //                     <Typography variant="body1" sx={{ color: '#555', fontSize: '11px' }}>
    //                       {item.value}
    //                     </Typography>
    //                   </Box>
    //                 </Grid>
    //               ))}
    //             </Grid>
    //           ))}

    //         <Grid item xs={12} sm={3}>
    //           <Typography variant="body" style={{ fontSize: '11px' }}>
    //             OPR Lead time
    //           </Typography>
    //           <TextField
    //             fullWidth
    //             disabled
    //             sx={{
    //               '& .MuiInputBase-input': {
    //                 padding: '5px'
    //               },
    //               '& .MuiInputBase-input.Mui-disabled': {
    //                 WebkitTextFillColor: '#000000'
    //               }
    //             }}
    //             value={`${leadTime?.map((item) => item)}`}
    //           />
    //         </Grid>

    //         <Grid item xs={12} sm={3}>
    //           <Typography variant="body" style={{ fontSize: '11px' }}>
    //             OPR Lead time
    //           </Typography>
    //           <TextField
    //             fullWidth
    //             InputProps={{
    //               endAdornment: <InputAdornment position="end">Weeks</InputAdornment>
    //             }}
    //             id="delivery_timeline"
    //             name="delivery_timeline"
    //             value={rfqDelivery}
    //             // onChange={(e) => setRfqDelivery(e.target.value)}
    //             sx={{
    //               '& .MuiInputBase-input': {
    //                 padding: '5px'
    //               },
    //               '& .MuiInputBase-input.Mui-disabled': {
    //                 WebkitTextFillColor: '#000000'
    //               }
    //             }}
    //           />
    //         </Grid>

    //         <Grid item xs={12} sm={3}>
    //           <Typography variant="body" style={{ fontSize: '11px' }}>
    //             Port of Delivery
    //           </Typography>

    //           <Select
    //             variant="outlined"
    //             fullWidth
    //             id="portDestination"
    //             name="portDestination"
    //             value={portDestination}
    //             onChange={(e) => setPortDestination(e.target.value)}
    //             sx={{
    //               '& .MuiInputBase-input': {
    //                 padding: '5px'
    //               },
    //               '& .MuiInputBase-input.Mui-disabled': {
    //                 WebkitTextFillColor: '#000000'
    //               }
    //             }}
    //           >
    //             <MenuItem value="">
    //               <em>Port of Discharge</em>
    //             </MenuItem>

    //           </Select>
    //         </Grid>

    //         <Grid item xs={12} sm={3}>
    //           <Typography variant="body" style={{ fontSize: '11px' }}>
    //             Respond Time(Days)
    //           </Typography>
    //           <TextField
    //             fullWidth
    //             type="number"
    //             id="respond_time"
    //             name="respond_time"
    //             placeholder="From RFQ Issue Date"
    //             value={respond_time}
    //             onChange={(e) => setRespondTime(e.target.value)}
    //             sx={{
    //               '& .MuiInputBase-input': {
    //                 padding: '5px'
    //               },
    //               '& .MuiInputBase-input.Mui-disabled': {
    //                 WebkitTextFillColor: '#000000'
    //               }
    //             }}
    //           />
    //         </Grid>
    //         <Grid item xs={12} sm={12}>
    //           {remarksArr?.map((item, index) => (
    //             <Grid
    //               key={index}
    //               container
    //               spacing={1}
    //               display={'flex'}
    //               alignItems="center"
    //               sx={{ border: '2px dotted black', borderRadius: '12px', margin: '2px', padding: '8px' }}
    //             >
    //               <Grid item xs={12} sm={6}>
    //                 <Typography variant="body" style={{ fontSize: '11px' }}>
    //                   Additional Remarks
    //                 </Typography>
    //                 <TextField
    //                   fullWidth
    //                   sx={{
    //                     '& .MuiInputBase-input': { padding: '5px' },
    //                     '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000' }
    //                   }}
    //                   id={`remark-${index}`}
    //                   name="remark"
    //                   onChange={(e) => handleInputChangeFile(e, index, 'remark')}
    //                   value={item?.remark}
    //                 />
    //               </Grid>

    //               {index !== 0 && (
    //                 <Grid item xs={12} sm={0.5}>
    //                   <IconButton aria-label="delete" size="large" onClick={() => removeFileEntry(index)}>
    //                     <DeleteIcon color="error" />
    //                   </IconButton>
    //                 </Grid>
    //               )}

    //               {index === remarksArr.length - 1 && (
    //                 <Grid item xs={12} sm={0.5}>
    //                   <IconButton aria-label="add" size="large" onClick={addFileEntry}>
    //                     <AddIcon color="success" />
    //                   </IconButton>
    //                 </Grid>
    //               )}
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   )}
    // </Box>
    <></>
  );
};

export default RFQView;
