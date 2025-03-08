import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead,TextField, TableRow, Paper, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import apiService from "../../../apiService";

const DomainAndBatch = () => {
  const [domains, setDomains] = useState([]); // Stores domains and batches

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await apiService.get("/api/domain_data");
        setDomains(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch domain data.");
      }
    };

    fetchDomains();
  }, []);

  // Validation schema for Formik
  const validationSchema = Yup.object({
    domain: Yup.string()
      .matches(/^[a-zA-Z0-9 ]+$/, "Domain can only contain alphanumeric characters and spaces.")
      .min(5)
      .max(30)
      .required("Domain is required."),
      batches: Yup.string()
      .test(
        "not-zero",
        "Batches must be a comma-separated list of non-zero numbers.",
        (value) => {
          // Check if the value is a valid comma-separated list of numbers and no number is zero or leading zeroes
          return /^([1-9]\d*)(,([1-9]\d*))*$/.test(value);
        }
      )
      .min(1)
      .max(15)
      .required("Batches are required."),
    
  });

  const addDomain = async (values, { resetForm }) => {
    const { domain, batches } = values;
    const batchesArray = batches.split(",").map((batch) => batch.trim());
  
    // Check for duplicate domain and batch combination
    const isDuplicate = domains.some((item) => {
      const existingBatches = item.batch.split(",").map((batch) => batch.trim());
      return (
        item.domain.toLowerCase() === domain.toLowerCase() &&
        batchesArray.some((batch) => existingBatches.includes(batch))
      );
    });
  
    if (isDuplicate) {
      toast.warning("This domain with one or more batches already exists.");
      return;
    }
  
    const newDomain = { domain: domain.trim(), batches: batchesArray };
  
    try {
      await apiService.post("/api/save-domain", newDomain);
      const response = await apiService.get("/api/domain_data");
      setDomains(response.data);
      resetForm();
      toast.success("Domain added successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save domain.");
    }
  };
  

  // Delete domain
  const deleteDomain = async (id) => {
    try {
      await apiService.delete(`/api/delete-domain/${id}`);
      setDomains((prevDomains) => prevDomains.filter((item) => item.id !== id));
      toast.success("Domain deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete domain.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer />

      <Formik
        initialValues={{ domain: "", batches: "" }}
        validationSchema={validationSchema}
        onSubmit={addDomain}
      >
        {({ errors, touched }) => (
          <Form style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <Field
                name="domain"
                as={TextField}
                label="Enter domain"
                variant="outlined"
                size="small"
                error={touched.domain && Boolean(errors.domain)}
                helperText={touched.domain && errors.domain}
                fullWidth
                onKeyPress={(e) => {
                  if (!/^[a-zA-Z\s]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                />
            </div>

            <div style={{ flex: 2 }}>
              <Field
                name="batches"
                as={TextField}
                label="Enter batches (comma-separated)"
                variant="outlined"
                size="small"
                error={touched.batches && Boolean(errors.batches)}
                helperText={touched.batches && errors.batches}
                fullWidth
                onKeyPress={(e) => {
                  if (!/[a-zA-Z0-9\s,]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Form>
        )}
      </Formik>

      <TableContainer
        style={{ alignItems: "center", maxWidth: "700px", justifyContent: "center" }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ fontWeight: "bold", fontSize: "18px" }}>
                Domain
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold", fontSize: "18px" }}>
                Batch
              </TableCell>
              <TableCell align="right" style={{ fontWeight: "bold", fontSize: "18px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="left">{item.domain}</TableCell>
                <TableCell align="center">{item.batch}</TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => deleteDomain(item.id)}>
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DomainAndBatch;

