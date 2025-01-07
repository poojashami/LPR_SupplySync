import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { version } from 'pdfjs-dist/build/pdf';

const ocr = async (file, searchWord) => {
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

  if (!file) return false;

  const fileReader = new FileReader();
  const pdfText = await new Promise((resolve) => {
    fileReader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      const pdf = await getDocument(typedArray).promise;
      let extractedText = '';
      let found = false;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const textItems = content.items.map((item) => {
          if (searchWord === item.str) {
            found = true;
          }
          return item.str;
        });
        extractedText += textItems.join(' ') + '\n';
      }
      resolve({ extractedText, found });
    };

    fileReader.readAsArrayBuffer(file);
  });

  return pdfText.found;
};

export default ocr;
