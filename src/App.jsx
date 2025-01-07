import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// auth-provider

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { css, Global } from '@emotion/react';
//RFQCONTEXT
import { MyContextProvider, useMyContext } from 'contexts/RfqItemContex';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      {/* <RTLLayout> */}
      {/* <Global styles={globalStyles} /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Locales>
          <ScrollTop>
            <AuthProvider>
              <>
                {/* <RouterProvider router={router} /> */}
                <MyContextProvider>
                  <RouterProvider router={router} />
                </MyContextProvider>
                <Snackbar />
              </>
            </AuthProvider>
          </ScrollTop>
        </Locales>
      </LocalizationProvider>
      {/* </RTLLayout> */}
    </ThemeCustomization>
  );
}
