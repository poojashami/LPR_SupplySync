import React, { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

// assets
import { Notification, Setting2 } from 'iconsax-react';
import Avatar from 'components/@extended/Avatar';
import Button from '@mui/material/Button';

const actionSX = {
  mt: '2px',
  ml: 1,
  top: '0px',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function NotificationPage() {
  const [role, setRole] = useState('');

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userInfo'));
    setRole(data?.role || '');
  }, []);

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef(null);
  const [read] = useState(2);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (event) => {
    const newRole = event.target.value;
    const data = JSON.parse(localStorage.getItem('userInfo'));

    // Update role in localStorage
    const roles = ['admin', 'user', 'l1', 'agent', 'treasury', 'service_vendor', 'vendor', 'factory', 'PH', 'BH'];

    const currentIndex = roles.indexOf(data.role);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        first_name: data.first_name,
        email: data.email,
        role: newRole
      })
    );

    setRole(newRole);
    window.location.replace('/dashboard');
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.5 }}>
      <IconButton
        color="secondary"
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} color="success" sx={{ '& .MuiBadge-badge': { top: 2, right: 4 } }}>
          <Notification variant="Bold" />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} sx={{ overflow: 'hidden' }} in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                borderRadius: 1.5,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: { maxWidth: 285 }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {/* <Typography variant="h5">Notifications</Typography> */}
                    <Link href="#" variant="h6" color="primary">
                      Select Role from Drop Down
                    </Link>
                  </Stack>
                  <List
                    component="nav"
                    sx={{
                      '& .MuiListItemButton-root': {
                        p: 1.5,
                        my: 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': { bgcolor: 'primary.lighter', borderColor: theme.palette.primary.light },
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {/* <ListItemButton>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            Quotation&apos;s{' '}
                            <Typography component="span" variant="subtitle1">
                              for RFQ: RF-2024/05&apos;
                            </Typography>{' '}
                            Received.
                          </Typography>
                        }
                        secondary="2 min ago"
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          3:00 AM
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar>
                          <Setting2 size={20} variant="Bold" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            Your Profile is Complete &nbsp;
                            <Typography component="span" variant="subtitle1">
                              60%
                            </Typography>{' '}
                          </Typography>
                        }
                        secondary="7 hours ago"
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          2:45 PM
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar type="combined">C</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            <Typography component="span" variant="subtitle1">
                              Cristina Danny
                            </Typography>{' '}
                            invited to join{' '}
                            <Typography component="span" variant="subtitle1">
                              Meeting.
                            </Typography>
                          </Typography>
                        }
                        secondary="Daily scrum meeting time"
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="caption" noWrap>
                          9:10 PM
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItemButton> */}
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar type="combined">Role</Avatar>
                      </ListItemAvatar>

                      <ListItemSecondaryAction>
                        {/* <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            let data = JSON.parse(localStorage.getItem('userInfo'));
                            if (data.role === 'admin') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'user'
                                })
                              );
                            } else if (data.role === 'user') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'l1'
                                })
                              );
                            } else if (data.role === 'l1') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'agent'
                                })
                              );
                            } else if (data.role === 'agent') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'treasury'
                                })
                              );
                            } else if (data.role === 'treasury') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'service_vendor'
                                })
                              );
                            } else if (data.role === 'service_vendor') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'vendor'
                                })
                              );
                            } else if (data.role === 'vendor') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'factory'
                                })
                              );
                            } else if (data.role === 'factory') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'PH'
                                })
                              );
                            } else if (data.role === 'PH') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'BH'
                                })
                              );
                            } else if (data.role === 'BH') {
                              localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                  first_name: data.first_name,
                                  email: data.email,
                                  role: 'admin'
                                })
                              );
                            }
                            window.location.reload();
                          }}
                        >
                          {JSON.parse(localStorage.getItem('userInfo')).role}
                        </Button> */}
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="role-select-label">Role</InputLabel>
                          <Select
                            sx={{ textTransform: 'capitalize' }}
                            labelId="role-select-label"
                            value={role}
                            onChange={handleChange}
                            label="Role"
                          >
                            {['admin', 'user', 'l1', 'agent', 'treasury', 'service_vendor', 'vendor', 'factory', 'PH', 'BH', 'admin'].map(
                              (role) => (
                                <MenuItem key={role} value={role} sx={{ textTransform: 'capitalize' }}>
                                  {role}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  </List>
                  <Stack direction="row" justifyContent="center">
                    <Link href="#" variant="h6" color="primary">
                      View all
                    </Link>
                  </Stack>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
