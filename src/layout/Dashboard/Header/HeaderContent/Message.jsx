import { useState } from 'react';
import { jsPDF } from 'jspdf';

// material-ui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import DownloadIcon from '@mui/icons-material/Download';

// assets
import { Add, NotificationStatus } from 'iconsax-react';
import PdfViewer from 'utils/pdfViewer.jsx';
import { Button } from '@mui/material';
import { downloadPdfFromBase64 } from 'utils/downloadpsd';
import { useDispatch, useSelector } from 'react-redux';
import { messageOpen, messageClose } from 'Redux/Slices/StaticSlice';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

export default function Customization() {
  const dispatch = useDispatch();
  const { messageopen, base64String } = useSelector((state) => state.static);
  console.log(messageopen, base64String);
  const handleToggle = () => {
    messageopen ? dispatch(messageClose()) : dispatch(messageOpen());
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        {/* <IconButton
          color="secondary"
          // variant="light"
          onClick={handleToggle}
          // aria-label="settings toggler"
          // size="large"
          // sx={{ color: 'secondary.main', bgcolor: open ? iconBackColorOpen : iconBackColor, p: 1 }}
        >
          <NotificationStatus variant="Bulk" />
        </IconButton> */}
      </Box>
      <Drawer
        sx={{ zIndex: 2001 }}
        anchor="right"
        onClose={handleToggle}
        open={messageopen}
        PaperProps={{ sx: { width: { xs: 350, sm: 950 } } }}
      >
        {messageopen && (
          <MainCard content={false} sx={{ border: 'none', borderRadius: 0, height: '100vh' }}>
            <SimpleBar
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '5vh'
                }
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                  <Typography variant="h4">View Doc</Typography>
                  <IconButton color="secondary" sx={{ p: 0 }} onClick={handleToggle}>
                    <Add size={28} style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 4 }}>
                  <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h5">{/* File Name */}</Typography>
                      <Button variant="outlined" sx={{ mr: 2 }} onClick={() => generatePdfSrc()} style={{ color: 'black' }}>
                        <DownloadIcon />
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <PdfViewer type={'base64'} url={base64String} />
                  </Grid>
                </Grid>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
}
