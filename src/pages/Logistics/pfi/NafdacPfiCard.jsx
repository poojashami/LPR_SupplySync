import React, { useEffect, useState } from 'react';
// import { TextField, Typography, Button, Table, TableBody, TableRow, TableCell, TableHead, IconButton } from '@mui/material';
// import { is } from 'immutable';
import Pfi_Data from 'components/BasicDataComponent/Pfi_Data';

const NafdacPfiCard = ({ pfidata: pfiData }) => {
  return (
    <div>
      <Pfi_Data pfi_id={pfiData?.pfi_id} />
    </div>
  );
};

export default NafdacPfiCard;
