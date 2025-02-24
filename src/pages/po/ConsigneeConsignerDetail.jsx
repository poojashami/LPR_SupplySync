import { Box, Card } from '@mui/material';
import CustomHeading from 'components/CustomHeading';
import CustomParagraphDark from 'components/CustomParagraphDark';
import CustomParagraphLight from 'components/CustomParagraphLight';
import React from 'react';

const ConsigneeConsignerDetail = () => {
  const companyData = {
    company_series: 'CMP123',
    company_name: 'Tech Solutions Ltd.',
    contact_person: 'John Doe',
    contact_person_phone: '+1 234 567 890',
    contact_person_email: 'johndoe@example.com',
    AddressMasters: [
      {
        address_line1: '123 Main Street',
        address_line2: 'Suite 500',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postal_code: '10001'
      }
    ]
  };

  return (
    <Card sx={{mb:1}}>
      <Box sx={{ padding: '10px', paddingLeft: '15px' }}>
        <CustomHeading>Consignee Details</CustomHeading>
        <Box display={'flex'} gap={1}>
          <CustomParagraphDark>Code:</CustomParagraphDark>
          <CustomParagraphLight>{companyData.company_series}</CustomParagraphLight>
        </Box>
        <Box display={'flex'} gap={1}>
          <CustomParagraphDark>Name:</CustomParagraphDark>
          <CustomParagraphLight>{companyData.company_name}</CustomParagraphLight>
        </Box>
        <Box display={'flex'} gap={1}>
          <CustomParagraphDark>Contact Person Name:</CustomParagraphDark>
          <CustomParagraphLight>{companyData.contact_person}</CustomParagraphLight>
        </Box>
        <Box display={'flex'} gap={1}>
          <CustomParagraphDark>Contact Number:</CustomParagraphDark>
          <CustomParagraphLight>{companyData.contact_person_phone}</CustomParagraphLight>
        </Box>
        <Box display={'flex'} gap={1}>
          <CustomParagraphDark>Contact Email:</CustomParagraphDark>
          <CustomParagraphLight>{companyData.contact_person_email}</CustomParagraphLight>
        </Box>
        <Box display={'flex'} gap={1}>
          <CustomParagraphDark>Address:</CustomParagraphDark>
          <CustomParagraphLight>
            {`${companyData.AddressMasters[0].address_line1}, ${companyData.AddressMasters[0].address_line2}, ${companyData.AddressMasters[0].city}, ${companyData.AddressMasters[0].state}, ${companyData.AddressMasters[0].country}, ${companyData.AddressMasters[0].postal_code}`}
          </CustomParagraphLight>
        </Box>
      </Box>
    </Card>
  );
};

export default ConsigneeConsignerDetail;
