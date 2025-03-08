import React from 'react';
import { TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import apiService from '../../../apiService';

const HRRegistration = ({ setSelectedView }) => {
  const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/;

  const mindate = new Date("01/01/1970").toISOString().split('T')[0];
  const maxdate = new Date("12/31/2005").toISOString().split('T')[0];

 
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full Name is required *')
      .min(5)
      .max(30)
      .matches(
        /^[A-Za-z]{5,30} [A-Za-z]{5,30}$/,
        `Full Name must consist of a first name and a last name each containing 5 to 30 characters, separated by a space, and should only contain letters`
      ),
    email: Yup.string()
      .matches(emailRegex, 'Invalid email format')
      .required('Email is required *'),

    contactNo: Yup.string()
      .matches(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6,7,8,9 and contain exactly 10 digits')
      .required('Contact No is required *'),
    dob: Yup.date().required('Date of Birth is required *')
      .min(new Date(mindate), `Date of Birth must be after or on ${mindate}`)
      .max(new Date(maxdate), `Date of Birth must be before or on ${maxdate}`),
  
    address: Yup.string()
      .required('Address is required')
      .min(5, 'Address must be at least 5 characters long')
      .max(30, 'Address must be less than or equal to 30 characters')
      .matches(/[a-zA-Z]/, 'Address must contain at least one letter')
      .matches(/[0-9]/, 'Address must contain at least one number')
      .matches(/[\W_]/, 'Address must contain at least one special character'),

    workEmail: Yup.string()
    .matches(emailRegex, 'Invalid email format')
    .required('Email is required *'),

    workMobile: Yup.string()
      .matches(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6,7,8,9 and contain exactly 10 digits')
      .required('Work Mobile is required *'),

    emergencyContactName: Yup.string()
      .required('Full Name is required *')
      .min(5)
      .max(30)
      .matches(
        /^[A-Za-z]{5,30} [A-Za-z]{5,30}$/,
        `Name must consist of a first name and a last name each containing 5 to 30 characters, separated by a space, and should only contain letters`
      ),
    emergencyContactAddress: Yup.string()
      .required('Address is required')
      .min(5, 'Address must be at least 5 characters long')
      .max(30, 'Address must be less than or equal to 30 characters')
      .matches(/[a-zA-Z]/, 'Address must contain at least one letter')
      .matches(/[0-9]/, 'Address must contain at least one number')
      .matches(/[\W_]/, 'Address must contain at least one special character'),

    emergencyContactMobile: Yup.string()
      .matches(/^[6-9][0-9]{9}$/, 'Mobile number must start with 6,7,8,9 and contain exactly 10 digits')
      .required('Emergency Contact Mobile is required *')
      .notOneOf([Yup.ref('contactNo')], 'mobile numbers should not match *'),

    gender: Yup.string().required('Gender is required *'),
    branch: Yup.string().required('Branch is required *')
    .min(5, 'Branch must be at least 5 characters long')
    .max(30, 'Branch must be less than or equal to 30 characters')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await apiService.post('/api/register/hr', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      toast.success('Registered successfully!', { autoClose: 5000 });
      setSelectedView('home');
      navigate('/');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning(`${error.response.data.message}.`);
        }
        if (error.response.status === 401) {
          toast.warning(`${error.response.data.message}.`);
        } else {
          toast.error('Failed to register. Please try again later.');
        }
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="intern_reg_container" style={{ color: "white" }}>
      <h4 className="intern_reg_subtitle">HR Registration Form</h4>
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          contactNo: '',
          dob: '',
          address: '',
          workEmail: '',
          workMobile: '',
          emergencyContactName: '',
          emergencyContactAddress: '',
          emergencyContactMobile: '',
          gender: '',
          branch: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="intern_reg_section">
            <div className="intern_reg_section">
              <h3 className="intern_reg_section_title">Personal Information</h3>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Full Name"
                  variant="outlined"
                  className="intern_reg_input"
                  name="fullName"
                  error={touched.fullName && !!errors.fullName}
                  helperText={touched.fullName && errors.fullName}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  className="intern_reg_input"
                  name="email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Contact No"
                  variant="outlined"
                  className="intern_reg_input"
                  name="contactNo"
                  required
                  inputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                    maxLength: 10,
                    inputMode: 'numeric', // Ensures numeric keyboard on mobile devices
                    pattern: '[0-9]*' // Ensures only numbers are allowed
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="bg-secondary-subtle rounded p-2">+91</span>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}

                  error={touched.contactNo && !!errors.contactNo}
                  helperText={touched.contactNo && errors.contactNo}
                  onKeyPress={(e) => {
                    // Allow only digits (0-9)
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              {/* <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  className="intern_reg_input"
                  name="dob"
                  error={touched.dob && !!errors.dob}
                  helperText={touched.dob && errors.dob}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}

                  
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div> */}

              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  className="intern_reg_input"
                  name="dob"
                  error={touched.dob && !!errors.dob}
                  helperText={touched.dob && errors.dob}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: '#ffffff' }, // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff', // Border color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                    '& input[type="date"]': {
                      color: '#ffffff', // Input text color
                      backgroundColor: 'transparent', // Ensuring no background color that might override
                      paddingRight: '30px', // Making sure we leave space for the icon (optional)
                    },
                    // Webkit browsers (Chrome, Safari)
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1)', // Make the calendar icon white
                    },
                    // Firefox
                    '& input[type="date"]::-moz-calendar-picker-indicator': {
                      filter: 'invert(1)', // Make the calendar icon white
                    },
                  }}
                />
              </div>


              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Address"
                  variant="outlined"
                  className="intern_reg_input"
                  name="address"
                  error={touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}

                />
              </div>
              <div className="intern_reg_form_group">
                <FormControl variant="outlined" className="intern_reg_input" error={touched.gender && !!errors.gender}>
                  <InputLabel style={{ color: '#ffffff' }} >Gender</InputLabel>
                  <Field
                    as={Select}
                    name="gender"
                    label="Gender"
                    labelId="gender-label"
                    sx={{
                      color: '#ffffff', // Text color
                      '.MuiInputBase-input': {
                        color: '#ffffff', // Select text color
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff', // Focused border color
                      },
                      '.MuiSvgIcon-root': {
                        color: '#ffffff', // Dropdown arrow color
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#333333', // Dropdown menu background
                          color: '#ffffff', // Dropdown menu text color
                        },
                      },
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Field>
                  {touched.gender && errors.gender ? <div className="text-danger">{errors.gender}</div> : null}
                </FormControl>
              </div>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Branch"
                  variant="outlined"
                  className="intern_reg_input"
                  name="branch"
                  error={touched.branch && !!errors.branch}
                  helperText={touched.branch && errors.branch}
		  onKeyPress={(e) => {
                    if (!/[a-zA-Z ]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="intern_reg_section">
              <h3 className="intern_reg_section_title">Professional Information</h3>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Work Email"
                  variant="outlined"
                  className="intern_reg_input"
                  name="workEmail"
                  error={touched.workEmail && !!errors.workEmail}
                  helperText={touched.workEmail && errors.workEmail}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Work Mobile"
                  variant="outlined"
                  className="intern_reg_input"
                  name="workMobile"
                  inputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                    maxLength: 10,
                    inputMode: 'numeric', // Ensures numeric keyboard on mobile devices
                    pattern: '[0-9]*' // Ensures only numbers are allowed
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="bg-secondary-subtle rounded p-2">+91</span>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                  onKeyPress={(e) => {
                    // Allow only digits (0-9)
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  error={touched.workMobile && !!errors.workMobile}
                  helperText={touched.workMobile && errors.workMobile}
                />
              </div>
            </div>
            <div className="intern_reg_section">
              <h3 className="intern_reg_section_title">Emergency Contact Information</h3>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Emergency Contact Name"
                  variant="outlined"
                  className="intern_reg_input"
                  name="emergencyContactName"
                  error={touched.emergencyContactName && !!errors.emergencyContactName}
                  helperText={touched.emergencyContactName && errors.emergencyContactName}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Emergency Contact Address"
                  variant="outlined"
                  className="intern_reg_input"
                  name="emergencyContactAddress"
                  error={touched.emergencyContactAddress && !!errors.emergencyContactAddress}
                  helperText={touched.emergencyContactAddress && errors.emergencyContactAddress}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                />
              </div>
              <div className="intern_reg_form_group">
                <Field
                  as={TextField}
                  label="Emergency Contact Mobile"
                  variant="outlined"
                  className="intern_reg_input"
                  name="emergencyContactMobile"
                  inputProps={{
                    style: {
                      color: '#ffffff',          // Text color
                      borderColor: '#ffffff'     // Outline color
                    },
                    maxLength: 10,
                    inputMode: 'numeric', // Ensures numeric keyboard on mobile devices
                    pattern: '[0-9]*' // Ensures only numbers are allowed
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="bg-secondary-subtle rounded p-2">+91</span>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ffffff', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#ffffff', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ffffff', // Focused border color
                      },
                    },
                  }}
                  error={touched.emergencyContactMobile && !!errors.emergencyContactMobile}
                  helperText={touched.emergencyContactMobile && errors.emergencyContactMobile}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="intern_reg_button"
              disabled={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default HRRegistration;

