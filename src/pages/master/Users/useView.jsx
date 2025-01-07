import { Box, Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const UseView = ({ user, onClose }) => {
  if (!user) return null; // Handle case where user data is not available
  console.log('user videw', user);
  return (
    <>
      <MainCard>
        <Typography variant="h6">
          <h3 style={{ padding: '0', margin: '0' }}>
            User Detail (
            <span className="text-primary" style={{ color: 'blue' }}>
              {user.user_id}
            </span>
            )
          </h3>
        </Typography>
        {user ? (
          <Box sx={{ marginBottom: '10px' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      User Name:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.userName}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Email:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Phone Number:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.phoneNo}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Date of Birth:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.date_of_birth}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Designation:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.designation}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Department:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.department}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Current Address:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.currentAddress}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Permanent Address:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.permanentAddress}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" color="error" onClick={onClose}>
                Close
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>No item selected</Typography>
        )}
      </MainCard>
    </>
  );
};

export default UseView;
