import React from 'react';
import PDFViewer from 'pdf-viewer-reactjs';

const PdfViewer = ({ type, url }) => {
  // For debugging: Log the type and url to ensure they are correctly passed
  console.log('Type:', type);
  console.log('URL:', url);

  // Basic validation to ensure url is defined
  if (!url) {
    return <div>Error: PDF URL is not provided</div>;
  }

  return (
    <div>
      <PDFViewer
        document={{
          [type]: url // Dynamically use the url prop
        }}
        scale={1.5}
        style={{
          height: '100vh',
          width: '100%'
        }}
        hideNavbar={true}
        navbarOnTop={true}
        hideZoom={true}
        hideRotation={true}
      />
    </div>
  );
};

export default PdfViewer;
