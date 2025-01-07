import React from 'react';

const PaymentView = ({ payment }) => {
  return (
    <div>
      <h1>View Payment</h1>
      {payment && (
        <div>
          <p>
            <strong>Sr. No.:</strong> {payment.sno}
          </p>
          <p>
            <strong>Payment Type:</strong> {payment.paymentType}
          </p>
          <p>
            <strong>PO No:</strong> {payment.po_no}
          </p>
          <p>
            <strong>OPO No:</strong> {payment.opo_no}
          </p>
          <p>
            <strong>Vendor Name:</strong> {payment.vendor_name}
          </p>
          <p>
            <strong>PO Date:</strong> {payment.po_date}
          </p>
          <p>
            <strong>PO Description:</strong> {payment.po_description}
          </p>
          <p>
            <strong>PO Value:</strong> {payment.po_value}
          </p>
          <p>
            <strong>Advise Date:</strong> {payment.advise_date}
          </p>
          <p>
            <strong>Payment Advise Amount:</strong> {payment.paymentAdviseAmount}
          </p>
          <p>
            <strong>Payment Advise Remarks:</strong> {payment.paymentAdviseRemark}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentView;
