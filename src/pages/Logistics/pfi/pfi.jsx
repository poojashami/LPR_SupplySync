import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import PlusButton from 'components/CustomButton';
import PFIForm from './pfiForm';
import PFITable from './pfiTable';
import CIForm from './ciForm';
import ViewPFI from './pfiView'; // import your ViewPFI component

const PFIPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCIForm, setShowCIForm] = useState(false);
  const [viewPfi, setViewPfi] = useState(null); // state for holding selected PFI details

  const handleBackToTable = () => {
    setShowForm(false);
    setShowCIForm(false);
    setViewPfi(null); // reset PFI view state
  };

  const handlePiNoClick = (pfiData) => {
    setViewPfi(pfiData); // set the selected PFI data
    setShowForm(false);
    setShowCIForm(false);
  };

  const handleCreateCIClick = () => {
    setShowCIForm(true);
  };

  const renderContent = () => {
    if (viewPfi) return <ViewPFI pfiData={viewPfi} />; // render ViewPFI component with selected data
    if (showForm) return <PFIForm />;
    if (showCIForm) return <CIForm />;
    return <PFITable onViewPFIClick={handlePiNoClick} onCreateCIClick={handleCreateCIClick} />;
  };

  const renderTitle = () => {
    if (viewPfi) return 'View PFI';
    if (showForm) return 'Create PFI';
    if (showCIForm) return 'CI Form';
    return 'PFI Details';
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center" >
          <span>{renderTitle()}</span>
          {(showForm || showCIForm || viewPfi) && <PlusButton label="Back" onClick={handleBackToTable} />}
        </Box>
      }
    >
      {renderContent()}
    </MainCard>
  );
};

export default PFIPage;
