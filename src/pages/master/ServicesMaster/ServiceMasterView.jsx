import { Box, Button, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const ServiceMasterView = ({ item, onClose }) => {
  console.log('ServiceMasterView', item);
  if (!item) return null;

  function generateImageSrc(base64String) {
    // Constructing src attribute for <img> tag
    const srcValue = `data:image/png;base64,${base64String}`;
    return srcValue;
  }

  return (
    <>
      <MainCard>
        <Typography variant="h6">
          <h3 style={{ padding: '0', margin: '0' }}>
            Item Detail (
            <span className="text-primary" style={{ color: 'blue' }}>
              {item.item_code}
            </span>
            )
          </h3>
        </Typography>
        {item ? (
          <Box sx={{ marginBottom: '10px' }}>
            <img src={generateImageSrc(item.item_img)} alt="Item img" width="500" height="300" />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Item Name:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.item_name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      factory:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.factory}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Item Type:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.item_type}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Item Description:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.item_description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      HSN Code:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.hsn_code}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      HSN Code:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.hsn_code}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Group:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.group_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Sub Group:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.sub_group}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {/* <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Item Image:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <img src={generateImageSrc(item.item_img)} alt="Generated from base64" />
                  </TableCell> */}
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      CRIA:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.cria}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Nafdac Name:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.nafdac_name}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Nafdac Certificate:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.nafdac_category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Tolerance:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.tolerance}</Typography>
                  </TableCell>
                </TableRow>
                {/* ................Current Address............... */}
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Vendor Name:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.vendors}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Lead Time:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.lead_time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Quantity in Stock:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.quantity_in_stock}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      quantity on Order:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.quantity_on_order}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Reorder Level:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.reorder_level}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Is Discontinued :
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography style={{ color: item.is_discontinued ? 'green' : 'red' }}>
                      {item.is_discontinued ? 'Active' : ' Discontinued'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Unit Price:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.unit_price}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      MSRP:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.msrp}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Unit Of Measurement:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.uom_id}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      Notes:
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.notes}</Typography>
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

export default ServiceMasterView;
