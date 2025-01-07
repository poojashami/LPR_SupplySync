import React, { useState } from 'react';
import OprItemList from './OprItemList';
import GenerateRfqConformation from './RfqConformation';
import MainCard from 'components/MainCard';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { setSelectedRows, addToRfq } from 'Redux/Slices/RFQSlice';
import PlusButton from 'components/CustomButton';
import { clearRfqList } from 'Redux/Slices/RFQSlice';

const GenerateRfqPage = () => {
  const { selectedRows } = useSelector((state) => state.rfq);
  const dispatch = useDispatch();
  const [showItems, setShowItems] = useState(false);
  const [showRfqConfirm, setShowRfqConfirm] = React.useState(false);

  const handleGenerateRfq = () => {
    dispatch(addToRfq(selectedRows));
    dispatch(setSelectedRows([]));
    setShowRfqConfirm(true);
  };

  const handleCloseForm = () => {
    setShowRfqConfirm(false);
  };

  return (
    <>
      <MainCard
        title={
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* {showRfqConfirm ? <span>RFQ Management</span> : showItems ? <span>Generate RFQ</span> : <span>OPR List for RFQ</span>} */}
            {showRfqConfirm ? <span>Generate RFQ</span> : showItems ? <span>Create RFQ - Item List in Selected OPR</span> : <span>Create RFQ - Pending OPR List</span>}

            {showRfqConfirm ? (
              <Box>
                <PlusButton
                  label="Back"
                  onClick={() => {
                    dispatch(clearRfqList());
                    handleCloseForm();
                    dispatch(setSelectedRows([]));
                    // setShowItems(false);
                  }}
                />
              </Box>
            ) : showItems ? (
              <Box sx={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="contained"
                  // color="error"
                  size="small"
                  onClick={() => {
                    setShowItems(false);
                    setShowRfqConfirm(false);
                  }}
                >
                  Back
                </Button>
                <PlusButton label="Proceed" onClick={handleGenerateRfq} />
              </Box>
            ) : (
              <Box></Box>
            )}

            {/* {!showRfqConfirm ? (
              <Box>
                <Badge badgeContent={itemCount} color="error">
                  <PlusButton label="Generate RFQ" onClick={handleGenerateRfq} />
                </Badge>
              </Box>
            ) : (
              <Box>
                <PlusButton
                  label="Back"
                  onClick={() => {
                    dispatch(clearRfqList());
                    handleCloseForm();
                    dispatch(setSelectedRows([]));
                  }}
                />
              </Box>
            )} */}
          </Box>
        }
      >
        {showRfqConfirm ? (
          <GenerateRfqConformation showItems={showItems} setShowItems={setShowItems} setShowRfqConfirm={setShowRfqConfirm} />
        ) : (
          <OprItemList showItems={showItems} setShowItems={setShowItems} />
        )}
      </MainCard>
    </>
  );
};
export default GenerateRfqPage;
