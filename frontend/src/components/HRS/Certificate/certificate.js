import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './certificate.css';
import image1 from './images/image1.png';
import ravisir_sign from './images/ravisir_sign.png';
import ramprasadsir_sign from './images/ramprasadsir_sign.png';
import ramanasoft_stump from './images/ramanasoft_stump.png';
import apiService from '../../../apiService';
import { toast } from 'react-toastify';
import { Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';




const CertificateGenerator = () => {
  const [domain, setDomain] = useState('');
  const [certificationId, setCertificationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);
  const [certificates, setCertificates] = useState([]);
  const date = new Date("01/02/2020").toISOString().split('T')[0];
  const maxdate = new Date("12/31/9999").toISOString().split('T')[0];
  const today = new Date().toISOString().split("T")[0];

  const [selectedTable, setSelectedTable] = useState('withInternID');
  const certificatesWithInternID = certificates.filter(cert => cert.internID);
  const certificatesWithoutInternID = certificates.filter(cert => !cert.internID);
  // const isFormValid = studentName && domain && position && startDate && endDate && certificationId;

  const domainPositions = {
    "Python Full Stack": "Full Stack Developer",
    "Java Full Stack": "Full Stack Developer",
    "Mern Full Stack": "Full Stack Developer",
    "Testing Tools": "Software Testing Engineer",
    "Scrum Master": "Scrum Master",
    "Businesses Analyst": "Business Analyst",
    "Data Science": "Data Science Intern",
    "Cyber Security": "Cyber Security Analyst",
    "Dot Net": "Dot Net Intern"
  };

  const [CertificateDetails, setCertificateDetails] = useState({
    studentName: '',
    domain: '',
    position: domainPositions[domain],
    certificationId: '',
    startDate: '',
    endDate: '',
  });



  const validationSchema = Yup.object({
    studentName: Yup.string()
      .required('Student Name is required')
      .min(5)
      .max(30)
      .matches(
        /^[A-Za-z]{5,30} [A-Za-z]{5,30}$/,
        `Name must consist of a first name and a last name each containing 5 to 30 characters, separated by a space, and should only contain letters`
      ),
    domain: Yup.string().required('Domain is required'),
    position: Yup.string().required('Position is required'),
    startDate: Yup.date()
      .required('Start Date is required')
      .transform((originalValue, originalObject) => {
        // Ensure the start date is a valid Date object
        return new Date(originalValue);
      }),
    endDate: Yup.date()
      .required('End Date is required')
      .test('end-date-after-start', 'End Date cannot be the same or before Start Date', function (value) {
        const { startDate } = this.parent;  // Access the startDate value from the parent object (form)
        return value > startDate;  // Ensure endDate is after startDate
      })
      .transform((originalValue, originalObject) => {
        // Ensure the end date is a valid Date object
        return new Date(originalValue);
      }),
  });
  
  

  useEffect(() => {
    const fetchCertificationId = async () => {
      try {
        const month = new Date().getMonth() + 1;
        const monthString = month < 10 ? `0${month}` : `${month}`;
        const response = await apiService.get(`/api/generate-certificate-id/${domain}/${monthString}`);
        const newCertificationId = response.data.newCertificationId;
        setCertificationId(newCertificationId);
      } catch (error) {
        console.error('Error fetching certification ID:', error);
      }
    };

    if (domain) {
      fetchCertificationId();
    }
  }, [domain]);

  useEffect(() => {
    fetchCertificates();
  }, []);


  const fetchCertificates = async () => {
    try {
      const response = await apiService.get('/api/show_all_certificates');
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };


  const styles = {
    error: {
      color: 'red',
      fontSize: '0.9rem',
      marginTop: '0.25rem',
    },
    inputField: {
      marginBottom: '1rem',
    },
  };

  const toCamelCase = (str) => {
    return str
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  };

  const handleSubmit = async (values) => {
    try {

      await apiService.post('/api/save_certificate_data', CertificateDetails);
      toast.success('Certificate generated successfully!');
      html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${CertificateDetails.studentName}_certificate.pdf`);
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('There was an error generating the certificate.');
    }
  };

  const toggleCertificatePreview = () => {
    setShowCertificate((prevState) => !prevState);
  };

  return (
    <div>
      <div className='Certificate_Generator' style={{ marginTop: "30px" }}>
        <Formik
          initialValues={{
            studentName: '',
            domain: '',
            position: '',
            startDate: '',
            endDate: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isValid, setFieldValue, values }) => (
            <Form className="input-form">
              <div>
                <Field
                  name="studentName"
                  placeholder="Student Name"
                  onChange={(e) => {
                    const value = e.target.value;
                    setCertificateDetails((prev) => ({ ...prev, studentName: value }));
                    setFieldValue("studentName", value); // Update Formik state
                  }}

                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z\s]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }} />
                <ErrorMessage name="studentName" component="div" className="error" style={styles.error} />
              </div>



              <div>
                <Field as="select"
                  name="domain"
                  onChange={(e) => {
                    const selectedDomain = e.target.value;
                    setCertificateDetails((prev) => ({
                      ...prev,
                      domain: selectedDomain,
                      position: domainPositions[selectedDomain] || '',
                    }));
                    setDomain(selectedDomain);
                    setFieldValue("domain", selectedDomain);
                    setFieldValue("position", domainPositions[selectedDomain] || '');
                  }}
                >
                  <option value="" disabled>Select Domain</option>
                  {Object.keys(domainPositions).map((domain, index) => (
                    <option key={index} value={domain}>
                      {domain}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="domain" component="div" className="error" style={styles.error} />
              </div>


              {/* <div>
                <Field as="select" name="position">
                  <option value="">Select Position</option>
                  <option value={values.position}>{values.position}</option>
                </Field>
                <ErrorMessage name="position" component="div" className="error" style={styles.error} />
              </div> */}



              <div>
                <Field name="startDate" type="date" min={date} max={maxdate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStartDate(value);
                    setCertificateDetails((prev) => ({ ...prev, startDate: value }));
                    setFieldValue("startDate", value);
                  }}
                />
                <ErrorMessage name="startDate" component="div" className="error" style={styles.error} />
              </div>

              <div>
                <Field name="endDate" type="date" disabled={!startDate} min={today} max={maxdate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEndDate(value);
                    setCertificateDetails((prev) => ({ ...prev, endDate: value }));
                    setFieldValue("endDate", value);
                  }}
                />
                <ErrorMessage name="endDate" component="div" className="error" style={styles.error} />
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <Button variant="contained" onClick={toggleCertificatePreview}>
                  {showCertificate ? 'Hide' : 'Preview'}
                </Button>
                <Button type="submit" variant="contained" color='success' disabled={!isValid}>
                  Generate
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        {showCertificate && (
          <div ref={certificateRef} className="certificate">
            <img src={image1} alt="Company Logo" className="company-logo" />
            <p className="date">Date: {formatDate(new Date())}</p>
            <h1>Experience Letter</h1>
            <p>Dear <strong>{toCamelCase(CertificateDetails.studentName)}</strong>,</p>
            <p>
              Congratulations on your successful completion of <strong>Internship</strong> on
              <strong> {domain}</strong> in our organization.
            </p>
            <div className="details">
              <p><strong>Position</strong>: {CertificateDetails.position}</p>
              <p><strong>Certification Id</strong>: {certificationId}</p>
              <p><strong>Duration</strong>: {formatDate(startDate)} to {formatDate(endDate)}</p>
            </div>
            <p>
              Your willingness to learn, adapt, showing sensitivity to urgency and
              involvement in the tasks assigned to you is appreciated by the entire
              Software Developer team. We are sure you will see success coming to
              you more easily with this approach.
            </p>
            <p>
              Besides showing high comprehension capacity, managing assignments with
              the utmost expertise, and exhibiting maximal efficiency, you have also
              maintained an outstanding professional demeanor and showcased
              excellent moral character throughout the traineeship period.
            </p>
            <div className='regards-p'>
              We hereby certify your overall work as <strong>Good</strong> to the best of my
              knowledge.
              <br />
              Wishing you the best of luck in your future endeavors.
            </div>
            <img src={ramanasoft_stump} alt='CEO' style={{ width: "120px", height: "120px", marginLeft: "30px", marginTop: "40px" }} />
            <div className='signature-container'>
              <p className="ceo-signature">C.E.O</p>
              <p className="manager-signature">Program Manager</p>
            </div>
            <div className='signature-container2'>
              <img src={ramprasadsir_sign} alt='CEO' style={{ width: "120px", height: "30px", marginLeft: "30px" }} />
              <img src={ravisir_sign} alt='Program_Manager' style={{ width: "120px", height: "40px", marginRight: "20px" }} />
            </div>
          </div>

        )}

        <div>
          <Typography variant="h5" gutterBottom>
            Certificate List
          </Typography>

          {/* Dropdown to select which table to display */}
          <FormControl fullWidth>
            <InputLabel>Choose Table</InputLabel>
            <Select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              label="Choose Table"
            >
              <MenuItem value="withInternID">Automatically Generated</MenuItem>
              <MenuItem value="withoutInternID">Manually Generated</MenuItem>
            </Select>
          </FormControl>

          {/* Conditionally render the tables based on the selected option */}
          {selectedTable === 'withInternID' && certificatesWithInternID.length > 0 ? (
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Intern ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Certification Id</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificatesWithInternID.map((certificate) => (
                    <TableRow key={certificate.certificationId}>
                      <TableCell>{certificate.internID}</TableCell>
                      <TableCell>{certificate.studentName}</TableCell>
                      <TableCell>{certificate.domain}</TableCell>
                      <TableCell>{certificate.position}</TableCell>
                      <TableCell>{certificate.certificationId}</TableCell>
                      <TableCell>{formatDate(certificate.startDate)}</TableCell>
                      <TableCell>{formatDate(certificate.endDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : selectedTable === 'withInternID' && certificatesWithInternID.length === 0 ? (
            <Typography variant="body1" sx={{ marginTop: 2 }}>No certificates available with Intern ID.</Typography>
          ) : null}

          {selectedTable === 'withoutInternID' && certificatesWithoutInternID.length > 0 ? (
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Certification Id</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificatesWithoutInternID.map((certificate) => (
                    <TableRow key={certificate.certificationId}>
                      <TableCell>{certificate.studentName}</TableCell>
                      <TableCell>{certificate.domain}</TableCell>
                      <TableCell>{certificate.position}</TableCell>
                      <TableCell>{certificate.certificationId}</TableCell>
                      <TableCell>{formatDate(certificate.startDate)}</TableCell>
                      <TableCell>{formatDate(certificate.endDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : selectedTable === 'withoutInternID' && certificatesWithoutInternID.length === 0 ? (
            <Typography variant="body1" sx={{ marginTop: 2 }}>No certificates available without Intern ID.</Typography>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;


