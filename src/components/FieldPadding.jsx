import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    padding: '4px',
    fontSize: '11px'
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#000000'
  }
});

const FieldPadding = ({ _, ...props }) => {
  console.log(_);
  return <CustomTextField {...props} />;
};

export default FieldPadding;
