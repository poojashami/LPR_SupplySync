import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import PlusButton from 'components/CustomButton';
import DraftView from './DraftView';
import DraftTable from './DraftPfiTable';

const DraftPage = () => {
  const [viewPfi, setViewPfi] = useState(null);

  const handleBackToTable = () => {
    setViewPfi(null);
  };

  const PiNoClick = (pfiData) => {
    setViewPfi(pfiData);
  };

  const renderContent = () => {
    if (viewPfi) return <DraftView pfiData={viewPfi} />;

    return <DraftTable onViewPFI={PiNoClick} />;
  };

  const renderTitle = () => {
    if (viewPfi) return 'View Draft PFI';

    return 'Draft Details';
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>{renderTitle()}</span>
          {viewPfi && <PlusButton label="Back" onClick={handleBackToTable} />}
        </Box>
      }
    >
      {renderContent(PiNoClick)}
    </MainCard>
  );
};

export default DraftPage;
