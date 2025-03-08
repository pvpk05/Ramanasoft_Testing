import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import apiService from '../../../apiService.js'

import { Camera } from 'lucide-react';

import resume from './images/resume.png'
import fresherNoPhoto01 from './images/fresherNoPhoto01.png'
import fresherNoPhoto02 from './images/fresherNoPhoto02.png'
import fresherPhoto01 from './images/fresherPhoto01.png'

import OneyearResume01 from './images/1yearResume01.png'
import OneyearResume02 from './images/1yearResume02.png'
import OneyearPhotoResume01 from './images/1yearPhotoResume01.png'
import OneyearPhotoResume02 from './images/1yearPhotoResume02.png'
import expResume01 from './images/expResume01.png'
import expResume02 from './images/expResume02.png'

import ExpResume01 from './ExpResume01';
import ExpResume02 from './ExpResume02';

import OneyearPhoto01 from './OneYearPhoto01.js';
import OneyearPhoto02 from './OneYearPhoto02.js';

import OneyearNoPhoto01 from './OneYearNoPhoto01.js';
import OneyearNoPhoto02 from './OneYearNoPhoto02.js';
import fresherPhoto_01 from './fresherPhoto_01.js';
import fresherNoPhoto_01 from './fresherNoPhoto_01.js'
import fresherNoPhoto_02 from './fresherNoPhoto_02.js'


import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from '@mui/material';

import { Add, Remove } from "@mui/icons-material";

const PhotoInput = () => {
  const [preview, setPreview] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid item xs={12} sm={6}>
      <input
        type="file"
        accept="image/*"
        id="photo-upload"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />
      <label htmlFor="photo-upload">
        <Box
          sx={{
            border: '1px solid #ffffff',
            borderRadius: '4px',
            p: 2,
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#ffffff',
              opacity: 0.8
            }
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '140px',
                objectFit: 'contain'
              }}
            />
          ) : (
            <>
              <Camera size={40} color="#ffffff" />
              <Typography
                variant="body1"
                sx={{
                  color: '#ffffff',
                  mt: 1
                }}
              >
                Upload Photo
              </Typography>
            </>
          )}
        </Box>
      </label>
      {preview && (
        <Button
          variant="text"
          onClick={() => setPreview(null)}
          sx={{
            color: '#ffffff',
            mt: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Remove Photo
        </Button>
      )}
    </Grid>
  );
};


const templateData = {
  'No Experience': [
    {
      id: 1,
      component: fresherNoPhoto_01,
      name: 'template 01',
      preview: fresherNoPhoto01,
    },
    // {
    //   id: 2,
    //   component: fresherNoPhoto_02,
    //   name: 'template 02',
    //   preview: fresherNoPhoto02,
    // },
    {
      id: 3,
      component: fresherPhoto_01,
      name: 'template 03',
      preview: fresherPhoto01,
    }
  ],

  'Less Than 1 Years': [
    {
      id: 4,
      component: fresherNoPhoto_02,
      name: 'template 04',
      preview: OneyearResume01,
    },
    // {
    //   id: 5,
    //   component: OneyearPhoto01,
    //   name: 'template 05',
    //   preview: OneyearPhotoResume02,
    // },
    // {
    //   id: 6,
    //   component: OneyearPhoto02,
    //   name: 'template 06',
    //   preview: OneyearPhotoResume01,
    // },
    {
      id: 7,
      component: OneyearNoPhoto02,
      name: 'template 07',
      preview: OneyearResume02,
    },
  ],
  'Experienced': [
    {
      id: 8,
      component: ExpResume01,
      name: 'template 08',
      preview: expResume01,
    },
    {
      id: 9,
      component: ExpResume02,
      name: 'template 08',
      preview: expResume02,
    }
  ]
};


const TemplateSelector = ({ template, isSelected, onSelect }) => {
  return (
    <div
      // className={`position-relative cursor-pointer rounded overflow-hidden ${isSelected ? 'border border-primary' : ''}`}

      onClick={() => onSelect(template.id)}
      style={{
        transition: 'all 0.3s ease-in-out',
        borderWidth: isSelected ? '2px' : '1px',
        borderStyle: 'solid',
        borderColor: isSelected ? '#05b3f2' : '#ccc',
        width: '210px',
        borderRadius: "5px",
        padding: "4px",
        margin: '0 auto',
      }}
    >
      <img
        src={template.preview}
        alt={template.name}
        style={{
          width: '200px',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};




const ResumeTemplateRenderer = ({ selectedTemplate, templates, resumeData }) => {

  console.log(selectedTemplate);
  console.log(templates);
  console.log(resumeData);


  
  const getSelectedTemplate = () => {
    const flatTemplates = Object.values(templates).flat();
    return flatTemplates.find(template => template.id === selectedTemplate);
  };

  const selectedTemplateData = getSelectedTemplate();

  if (!selectedTemplateData) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please select a template
      </div>
    );
  }

  const TemplateComponent = selectedTemplateData.component;
  return <TemplateComponent resumeData={resumeData} />;
};


const TemplateSelection = ({ experienceLevel }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [showRenderer, setShowRenderer] = useState(false);

  const templates = templateData[experienceLevel] || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internID = Cookies.get("internID");
        console.log("Fetching data for internID:", internID);

        const response = await apiService.get(`/api/resume-data/${internID}`);
        console.log("Response object:", response);

        const data = response?.data;
        console.log("Data:", data);
        if (data) {
          setResumeData(data);
        } else {
          console.error("No data found for internID:", internID);
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    console.log("Selected template:", templateId);
  };

  const handleUseTemplate = () => {
    console.log("Proceeding with template:", selectedTemplate);
    setShowRenderer(true);
  };

  return (
    <div className="container text-white py-4" style={{ maxWidth: "1000px" }}>
      {!showRenderer ? (
        <>
          <h2 className="fw-bold mb-2">Available resumes</h2>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
            {templates.map((template) => (
              <div
                className="col d-flex justify-content-center"
                key={template.id}
              >
                <TemplateSelector
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={handleTemplateSelect}
                />
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="mt-4 text-center">
              <button
                className="btn btn-primary px-4 py-2"
                onClick={handleUseTemplate}
              >
                Use This Template
              </button>
            </div>
          )}
        </>
      ) : (
        <ResumeTemplateRenderer
          selectedTemplate={selectedTemplate}
          templates={templateData}
          resumeData={resumeData}
        />
      )}
    </div>
  );
};


const ExperienceLevel = ({ onSelect }) => {
  const [selectedExperience, setSelectedExperience] = useState(null);

  const experienceLevels = [
    'No Experience',
    'Less Than 1 Years',
    'Experienced'
  ];

  if (selectedExperience) {
    return <TemplateSelection experienceLevel={selectedExperience} />;
  }

  return (
    <div className="container py-4 align-items-center justify-content-center" style={{ color: "white" }}>
      <h1 className="text-center display-4 mb-2">
        How long have you been working?
      </h1>
      <p className="text-center lead mb-4" >
        We'll find the best templates for your experience level.
      </p>

      <div className="row g-3 d-flex align-items-center justify-content-center">
        {experienceLevels.map((level) => (
          <div key={level} className="col-6 col-md-4 col-lg-2">
            <button
              onClick={() => setSelectedExperience(level)}
              className={`btn btn-outline-primary w-100 ${selectedExperience === level ? 'active' : ''
                }`}
            >
              {level}
            </button>
          </div>
        ))}
      </div>
    </div>

  );
};

const WelcomeScreen = ({ onContinue }) => {
  return (
    <Box
      sx={{
        width: '100%',
        marginTop: 10,
        justifyContent: 'center',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <div style={{ display: "flex" }}>
        <div>
          <Typography
            variant="h2"
            color={'white'}
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              mb: 4,
              lineHeight: 1.2
            }}
          >
            Just Follow these <br />simple steps <br />
          </Typography>

          <div style={{ color: "white" }}>
            <p style={{ fontSize: "20px" }}>1. <strong>Select a template</strong>  from our library of professional designs </p>

            <p style={{ fontSize: "20px" }}>2. <strong>Build your resume</strong> with our industry-specific bullet points</p>
            <p style={{ fontSize: "20px" }}>3. <strong>Customize the details</strong> and wrap it up. You're ready to send!</p>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 d-flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src={resume}
              alt="Resume templates"
            />
          </div>
        </div>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'right', mt: 4 }} style={{ marginRight: "100px" }}>
        <Button
          onClick={onContinue}
          variant="contained"
          color="primary"
          sx={{
            paddingX: 8,
            paddingY: 1.5,
            borderRadius: '9999px',
            fontSize: '1.125rem',
            textTransform: 'none',
            backgroundColor: '#FF4B6C',
            '&:hover': {
              backgroundColor: '#FF3557'
            }
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

const AcademicPersonalForm = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showExperienceLevel, setShowExperienceLevel] = useState(false);

  const [projects, setProjects] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [educationFields, setEducationFields] = useState([]);

  const [resumeData, setResumeData] = useState(null);
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const internID = Cookies.get("internID");
        console.log("Fetching data for internID:", internID);

        const response = await apiService.get(`/api/resume-data/${internID}`);
        console.log("Response object:", response);

        const data = response?.data;
        console.log("Data:", data);
        if (data) {
          setResumeData(data);
          setShowExperienceLevel(true);
        } else {
          console.error("No data found for internID:", internID);
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchData();
  }, []);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleExperienceLevelSelect = (level) => {
    console.log('Selected experience level:', level);
  };

  const handleAddEducation = () => {
    setEducationFields([
      ...educationFields,
      { 
        level: '',
        school: '',
        city: '',
        grade: '',
        startDate: '',
        endDate: '',
        specialization: ''
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducationFields(educationFields.filter((_, i) => i !== index));
  };

  const handleAddProject = () =>
    setProjects([...projects, { title: "", description: "", demoLink: "" }]);
  const handleRemoveProject = (index) =>
    setProjects(projects.filter((_, i) => i !== index));

  const handleAddExperience = () =>
    setWorkExperience([
      ...workExperience,
      { role: "", company: "", startDate: "", endDate: "", description: "" },
    ]);
  const handleRemoveExperience = (index) =>
    setWorkExperience(workExperience.filter((_, i) => i !== index));

  const handleAddSkill = () => setSkills([...skills, ""]);
  const handleRemoveSkill = (index) =>
    setSkills(skills.filter((_, i) => i !== index));

  const handleAddCertification = () =>
    setCertifications([...certifications, { name: "", link: "" }]);
  const handleRemoveCertification = (index) =>
    setCertifications(certifications.filter((_, i) => i !== index));

  const handleAddLanguage = () => setLanguages([...languages, ""]);
  const handleRemoveLanguage = (index) =>
    setLanguages(languages.filter((_, i) => i !== index));


  const handleEducationChange = (index, field, value) => {
    const updatedFields = educationFields.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setEducationFields(updatedFields);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const personalData = Object.fromEntries(formData.entries());

    const academicData = educationFields.map((field) => ({
      level: field.level,
      school: field.school,
      city: field.city,
      grade: field.grade,
      startDate: field.startDate,
      endDate: field.endDate,
      specialization: field.specialization,
    }));

    const professionalData = {
      projects: projects.map((project) => ({
        title: project.title,
        description: project.description,
        demoLink: project.demoLink,
      })),
      workExperience: workExperience.map((experience) => ({
        role: experience.role,
        company: experience.company,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
      })),
      skills,
      languages,
      certifications: certifications.map((cert) => ({
        name: cert.name,
        link: cert.link,
      })),
    };

    // Combine the data into one object
    const data = {
      personalData,
      academicData,
      professionalData,
      preview
    };


    console.log(data);
    try {
      const internID = Cookies.get('internID');

      const response = await apiService.post(`/api/resume-data/${internID}`, data);
      if (response.status === 200) {
        console.log('Data saved successfully:', data);
        alert('Form submitted successfully!');
        setShowExperienceLevel(true);
      } else {
        console.error('Error saving data:', response.statusText);
        alert('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // if(resumeData) {
  //   setShowExperienceLevel(true);
  // }

  if (showExperienceLevel) {
    return <ExperienceLevel onSelect={handleExperienceLevelSelect} />;
  }


  return (
    <div>
      {showWelcome ? (
        <WelcomeScreen onContinue={handleContinue} />
      ) : (
        <Box component="form" maxWidth={1200} onSubmit={handleSubmit} p={4} style={{ margin: "0 auto", color: "white" }}>
          <Typography variant="h6" mb={1}>
            Consider filling this form to proceed furthur.
          </Typography>


          <Typography variant="h6" mb={1}>
            Personal Details
          </Typography>
          <Grid container spacing={3} mb={3}>
            {/* Row 1 */}
            <Grid item xs={12} sm={6} md={6} alignItems="center" justifyContent="center">
              <TextField
                fullWidth
                name="firstname"
                label="First Name"
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#ffffff' } // Label color
                }}
                InputProps={{
                  style: {
                    color: '#ffffff', // Text color
                    borderColor: '#ffffff' // Outline color
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ffffff' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} alignItems="center" justifyContent="center">
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#ffffff' } // Label color
                }}
                InputProps={{
                  style: {
                    color: '#ffffff', // Text color
                    borderColor: '#ffffff' // Outline color
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ffffff' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                }}
              />
            </Grid>

            {/* Upload Photo */}
            <Grid item xs={12} md={2} container justifyContent="center">
              <input
                type="file"
                accept="image/*"
                id="photo-upload"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <label htmlFor="photo-upload">
                <Box
                  sx={{
                    border: '1px solid #ffffff',
                    borderRadius: '4px',
                    p: 2,
                    minHeight: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#ffffff', opacity: 0.8 }
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '140px',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <>
                      <Camera size={40} color="#ffffff" />
                      <Typography
                        variant="body1"
                        sx={{ color: '#ffffff', mt: 1 }}
                      >
                        Upload Photo
                      </Typography>
                    </>
                  )}
                </Box>
              </label>

            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} sm={6} md={6} justifyContent="center" style={{marginTop:"-100px"}}>
              <TextField
                fullWidth
                name="email"
                label="Email ID"
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#ffffff' } // Label color
                }}
                InputProps={{
                  style: {
                    color: '#ffffff', // Text color
                    borderColor: '#ffffff' // Outline color
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ffffff' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} justifyContent="center"  style={{marginTop:"-100px"}}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#ffffff' } // Label color
                }}
                InputProps={{
                  style: {
                    color: '#ffffff', // Text color
                    borderColor: '#ffffff' // Outline color
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ffffff' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="currentLocation"
                label="Current Location"
                variant="outlined"
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="preferredWorkLocation"
                label="Preferred Work Location"
                variant="outlined"
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="github"
                label="GitHub URL"
                variant="outlined"
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
                }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="linkedin"
                label="LinkedIn URL"
                variant="outlined"
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
                }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="profileTitle"
                label="Profile Title (e.g., Full Stack Developer, ML Engineer, Data Scientist)"
                variant="outlined"
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
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
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ffffff' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
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
                <InputLabel style={{ color: "white" }}>Marital Status</InputLabel>
                <Select name="maritalStatus" label="Marital Status">
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                multiline
                name="profileSummary"
                label="Profile Summary"
                rows={2}
                variant="outlined"

                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffffff" },
                    "&:hover fieldset": { borderColor: "#ffffff" },
                    "&.Mui-focused fieldset": { borderColor: "#ffffff" },
                  },
                }}
                InputLabelProps={{ style: { color: "#ffffff" } }}
                InputProps={{ style: { color: "#ffffff" } }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" mt={2} mb={2} >Academic Information (Recently Completed First)</Typography>
      <Box mt={2} mb={2}>
        <Button variant="outlined" onClick={handleAddEducation}>
          Add Education
        </Button>
      </Box>

      {educationFields.map((field, index) => (
        <Grid container spacing={2} mb={4} key={index}>
          <Grid item xs={12} sm={12}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveEducation(index)}
            >
              <Remove style={{ color: "#ffffff" }} />
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Level (e.g., SSC, Intermediate or Degree)"
              variant="outlined"
              value={field.level}
              onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: {
                  color: '#ffffff',
                  borderColor: '#ffffff'
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Board/Specialization (e.g., APSSC, BTech)"
              variant="outlined"
              value={field.specialization}
              onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: {
                  color: '#ffffff',
                  borderColor: '#ffffff'
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="School/College"
              variant="outlined"
              value={field.school}
              onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: {
                  color: '#ffffff',
                  borderColor: '#ffffff'
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Grade"
              variant="outlined"
              value={field.grade}
              onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: {
                  color: '#ffffff',
                  borderColor: '#ffffff'
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={field.city}
              onChange={(e) => handleEducationChange(index, 'city', e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: {
                  color: '#ffffff',
                  borderColor: '#ffffff'
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffffff',
                  },
                },
              }}
            />
          </Grid>



          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              variant="outlined"
              value={field.startDate}
              onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
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
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              variant="outlined"
              value={field.endDate}
              onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
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
          </Grid>
        </Grid>
          ))}


          <Typography variant="h6" mt={4}>
            Professional Information
          </Typography>


          <Typography variant="h6" mt={2}>
            Projects
          </Typography>

          {projects.map((project, index) => (
            <Grid mb={2} spacing={2} key={index} mt={2}>
              <Grid item xs={12} sm={1} mb={2} style={{ top: 0, right: 0 }}>
                <Button variant="outlined" color="error" onClick={() => handleRemoveProject(index)}>
                  <Remove style={{ color: "#ffffff" }} />
                </Button>
              </Grid>

              <Grid item xs={12} mb={2} sm={6}>
                <TextField
                  fullWidth
                  label="Project Title"
                  value={project.title}
                  onChange={(e) =>
                    setProjects(
                      projects.map((p, i) =>
                        i === index ? { ...p, title: e.target.value } : p
                      )
                    )
                  }
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
              </Grid>

              <Grid item xs={12} sm={6} mb={2}>
                <TextField
                  fullWidth
                  label="Demo Link"
                  value={project.demoLink}
                  onChange={(e) =>
                    setProjects(
                      projects.map((p, i) =>
                        i === index ? { ...p, demoLink: e.target.value } : p
                      )
                    )
                  }
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
              </Grid>

              <Grid item xs={12} mb={2} sm={4}>
                <TextField
                  fullWidth
                  label="Project Description"
                  value={project.description}
                  onChange={(e) =>
                    setProjects(
                      projects.map((p, i) =>
                        i === index ? { ...p, description: e.target.value } : p
                      )
                    )
                  }
                  multiline
                  rows={2}
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
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddProject}
            sx={{ mt: 2 }}
          >
            Add Project
          </Button>

          {/* Add similar sections for Work Experience, Skills, and Certifications */}
          {/* Skills */}
          <Typography variant="h6" mt={4}>
            Skill Set
          </Typography>
          {skills.map((skill, index) => (
            <Grid container key={index} spacing={2} mt={1}>
              <Grid item xs={11}>
                <TextField
                  fullWidth
                  label={`Skill ${index + 1}`}
                  value={skill}
                  onChange={(e) =>
                    setSkills(skills.map((s, i) => (i === index ? e.target.value : s)))
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <Button variant="outlined" color="error" onClick={() => handleRemoveSkill(index)}>
                  <Remove style={{ color: "#ffffff" }} />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddSkill}
            sx={{ mt: 2 }}
          >
            Add Skill
          </Button>

          {/* Work Experience */}
          <Typography variant="h6" mt={4}>
            Work Experience
          </Typography>
          {workExperience.map((experience, index) => (
            <Grid container spacing={2} key={index} mt={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Role"
                  value={experience.role}
                  onChange={(e) =>
                    setWorkExperience(
                      workExperience.map((exp, i) =>
                        i === index ? { ...exp, role: e.target.value } : exp
                      )
                    )
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={experience.company}
                  onChange={(e) =>
                    setWorkExperience(
                      workExperience.map((exp, i) =>
                        i === index ? { ...exp, company: e.target.value } : exp
                      )
                    )
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={experience.startDate}
                  onChange={(e) =>
                    setWorkExperience(
                      workExperience.map((exp, i) =>
                        i === index ? { ...exp, startDate: e.target.value } : exp
                      )
                    )
                  }
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
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={experience.endDate}
                  onChange={(e) =>
                    setWorkExperience(
                      workExperience.map((exp, i) =>
                        i === index ? { ...exp, endDate: e.target.value } : exp
                      )
                    )
                  }
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
              </Grid>
              <Grid item xs={12} sm={11}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={experience.description}
                  onChange={(e) =>
                    setWorkExperience(
                      workExperience.map((exp, i) =>
                        i === index ? { ...exp, description: e.target.value } : exp
                      )
                    )
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button variant="outlined" color="error" onClick={() => handleRemoveExperience(index)}>
                  <Remove style={{ color: "#ffffff" }} />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddExperience}
            sx={{ mt: 2 }}
          >
            Add Work Experience
          </Button>


          {/* Certifications */}
          <Typography variant="h6" mt={4}>
            Certifications
          </Typography>
          {certifications.map((certification, index) => (
            <Grid container spacing={2} key={index} mt={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certification Name"
                  value={certification.name}
                  onChange={(e) =>
                    setCertifications(
                      certifications.map((c, i) =>
                        i === index ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Certificate Link"
                  value={certification.link}
                  onChange={(e) =>
                    setCertifications(
                      certifications.map((c, i) =>
                        i === index ? { ...c, link: e.target.value } : c
                      )
                    )
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button variant="outlined" color="error" onClick={() => handleRemoveCertification(index)}>
                  <Remove style={{ color: "#ffffff" }} />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddCertification}
            sx={{ mt: 2 }}
          >
            Add Certification
          </Button>

          {/* Known Languages */}
          <Typography variant="h6" mt={4}>
            Known Languages
          </Typography>

          {languages.map((language, index) => (
            <Grid container key={index} spacing={2} mt={1}>
              <Grid item xs={11}>
                <TextField
                  fullWidth
                  label={`Language ${index + 1}`}
                  value={language}
                  onChange={(e) =>
                    setLanguages(languages.map((l, i) => (i === index ? e.target.value : l)))
                  }
                  InputLabelProps={{
                    style: { color: '#ffffff' } // Label color
                  }}
                  InputProps={{
                    style: {
                      color: '#ffffff', // Text color
                      borderColor: '#ffffff' // Outline color
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <Button variant="outlined" color="error" onClick={() => handleRemoveLanguage(index)}>
                  <Remove style={{ color: "#ffffff" }} />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddLanguage}
            sx={{ mt: 2 }}
          >
            Add Language
          </Button>

          {/* 
<Typography variant="h6" mt={4}>
            Professional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField 
              fullWidth 
              name="projects" 
              label="Projects" 
              variant="outlined"
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
              }}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
              fullWidth 
              name="certificationsPro" 
              label="Certifications" 
              variant="outlined" 
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
              }}/>
            </Grid>
          </Grid> */}

          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </div>

  );
};

export default AcademicPersonalForm;
