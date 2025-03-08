import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const ResumeDash = () => {
  const [formData, setFormData] = useState({
    ssc: { school: "", city: "", grade: "", year: "" },
    intermediate: { school: "", city: "", grade: "", year: "", specialization: "" },
    btech: { school: "", city: "", grade: "", year: "", university: "", specialization: "" },
    mtech: { school: "", city: "", grade: "", year: "", university: "", specialization: "" },
    personal: {
      name: "",
      fatherName: "",
      currentLocation: "",
      preferredLocation: "",
      maritalStatus: "",
      passportStatus: "",
      activities: "",
      certifications: "",
      githubUrl: "",
      linkedInUrl: "",
      email: "",
      phone: "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace this with an API call to save data in SQL table
    console.log("Form Data Submitted: ", formData);
    alert("Form submitted successfully!");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 1200, mx: "auto", background:"white" }}>
      <Typography variant="h4" gutterBottom>
        Academic and Personal Details Form
      </Typography>

      {/* SSC Details */}
      <Typography variant="h6">SSC</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="School"
            fullWidth
            value={formData.ssc.school}
            onChange={(e) => handleChange("ssc", "school", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            fullWidth
            value={formData.ssc.city}
            onChange={(e) => handleChange("ssc", "city", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Grade"
            fullWidth
            value={formData.ssc.grade}
            onChange={(e) => handleChange("ssc", "grade", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Year"
            fullWidth
            type="number"
            value={formData.ssc.year}
            onChange={(e) => handleChange("ssc", "year", e.target.value)}
            required
          />
        </Grid>
      </Grid>

      {/* Intermediate/Polytechnic Details */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Intermediate / Polytechnic
      </Typography>
      <Grid container spacing={2}>
        {/** Fields similar to SSC but include Specialization */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="School"
            fullWidth
            value={formData.intermediate.school}
            onChange={(e) => handleChange("intermediate", "school", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            fullWidth
            value={formData.intermediate.city}
            onChange={(e) => handleChange("intermediate", "city", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Grade"
            fullWidth
            value={formData.intermediate.grade}
            onChange={(e) => handleChange("intermediate", "grade", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Year"
            fullWidth
            type="number"
            value={formData.intermediate.year}
            onChange={(e) => handleChange("intermediate", "year", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Specialization"
            fullWidth
            value={formData.intermediate.specialization}
            onChange={(e) => handleChange("intermediate", "specialization", e.target.value)}
          />
        </Grid>
      </Grid>


      <Typography variant="h6" sx={{ mt: 3 }}>
        Personal Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            fullWidth
            value={formData.personal.name}
            onChange={(e) => handleChange("personal", "name", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Father Name"
            fullWidth
            value={formData.personal.fatherName}
            onChange={(e) => handleChange("personal", "fatherName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Current Location"
            fullWidth
            value={formData.personal.currentLocation}
            onChange={(e) => handleChange("personal", "currentLocation", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Preferred Work Location"
            fullWidth
            value={formData.personal.preferredLocation}
            onChange={(e) => handleChange("personal", "preferredLocation", e.target.value)}
          />
        </Grid>
      </Grid>


      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ResumeDash;
