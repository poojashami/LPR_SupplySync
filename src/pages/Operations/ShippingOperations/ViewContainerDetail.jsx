import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import CustomTypography from 'components/CustomTypography';

const ViewContainerDetail = () => {
  // Table headings (columns)
  const headings = [
    'Container No',
    'Container Size',
    'Quantity',
    'Net Weight',
    'No of Package',
    'Container Type',
    'UOM',
    'Total Net Weight',
    'Total Gross Weight'
  ];

  const rows = [
    ['CNTR001', '40 ft', '25', '12,000 kg', '50', 'Dry', 'kg', '300,000 kg', '350,000 kg'],
    ['CNTR002', '20 ft', '15', '8,000 kg', '30', 'Refrigerated', 'kg', '120,000 kg', '140,000 kg']
  ];
  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Table Head */}
        <TableHead>
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell key={index}>
                <CustomTypography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {heading}
                </CustomTypography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>
                  <CustomTypography variant="body1">{cell}</CustomTypography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewContainerDetail;
