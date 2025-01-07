import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';
import EmailForm from './emailForm';
import EmailTable from './emailTable';
import EmailView from './emailView';
import { useSelector } from 'react-redux';
import PlusButton from 'components/CustomButton';

const EmailMain = () => {
  const navigate = useNavigate();
  const { mailData } = useSelector((state) => state.mail);
  const [showForm, setShowForm] = useState(Boolean(mailData));
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    console.log(mailData);
    return () => {};
  }, []);

  const handleCreateForm = () => {
    setShowForm(true);
    setIsEditMode(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleViewClose = () => {
    setSelectedEmail(null);
  };

  const handleSuccessfulSubmit = () => {
    setShowForm(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!showForm && !selectedEmail ? <span>Email Details</span> : <span>{showForm ? 'Send Email' : 'Update Email'}</span>}
          {!showForm && !selectedEmail ? (
            <PlusButton label="+Create Email" onClick={handleCreateForm} />
          ) : (
            <PlusButton
              label="Back"
              onClick={() => {
                navigate(-1);
                // setShowForm(false);
                // setSelectedEmail(null);
              }}
            />
          )}
        </Box>
      }
    >
      {showForm ? (
        <EmailForm mailData={mailData} onSuccessfulSubmit={handleSuccessfulSubmit} onEditClick={handleEditClick} />
      ) : selectedEmail ? (
        <EmailView emailViewData={selectedEmail} onClose={handleViewClose} />
      ) : (
        <EmailTable setSelectedEmail={setSelectedEmail} />
      )}
    </MainCard>
  );
};

export default EmailMain;
