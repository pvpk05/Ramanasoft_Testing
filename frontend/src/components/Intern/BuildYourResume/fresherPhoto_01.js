import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkedAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FresherPhoto_01 = ({ resumeData }) => {
  const { personalData, professionalData, academicData } = resumeData;
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resumeRef = useRef(null);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (resumeData?.photo?.data) {
      // Convert the byte array to a Blob
      const byteArray = new Uint8Array(resumeData.photo.data);
      const blob = new Blob([byteArray], { type: "image/jpeg" }); // Adjust type as needed (e.g., "image/png")
      const url = URL.createObjectURL(blob);
      console.log("url :", url);
      setImageURL(url); // Set the generated URL
    }
  }, [resumeData]);

  useEffect(() => {
    console.log("Photo data:", resumeData?.photo?.data);
  }, [resumeData]);


  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${personalData.firstname}_${personalData.lastName}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    setIsLoading(false);
    setShowDownloadMenu(false);
  };

  const generateDOCX = async () => {
    setIsLoading(true);
    try {
      // Create a new document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header with name and contact info
            new Paragraph({
              children: [
                new TextRun({
                  text: `${personalData.firstname} ${personalData.lastName}`,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(`${personalData.email} | ${personalData.phone}`),
              ],
            }),

            // Work Experience
            new Paragraph({
              children: [new TextRun({ text: 'WORK EXPERIENCE', bold: true, size: 24 })],
              spacing: { before: 400 },
            }),
            ...professionalData.workExperience.map(exp =>
              new Paragraph({
                children: [
                  new TextRun({ text: exp.role, bold: true }),
                  new TextRun({ text: ` at ${exp.company}\n` }),
                  new TextRun(exp.description),
                ],
                spacing: { before: 200 },
              })
            ),

            // Skills
            new Paragraph({
              children: [new TextRun({ text: 'KEY SKILLS', bold: true, size: 24 })],
              spacing: { before: 400 },
            }),
            new Paragraph({
              children: [new TextRun(professionalData.skills.join(', '))],
            }),

            // Education
            new Paragraph({
              children: [new TextRun({ text: 'EDUCATION', bold: true, size: 24 })],
              spacing: { before: 400 },
            }),
            ...academicData.map(edu =>
              new Paragraph({
                children: [
                  new TextRun({ text: edu.level, bold: true }),
                  new TextRun(`\n${edu.school} - ${edu.specialization}\nGrade: ${edu.grade}`),
                ],
                spacing: { before: 200 },
              })
            ),
          ],
        }],
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${personalData.firstname}_${personalData.lastName}_Resume.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Error generating DOCX. Please try again.');
    }
    setIsLoading(false);
    setShowDownloadMenu(false);
  };

  const handleDownload = async (format) => {
    if (format === 'pdf') {
      await generatePDF();
    } else if (format === 'docx') {
      await generateDOCX();
    }
  };
  return (
    <div className="container-fluid py-4 position-relative">
      <div className="absolute top-8 right-8">
        <div className="relative">
          <Button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            disabled={isLoading}
            variant='outlined'
            style={{ marginBottom: "20px" }}
          >
            {isLoading ? 'Processing...' : 'Download'}
          </Button>

          {showDownloadMenu && !isLoading && (
            <div >
              <div style={{ gap: "30px", marginBottom: "30px" }}>
                <Button
                  variant='outlined'
                  onClick={() => handleDownload('docx')}
                  style={{ marginRight: "20px" }}
                >
                  Download as DOCX
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => handleDownload('pdf')}
                >
                  Download as PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>


      <div
        ref={resumeRef}
        className="mx-auto p-4 bg-white shadow"
        style={{ width: '210mm', height: '297mm', color: '#333' }}
      >
        <header
          className="mb-4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: "-100%",
            width: "100%",
          }}
        >
          <section style={{ display: "flex" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              {/* Render the image */}
              {imageURL && (
                <img
                  src={imageURL}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <section style={{ backgroundColor: "#d4dfe7", padding: "30px", paddingLeft: "-30px", position: "relative" }}  >
              <h1
                style={{
                  fontWeight: "102px",
                  paddingTop: "30px",
                  paddingLeft: "30px",
                  backgroundColor: "#d4dfe7",
                  // justifyContent:"center",
                  fontFamily: "Alterglam Regular, sans-serif",
                  fontSize: "25px",
                  textTransform: "uppercase",
                }}
              >
                {resumeData.personalData.lastName} {resumeData.personalData.firstname}
              </h1>
              <p className="text-uppercase text-muted small">
                {resumeData.personalData.profileTitle}
              </p>
            </section>
          </section>
        </header>

        <div className="row">
          <div style={{ zIndex:"1",width: "40%",paddingLeft:"20px", background: "#d4dfe7", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", paddingBottom:"40px" }} >
            <section  className="mb-4" style={{ paddingRight: "80px", paddingTop: "30px" }}>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2"><FontAwesomeIcon icon={faPhone} /> +91 {resumeData.personalData.phone}</li>
                <li className="mb-2"><FontAwesomeIcon icon={faEnvelope} />  {resumeData.personalData.email}</li>
                <li className="mb-2"><FontAwesomeIcon icon={faMapMarkedAlt} /> {resumeData.personalData.currentLocation}</li>
                <li>{personalData.website}</li>
              </ul>
            </section>

            <section className="mb-4" style={{fontSize: "16px"}}>
              <h2 style={{ fontFamily: "Gill Sans, sans-serif", fontWeight: "600", color: "#002e4f", borderBottom: "3px solid #002e4f", paddingBottom: "5px", textTransform:"uppercase", fontSize:"16px" }}>Education</h2>
              {academicData.map((edu, index) => (
                <div key={index} style={{ fontSize: "19px" }}>
                  <span style={{ fontFamily: "Gill Sans, sans-serif", fontWeight:"bold", fontSize:"14px" }}>
                    {edu.level}, {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span> <br />
                  <span className="small text-muted" style={{ fontFamily: "Gill Sans, sans-serif", fontSize:"14px" }}>{edu.school}</span> <br />
                  <span className="small text-muted" style={{ fontFamily: "Gill Sans, sans-serif", fontSize:"14px" }}>GPA: {edu.grade}</span> <br /> <br />
                </div>
              ))}
            </section>

            <section className="mb-4">
              <h2 style={{ fontFamily: "Gill Sans, sans-serif", fontWeight: "600", fontSize: "19px", color: "#002e4f", borderBottom: "3px solid #002e4f", paddingBottom: "5px", textTransform:"uppercase"  }}>Skills</h2>
              <div className="gap-2" style={{ marginLeft: "10px", fontSize: "19px" }}>
                {professionalData.skills.map((skill, index) => (
                  <div key={index} className="small text-muted" style={{ fontFamily: "Gill Sans, sans-serif", fontSize:"14px" }}>
                    •  {skill} <br />
                  </div>
                ))}
              </div>
            </section>

            {professionalData.languages && <section className="mt-2">
              <h2 style={{ fontFamily: "Optima, sans-serif", fontWeight: "600", fontSize: "19px", color: "#002e4f", borderBottom: "3px solid #002e4f", paddingBottom: "5px", textTransform:"uppercase"  }}>Languages</h2>
              <div className="gap-2" style={{ paddingLeft: "10px", fontSize: "19px" }}>
                {professionalData.languages?.map((lang, index) => (
                  <div key={index} className="small text-muted" style={{ fontFamily: "Gill Sans, sans-serif", fontSize:"14px" }}>
                    •  {lang} <br />
                  </div>
                ))}
              </div>
            </section>
            }

          </div>
          {/* Right Column */}
          <div className="col-lg" style={{paddingTop:"30px", padding:"10px"}}>
            <section className="mb-4">
              <h2 style={{ fontFamily: "Optima, sans-serif", fontWeight: "600", fontSize: "19px", color: "#002e4f", borderBottom: "3px solid #002e4f", paddingBottom: "5px" }}>About Me</h2>
              <p className="small text-muted">
                <p style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "16px" }}>
                  Experienced professional with expertise in {professionalData.skills.join(' and ')}.
                  Currently located in {personalData.currentLocation} and seeking opportunities in {personalData.preferredWorkLocation}.
                </p>
              </p>
            </section>

            <section className="mb-2">
              <h2 style={{ fontFamily: "Gill Sans, sans-serif", fontWeight: "600", fontSize: "19px", color: "#002e4f", borderBottom: "3px solid #002e4f", paddingBottom: "5px", textTransform: "uppercase" }}>Work Experience</h2>
              {professionalData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bolder">{exp.company}</span>
                    <span className="small">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="small fw-medium mb-2">{exp.role}</p>
                  <p className="text-muted" style={{ fontSize: "16px", fontFamily: "Gill Sans, sans-serif" }}>{exp.description}</p>
                </div>
              ))}
            </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default FresherPhoto_01;