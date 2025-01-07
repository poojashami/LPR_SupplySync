import OprView from './oprView';
import OPRForm from './oprForm';
import OprTable from './oprTabel';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import QuoteCompare from '../OPO/OPO_Compare';
import PlusButton from 'components/CustomButton';
import { setopr_id } from 'Redux/Slices/StaticSlice';
import { useDispatch } from 'react-redux';

const OprMain = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedOpr, setSelectedOpr] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [compareMode, setCompareMode] = useState(null);
  const handleCreateForm = () => {
    setShowForm(true);
    setIsEditMode(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleViewClose = () => {
    setSelectedOpr(null);
  };
  const handleSuccessfulSubmit = () => {
    setShowForm(false);
    // setSelectedOpr(null);
  };
  const handleEditClick = () => {
    setIsEditMode(true);
  };
  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {showForm ? 'Create OPR' : selectedOpr ? 'OPR View' : !compareMode ? 'OPR View' : 'OPO Compare'}
          {!showForm && !selectedOpr ? (
            compareMode ? (
              <PlusButton
                label="Back"
                onClick={() => {
                  dispatch(setopr_id(null));
                  setCompareMode(null);
                }}
              />
            ) : (
              <PlusButton label="+Create OPR" onClick={handleCreateForm} />
            )
          ) : (
            <PlusButton
              label="Back"
              onClick={() => {
                dispatch(setopr_id(null));
                setShowForm(false);
                setSelectedOpr(null);
              }}
            />
          )}
        </Box>
      }
    >
      {showForm ? (
        <OPRForm onSuccessfulSubmit={handleSuccessfulSubmit} onEditClick={handleEditClick} />
      ) : selectedOpr ? (
        <OprView oprViewData={selectedOpr} onClose={handleViewClose} />
      ) : !compareMode ? (
        <OprTable setSelectedOpr={setSelectedOpr} setCompareMode={setCompareMode} />
      ) : (
        <QuoteCompare compareMode={compareMode} />
      )}
    </MainCard>
  );
};

export default OprMain;
