// material-ui
import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - BACKDROP ||============================== //

export default function Backdrop() {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d263000',
          opacity: 0
        }
      }
    }
  };
}
