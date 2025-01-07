import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

// project-imports
import Drawer from './Drawer';
import Header from './Header';
import HorizontalBar from './Drawer/HorizontalBar';
import Loader from 'components/Loader';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { DRAWER_WIDTH, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useDispatch } from 'react-redux';
import { GetContainerSizes } from 'Redux/Apis/GetApiCalls';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { container, miniDrawer, menuOrientation } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  useEffect(() => {
    GetContainerSizes(dispatch);
  }, []);

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      handlerDrawerOpen(!downXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header />
        {!isHorizontal ? <Drawer /> : <HorizontalBar />}

        <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH - 25}px)`, flexGrow: 1 }}>
          <Toolbar />
          <Box
            fullWidth
            sx={{
              xs: 0,
              px: { xs: 0, md: 0 },
              position: 'relative',
              minHeight: 'calc(100vh - 110px)',
              maxWidth: '100vw',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
