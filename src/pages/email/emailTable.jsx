import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const EmailTable = ({ setSelectedEmail }) => {
  const [emailData, setEmailData] = useState([]);

  useEffect(() => {
    // Mock email data
    const mockEmailData = [
      { id: 1, subject: 'First Email', sender: 'sender1@example.com', date: '2024-07-11', status: 'unread' },
      { id: 2, subject: 'Second Email', sender: 'sender2@example.com', date: '2024-07-10', status: 'read' },
      { id: 3, subject: 'Third Email', sender: 'sender3@example.com', date: '2024-07-09', status: 'unread' }
      // Add more email objects as needed
    ];

    setEmailData(mockEmailData);
  }, []);

  const emailColumnDefs = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'subject', headerName: 'Subject', width: 200 },
    { field: 'sender', headerName: 'Sender', width: 150 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'status', headerName: 'Status', width: 100 }
  ];

  const onRowClicked = (event) => {
    setSelectedEmail(event.data);
  };

  return (
    <div style={{ width: '100%' }} className="ag-theme-alpine custom-ag-grid">
      <AgGridReact
        rowData={emailData}
        columnDefs={emailColumnDefs}
        pagination={false}
        rowSelection="single"
        onRowClicked={onRowClicked} // Add the row click handler
        suppressMenuHide={true}
        suppressColumnVirtualisation={true}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default EmailTable;
