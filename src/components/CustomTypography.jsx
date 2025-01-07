import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const CustomTypographyy = styled(Typography)({
  fontSize: '12px', // Set font size to 12px
  '&.Mui-disabled': {
    color: '#000000' // Set color when disabled
  }
});

// Create a reusable Typography component
const CustomTypography = ({ children, ...props }) => {
  return <CustomTypographyy {...props}>{children}</CustomTypographyy>;
};

export default CustomTypography;
