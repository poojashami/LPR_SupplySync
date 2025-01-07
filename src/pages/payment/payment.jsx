import { Button, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import PaymentForm from './paymentForm';
import PaymentTable from './paymentTable';
import PaymentView from './paymentView';
import PlusButton from 'components/CustomButton';

const FormatMain = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPaymentView, setShowPaymentView] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleCreateForm = () => {
    setShowForm(true);
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentView(true);
  };

  return (
    <MainCard
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!showForm && !showPaymentView ? <span>Payment Details</span> : showForm ? <span> Payment Form</span> : <span>Payment View</span>}
          {!showForm && !showPaymentView ? (
            <PlusButton label="+Create Payment" onClick={handleCreateForm} />
          ) : (
            <PlusButton
              label="Back"
              onClick={() => {
                setShowForm(false);
                setShowPaymentView(false);
              }}
            />
          )}
        </Box>
      }
    >
      {showForm ? (
        <PaymentForm />
      ) : showPaymentView ? (
        <PaymentView payment={selectedPayment} />
      ) : (
        <PaymentTable onPaymentClick={handlePaymentClick} />
      )}
    </MainCard>
  );
};

export default FormatMain;
