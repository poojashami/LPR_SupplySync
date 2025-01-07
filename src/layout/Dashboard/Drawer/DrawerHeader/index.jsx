import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// project-imports
import DrawerHeaderStyled from './DrawerHeaderStyled';

import Logo from 'components/logo';
import { DRAWER_WIDTH, HEADER_HEIGHT, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <div
      // eslint-disable-next-line react/no-unknown-property
      theme={theme}
      open={open}
      style={{
        minHeight: isHorizontal ? 'unset' : HEADER_HEIGHT,
        width: isHorizontal ? { xs: '100%', lg: DRAWER_WIDTH + 50 } : 'inherit',
        padding: '4vh 0',
        backgroundColor: '#318CE7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <center>
        <Logo isIcon={!open} sx={{ width: open ? 'auto' : 52, height: 'auto' }} />
      </center>
    </div>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
