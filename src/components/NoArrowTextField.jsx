import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const NoArrowTextField = styled(TextField)(({ theme }) => ({
  // Remove the arrow from number input fields
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0
  },
  '& input[type=number]': {
    '-moz-appearance': 'textfield'
  },
  // Add padding to the input field
  '& .MuiInputBase-input': {
    padding: '6px'
  }
}));

const CustomNumberField = (props) => {
  return <NoArrowTextField {...props} />;
};

export default CustomNumberField;
