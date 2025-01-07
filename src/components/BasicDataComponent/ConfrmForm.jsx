import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from '@mui/material';

const ConfirmForm = ({ isOpen, onClose, onConfirm, type }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirm Submission</DialogTitle>
      <Divider />
      <DialogContent>
        {type === "RFQ" ? <p>Are you sure, you want to Issue the RFQ?</p> :
          <p>Are you sure, you want to submit the form?</p>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Back
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" type="submit">
          {type === "RFQ" ? "Issue" : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default ConfirmForm;
