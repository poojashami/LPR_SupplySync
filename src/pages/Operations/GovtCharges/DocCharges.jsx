import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

const DocCharges = () => {
  const [loading, setLoading] = useState(false);
  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    th: {
      border: '1px solid black',
      padding: '8px',
      textAlign: 'left',
      backgroundColor: '#f2f2f2'
    },
    td: {
      border: '1px solid black',
      padding: '8px',
      textAlign: 'left'
    },
    mainTableTh: {
      textAlign: 'center'
    },
    totalRow: {
      textAlign: 'right',
      fontWeight: 'bold'
    },
    accountTableFirstCol: {
      width: '150px'
    }
  };
  const handlePrint = () => {
    setLoading(true);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const elements = document.querySelectorAll('.my-table');
    const padding = 20;

    elements.forEach((element, index) => {
      if (index > 0) {
        doc.addPage();
      }

      doc.html(element, {
        x: padding,
        y: padding,
        width: 450.28 - 2 * padding, // A4 width - padding
        windowWidth: 595.28, // Ensure the width matches A4 width in points
        callback: () => {
          if (index === elements.length - 1) {
            setLoading(false);
            doc.save('save.pdf');
          }
        }
      });
    });
  };
  const printDataRef = useRef(null);
  return (
    <div>
      <div style={{ width: '800px' }} ref={printDataRef} className="print_data my-table pdf-content">
        <table style={styles.table}>
          <thead>
            <tr>
              <th colSpan="4" style={{ ...styles.th, ...styles.mainTableTh }}>
                Payment Voucher
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Consignee</td>
              <td style={styles.td}>BREEZE INDUSTRIES</td>
              <td style={styles.td}>S.No.</td>
              <td style={styles.td}>2310-74</td>
            </tr>
            <tr>
              <td style={styles.td}>Invoice No.</td>
              <td style={styles.td}>0000004538</td>
              <td style={styles.td}>Initiation Date</td>
              <td style={styles.td}>16.10.2023</td>
            </tr>
            <tr>
              <td style={styles.td}>Form M No.</td>
              <td style={styles.td}>MF2023086149 / BA070202300004391</td>
              <td style={styles.td}>Initiator</td>
              <td style={styles.td}>patrick</td>
            </tr>
            <tr>
              <td style={styles.td}>BL No.</td>
              <td style={styles.td}>JHK22308038</td>
              <td style={styles.td} colSpan="2"></td>
            </tr>
          </tbody>
        </table>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr. No.</th>
              <th style={styles.th}>Particulars</th>
              <th style={styles.th}>Value (N)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>1</td>
              <td style={styles.td}>BEING USE FOR CLEARING CHARGES INV:4538/PPI 4500</td>
              <td style={styles.td}>25,000.00</td>
            </tr>
            <tr>
              <td colSpan="2" style={{ ...styles.td, ...styles.totalRow }}>
                Total
              </td>
              <td style={styles.td}>25,000.00</td>
            </tr>
          </tbody>
        </table>

        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.td}>Payment Mode</td>
              <td style={styles.td} colSpan="3">
                Bank Name
              </td>
              <td style={styles.td}></td>
            </tr>
            <tr>
              <td style={{ ...styles.td, ...styles.accountTableFirstCol }} rowSpan="3">
                Account Details
              </td>
              <td style={styles.td}>Account Name</td>
              <td style={styles.td}></td>
              <td style={styles.td}>Approval 1</td>
              <td style={styles.td}>joby</td>
            </tr>
            <tr>
              <td style={styles.td}>Account No.</td>
              <td style={styles.td}></td>
              <td style={styles.td}>Approval 2</td>
              <td style={styles.td}>kishore</td>
            </tr>
            <tr>
              <td style={styles.td}>Bank</td>
              <td style={styles.td} colSpan="3"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Button
        disabled={loading}
        variant="contained"
        onClick={handlePrint}
        endIcon={loading ? <CircularProgress size={'large'} sx={{ color: 'primary' }} /> : <FileDownload />}
      >
        Download Doc
      </Button>
    </div>
  );
};

export default DocCharges;
