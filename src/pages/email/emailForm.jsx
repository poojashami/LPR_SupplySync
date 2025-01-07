import React, { useState } from 'react';
import { Typography, Grid, Table, TableBody, TableRow, TableCell, Button, Box, Collapse, CircularProgress } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { axiosInstance } from 'utils/axiosInstance';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { emptyMailData } from 'Redux/Slices/MailSlice';
import { useDispatch } from 'react-redux';
import ValidationStar from 'components/ValidationStar';
import { errorMessageStyle } from 'components/StyleComponent';
import FieldPadding from 'components/FieldPadding';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailForm = ({ mailData }) => {
  const [description, setDescription] = useState(mailData.description || '');
  const [openCC, setOpenCC] = useState(false);
  const [openBCC, setOpenBCC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    id: mailData.to || '',
    subject: mailData.subject || '',
    date: new Date(),
    description: description || '',
    attachment: mailData.attachment || '',
    documentName: mailData.documentName || '',
    doc_id: mailData.doc_id || '',
    doc_type: mailData.doc_type || ''
  };

  const validationSchema = Yup.object().shape({
    id: Yup.string().required('ID is required'),
    subject: Yup.string().required('Subject is required')
  });

  const handleKeyPress = (event, toggleFunction) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleFunction();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please drop a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);
    const formData = {
      doc_id: values.doc_id,
      doc_type: values.doc_type,
      to: values.id,
      subject: values.subject,
      message: values.description,
      attachment: new File([values.attachment], `${values.documentName}.pdf`, { type: 'application/pdf' }),
      documentName: values.documentName
    };

    toast
      .promise(
        axiosInstance.post('/api/mail/send', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        {
          pending: 'Connecting Mail Servers',
          success: 'Mail Sent',
          error: 'Failed to send mail'
        }
      )
      .finally(() => {
        setLoading(false);
        dispatch(emptyMailData());
        setSubmitting(false);
        navigate(-1);
      });
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
      {({ values, setFieldValue }) => (
        <Form>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body1">
                        To<ValidationStar>*</ValidationStar>
                      </Typography>
                      <Field as={FieldPadding} name="id" variant="outlined" fullWidth size="small" />
                      <ErrorMessage name="id" component="div" style={errorMessageStyle} />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      <Grid container direction="column" justifyContent="center" alignItems="center">
                        <div
                          className="clickable-text"
                          tabIndex="0"
                          role="button"
                          onClick={() => setOpenCC(!openCC)}
                          onKeyDown={(event) => handleKeyPress(event, () => setOpenCC(!openCC))}
                        >
                          CC
                        </div>
                        <div
                          className="clickable-text"
                          tabIndex="0"
                          role="button"
                          onClick={() => setOpenBCC(!openBCC)}
                          onKeyDown={(event) => handleKeyPress(event, () => setOpenBCC(!openBCC))}
                        >
                          BCC
                        </div>
                      </Grid>
                    </Grid>

                    {openCC && (
                      <Grid item xs={12} sm={3}>
                        <Typography variant="body1">CC</Typography>
                        <Collapse in={openCC}>
                          <Field as={FieldPadding} name="cc" variant="outlined" fullWidth size="small" />
                        </Collapse>
                      </Grid>
                    )}

                    {openBCC && (
                      <Grid item xs={12} sm={3}>
                        <Typography variant="body1">BCC</Typography>
                        <Collapse in={openBCC}>
                          <Field as={FieldPadding} name="bcc" variant="outlined" fullWidth size="small" />
                        </Collapse>
                      </Grid>
                    )}
                  </Grid>

                  <Grid container spacing={2} alignItems="center" marginTop={1}>
                    <Grid item xs={12} sm={12}>
                      <Typography variant="body1">
                        Subject<ValidationStar>*</ValidationStar>
                      </Typography>
                      <Field as={FieldPadding} name="subject" variant="outlined" fullWidth value={values.subject} />
                      <ErrorMessage name="subject" component="div" style={errorMessageStyle} />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} alignItems="center" marginTop={1}>
                    <Grid item xs={12} sm={12}>
                      <ReactQuill
                        value={description}
                        onChange={(value) => {
                          handleDescriptionChange(value);
                          setFieldValue('description', value);
                        }}
                        modules={{
                          toolbar: [
                            [{ font: [] }],
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            ['link'],
                            ['clean']
                          ]
                        }}
                        formats={[
                          'font',
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'list',
                          'bullet',
                          'color',
                          'background',
                          'align',
                          'link'
                        ]}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                      <b>Attachments</b>
                      <ValidationStar>*</ValidationStar>
                    </Typography>
                  </Grid>
                  <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center" marginTop={1}>
                    <Grid
                      marginTop="10px"
                      item
                      xs={12}
                      sm={4}
                      borderRadius="15px"
                      style={{
                        border: '2px dashed #000',
                        padding: '30px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={handleClick}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                        <span style={{ fontSize: '15px' }}>Choose a file or drag it here </span>
                        <Typography variant="body1" style={{ marginBottom: '8px' }}>
                          <CloudUploadIcon style={{ fontSize: '60px', color: 'blue' }} />
                          <br></br>
                          <span>
                            <b>File Attached :</b>
                          </span>
                        </Typography>
                        {file ? (
                          file.name
                        ) : (
                          <>
                            <label htmlFor="fileInput" style={{ marginTop: 'auto', color: 'blue', cursor: 'pointer' }}>
                              PO No. {values?.documentName ? values?.documentName : 'Upload file'}
                            </label>
                            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".pdf" />
                          </>
                        )}
                      </div>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                    <Button variant="outlined" size="small" color="error" sx={{ mr: 2 }}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      type="submit"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Form>
      )}
    </Formik>
  );
};

export default EmailForm;
