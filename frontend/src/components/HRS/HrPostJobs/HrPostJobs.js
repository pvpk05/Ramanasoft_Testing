import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import apiService from '../../../apiService';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';


// Validation Schema
const validationSchema = Yup.object().shape({
  jobTitle: Yup.string()
    .matches(/^[A-Za-z ]+$/, 'Job Title can only contain uppercase, lowercase letters')
    .min(5, 'Job Title must be at least 5 character')
    .max(30, 'Job Title cannot be more than 20 characters')
    .required('Job Title is required'),

  companyName: Yup.string().required('Company Name is required'),

  jobType: Yup.string().required('Job Type is required'),
  jobCategory: Yup.string().required('Job Category is required'),
  jobExperience: Yup.string().required('Job Experience is required'),

  jobQualification: Yup.string()
    .matches(/^[A-Za-z0-9@#\$%\^&\*\(\)_\+\-=\[\]\{\};':"\\|,.<>\/? ]+$/, 'Job Qualification can contain alphanumerics and special characters')
    .min(5)
    .max(50)
    .required('Job Qualification is required'),

  requiredSkills: Yup.string().required('Required Skills are required')
  .min(5)
  .max(50),

  // Validation for selectedDomains
  selectedDomains: Yup.array()
    .min(1, 'At least one domain must be selected')
    .required('Domains are required'),

  jobCity: Yup.string()
    .matches(/^[A-Za-z ]+$/, 'Job City can only contain alphabetic characters')
    .min(3)
    .max(30)
    .required('Job City is required'),

  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required')
    .matches(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6,7,8,9 and contain exactly 10 digits'),

  lastDate: Yup.date()
    .min(new Date().toISOString().split('T')[0], 'Last Date must be today or later')
    .required('Last Date is required'),

  jobDescription: Yup.string().required('Job Description is required')
  .min(10)
  .max(150),
  salary: Yup.string().required('Salary is required')
  .min(2)
  .max(20),

  applicationUrl: Yup.string().url('Invalid URL').required('Application URL is required'),
  openings: Yup.number().typeError('Must be a number')
  .min(1)
  .max(100),
  bond: Yup.string().required('Bond is required')
});

// Get HR ID from cookies
const HrId = Cookies.get('HRid');
console.log('HR ID:', HrId);

const HrPostJobs = () => {
  const [companyNames, setCompanyNames] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyId, setCompanyId] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  const fetchCompanyNames = async () => {
    try {
      const response = await apiService.get('/api/registered-companies');
      setCompanyNames(response.data);
      const details = response.data.reduce((acc, company) => {
        acc[company.companyName] = {
          email: company.email,
          phone: company.mobileNo,
          companyId: company.companyID,
          website: company.website
        };
        return acc;
      }, {});
      setCompanyDetails(details);
    } catch (error) {
      console.error('Error fetching company names', error);
    }
  };

  useEffect(() => {
    fetchCompanyNames();
  }, []);

  const domainOptions = [
    { key: "Python Full Stack", value: "Python Full Stack" },
    { key: "Java Full Stack", value: "Java Full Stack" },
    { key: "Mern Full Stack", value: "Mern Full Stack" },
    { key: "Testing Tools", value: "Testing Tools" },
    { key: "Scrum Master", value: "Scrum Master" },
    { key: "Business Analyst", value: "Business Analyst" },
    { key: "Data Science", value: "Data Science" },
    { key: "Dot Net", value: "Dot Net" },
    { key: "Cyber Security", value: "Cyber Security" },
    { key: "Cloud Data Engineer", value: "Cloud Data Engineer" },
    { key: "DevOps & Cloud Computing", value: "DevOps & Cloud Computing" },
    { key: "Project Management & Agile", value: "Project Management & Agile" },
    { key: "SalesForce", value: "SalesForce" },
    { key: "Medical Coding", value: "Medical Coding" },
    { key: "Investment Banking", value: "Investment Banking" },
    { key: "Digital Marketing", value: "Digital Marketing" },
    { key: "BI Reporting Tools", value: "BI Reporting Tools" },
    { key: "Microsoft Dynamics", value: "Microsoft Dynamics" },
    { key: "Service Now", value: "Service Now" },
  ];


  const icon = <CheckBoxOutlineBlank fontSize="small" />;
  const checkedIcon = <CheckBox fontSize="small" />;


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log('Form Values:', values);
    console.log('HR ID:', HrId);
    console.log('Company ID:', companyId);

    try {
      const response = await apiService.post('/api/post-job', { job: values, hrId: HrId, companyId: companyId });
      console.log('Registration request sent', response);
      toast.success('Job posted successfully', {
        autoClose: 5000
      });
      resetForm();
    } catch (error) {
      console.error('There was an error posting the job!', error);
      toast.error(`${error.response?.data?.message || 'Error posting job'}`, {
        autoClose: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ overflow: 'auto', backgroundColor: '#BED7DC' }}>
        <Container className='mt-3 mb-3 p-2 pl-5' style={{ width: '95%', height: '90%', backgroundColor: 'white', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', borderRadius: '5px' }}>
          <h1 className="my-4 fw-bold" style={{ color: '#6B92FA', fontStyle: 'Roboto' }}>Post a New Job</h1>
          <Formik
            initialValues={{
              jobTitle: '',
              companyName: '',
              jobType: '',
              jobCategory: '',
              selectedDomains: [],
              jobExperience: '',
              jobQualification: '',
              requiredSkills: '',
              jobCity: '',
              email: '',
              phone: '',
              lastDate: '',
              jobDescription: '',
              salary: '',
              applicationUrl: '',
              openings: '',
              bond: 'No',
              isBondChecked: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobTitle">Job Title *</label>
                    <Field name="jobTitle" type="text" required className={`form-control ${touched.jobTitle && errors.jobTitle ? 'is-invalid' : ''}`} placeholder="Enter Your Job Title" onKeyPress={(e) => {
                      if (!/^[a-zA-Z\s]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }} />
                    <ErrorMessage name="jobTitle" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="companyName">Company Name *</label>
                    <Field
                      name="companyName"
                      as="select"
                      required
                      className={`form-control ${touched.companyName && errors.companyName ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        const selectedCompany = e.target.value;
                        handleChange(e);
                        if (selectedCompany !== 'Select Company Name' && companyDetails[selectedCompany]) {
                          setFieldValue('email', companyDetails[selectedCompany].email);
                          setFieldValue('phone', companyDetails[selectedCompany].phone);
                          setFieldValue('applicationUrl', companyDetails[selectedCompany].website);
                          setCompanyId(companyDetails[selectedCompany].companyId);
                        } else {
                          setFieldValue('email', '');
                          setFieldValue('phone', '');
                          setFieldValue('applicationUrl', '');
                          setCompanyId(null);
                        }
                      }}
                    >
                      <option style={{ color: '#70706e' }} value="">Select Company name</option>
                      {companyNames.map((company) => (
                        <option key={company.companyName} value={company.companyName}>{company.companyName}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="companyName" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobType">Job Type *</label>
                    <Field name="jobType" as="select" required className={`form-control ${touched.jobType && errors.jobType ? 'is-invalid' : ''}`}>
                      <option value="">Select</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </Field>
                    <ErrorMessage name="jobType" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobCategory">Job Category *</label>
                    <Field name="jobCategory" as="select" required className={`form-control ${touched.jobCategory && errors.jobCategory ? 'is-invalid' : ''}`}>
                      <option value="">Select</option>

                      <option value="Technical">Technical</option>
                      <option value="Non-Technical">Non-Technical</option>
                    </Field>
                    <ErrorMessage name="jobCategory" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }}>Domains *</label>
                    <Autocomplete
                      multiple
                      options={domainOptions}
                      getOptionLabel={(option) => option.value}
                      disableCloseOnSelect
                      value={domainOptions.filter(option => values.selectedDomains.includes(option.key))}
                      onChange={(event, newValue) => {
                        // Store only the `key` values in selectedDomains
                        const selectedKeys = newValue.map((option) => option.key);
                        setFieldValue("selectedDomains", selectedKeys);
                      }}
                      isOptionEqualToValue={(option, value) => option.key === value.key}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.value}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Domains"
                          error={touched.selectedDomains && !!errors.selectedDomains} // Show error if touched and invalid
                          helperText={touched.selectedDomains && errors.selectedDomains} // Display error message
                        />
                      )}
                    />
                    <ErrorMessage
                      name="selectedDomains"
                      component="div"
                      className="invalid-feedback"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobCity">Job City *</label>
                    <Field name="jobCity" required type="text" className={`form-control ${touched.jobCity && errors.jobCity ? 'is-invalid' : ''}`} placeholder="Enter Your Location" />
                    <ErrorMessage name="jobCity" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobExperience">Job Experience *</label>
                    <Field name="jobExperience" required as="select" className={`form-control ${touched.jobExperience && errors.jobExperience ? 'is-invalid' : ''}`}>
                      <option value="">Select</option>
                      <option value="0-1">0-1</option>
                      <option value="1-3">1-3</option>
                      <option value="3-5">3-5</option>
                      <option value="5+">5+</option>
                    </Field>
                    <ErrorMessage name="jobExperience" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobQualification">Job Qualification *</label>
                    <Field name="jobQualification" type="text" required className={`form-control ${touched.jobQualification && errors.jobQualification ? 'is-invalid' : ''}`} placeholder="Enter Required Qualification"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z\s]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }} />
                    <ErrorMessage name="jobQualification" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="requiredSkills">Required Skills *</label>
                    <Field name="requiredSkills" required type="text" className={`form-control ${touched.requiredSkills && errors.requiredSkills ? 'is-invalid' : ''}`} placeholder="Enter Required Skills"
                    onKeyPress={(e) => {
                      if (!/^[a-zA-Z\s]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }} />
                    <ErrorMessage name="requiredSkills" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="email">Email *</label>
                    <Field  name="email" type="email" disabled className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`} placeholder="Enter Your Email" />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="phone">Phone *</label>
                    <Field
                      name="phone"
                      type="text"
                      disabled
                      className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter Your Phone Number"
                      inputProps={{
                        maxLength: 10,
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                      }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="lastDate">Last Date *</label>
                    <Field name="lastDate" type="date" required min={today} className={`form-control ${touched.lastDate && errors.lastDate ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="lastDate" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="salary">Salary Range *</label>
                    <Field name="salary" type="text" required className={`form-control ${touched.salary && errors.salary ? 'is-invalid' : ''}`} placeholder="Enter Salary here"  onKeyPress={(e) => {
                    if (!/^[a-zA-Z0-9\s]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}/>
                    <ErrorMessage name="salary" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="applicationUrl">Application URL *</label>
                    <Field name="applicationUrl" required type="url" className={`form-control ${touched.applicationUrl && errors.applicationUrl ? 'is-invalid' : ''}`} placeholder="Enter Application URL" />
                    <ErrorMessage name="applicationUrl" component="div" className="invalid-feedback" />
                  </Col>
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="openings">Number of Openings </label>
                    <Field name="openings" type="number" min={1} max={100} className={`form-control ${touched.openings && errors.openings ? 'is-invalid' : ''}`} placeholder="Enter Number of Openings"
                    onKeyPress={(e) => {
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }} />
                    <ErrorMessage name="openings" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <label style={{ color: '#70706e' }} htmlFor="jobDescription">Job Description *</label>
                    <Field name="jobDescription" required as="textarea" className={`form-control ${touched.jobDescription && errors.jobDescription ? 'is-invalid' : ''}`} placeholder="Enter Job Description" />
                    <ErrorMessage name="jobDescription" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col lg={8}>
                    <div className="form-check mt-4">
                      <label style={{ color: '#70706e' }} className="form-check-label" htmlFor="bondCheckbox">
                        Bond
                      </label>
                      <Field
                        name="isBondChecked"
                        type="checkbox"
                        className="form-check-input mr-3"
                        id="bondCheckbox"
                        checked={values.isBondChecked}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFieldValue('isBondChecked', checked);
                          setFieldValue('bond', checked ? '' : 'No');
                        }}
                      />
                    </div>
                    {values.isBondChecked && (
                      <Field
                        name="bond"
                        as="select"
                        className={`w-75 form-control mt-2 ${touched.bond && errors.bond ? 'is-invalid' : ''}`}
                      >
                        <option value="">Select Bond Years</option>
                        <option value="1 year">1 Year</option>
                        <option value="2 years">2 Years</option>
                        <option value="3 years">3 Years</option>
                      </Field>
                    )}
                    <ErrorMessage name="bond" component="div" className="invalid-feedback" />
                  </Col>
                </Row>

                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  POST
                </Button>
              </Form>
            )}
          </Formik>
        </Container>
      </div>
    </>
  );
};

export default HrPostJobs;

