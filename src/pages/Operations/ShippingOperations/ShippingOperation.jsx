import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import PlusButton from 'components/CustomButton';
import ShippingOperationForm from './ShippingOperationForm';
import ShippingOperationView from './ShippingOperationView';
import ShippingOperationsTable from './ShippingOperationsTable';

const ShippingOperation = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCIForm, setShowCIForm] = useState(false);
  const [selectedPiNo, setSelectedPiNo] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleCreateForm = () => {
    setShowForm(true);
    setSelectedPiNo(null);
  };

  const handleBackToTable = () => {
    setShowForm(false);
    // setShowCIForm(false);
    setSelectedPiNo(null);
  };

  const handleAssessmentView = (piNo) => {
    setSelectedPiNo(piNo);
    setShowForm(false);
    // setShowCIForm(false);
  };

  const handleCreateCIClick = (rowData) => {
    setSelectedRowData(rowData);
    // setShowCIForm(true);
  };

  const renderContent = () => {
    if (showForm) return <ShippingOperationForm />;
    // if (showCIForm) return <CIForm data={selectedRowData} onBack={handleBackToTable} />;
    if (selectedPiNo) return <ShippingOperationView piNo={selectedPiNo} />;
    return <ShippingOperationsTable onAssessmentView={handleAssessmentView} onCreateCIClick={handleCreateCIClick} />;
  };

  const renderTitle = () => {
    if (showForm) return 'Create Shipping Operations';
    // if (showCIForm) return 'CI Form';
    if (selectedPiNo) return `Shipping Operations View: ${selectedPiNo}`;
    return 'Shipping Operations Details';
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>{renderTitle()}</span>
          {showForm || (selectedPiNo && <PlusButton label="Back" onClick={handleBackToTable} />)}
        </Box>
      }
    >
      {renderContent()}
    </MainCard>
  );
};

export default ShippingOperation;
