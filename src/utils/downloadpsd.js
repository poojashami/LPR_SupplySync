// utils/downloadPdf.js

export const downloadPdfFromBase64 = (base64, fileName) => {
  // Convert Base64 string to a Blob
  console.log(fileName);

  if (!base64) {
    console.error('Base64 string is empty');
    return;
  }

  // Convert Base64 string to binary
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the binary data
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // Create a link element
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = fileName;

  // Append the link to the body, trigger a click, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};
