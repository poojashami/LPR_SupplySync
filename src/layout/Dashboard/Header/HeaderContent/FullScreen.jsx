import { useCallback, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project import
import IconButton from 'components/@extended/IconButton';

// assets
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

export default function FullScreen() {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    if (document && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title={!open ? ' Fullscreen' : 'Exit Fullscreen'}>
        <IconButton onClick={handleToggle}>{open ? <FullscreenExit /> : <Fullscreen />}</IconButton>
      </Tooltip>
    </Box>
  );
}
