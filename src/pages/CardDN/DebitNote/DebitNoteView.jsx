import React from 'react';
import { Typography, Table, TableBody, TableRow, TableCell } from '@mui/material';

const DebitNoteView = ({ DebitNoteData }) => {
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                CI Number:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{DebitNoteData.ci_num}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                BL Number:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{DebitNoteData.bl_num}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Importer Name:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{DebitNoteData.importer_name}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                Port Of DC:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{DebitNoteData.port_of_dc}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                C Num:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>{DebitNoteData.c_num}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DebitNoteView;
