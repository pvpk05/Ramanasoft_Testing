import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Packer, Document, Paragraph, TextRun } from 'docx';

import { Button } from '@mui/material';

const OneYearNoPhoto02 = ({ resumeData }) => {
  const { personalData, professionalData, academicData } = resumeData;
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resumeRef = useRef(null);

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

  const handleDownload = async (format) => {
    if (format === 'pdf') {
      await generatePDF();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 relative">
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

      <div ref={resumeRef}
        style={{
          width: "210mm",
          height: "297mm",
          background: "white",
          color: "black",
          padding: '15mm 10mm',
        }}>

        <div className="max-w-4xl mx-auto p-8 bg-white relative">
          <header>
            <h1 style={{ fontSize: "25px", fontWeight: "700", fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif", textTransform: "uppercase" }}>
              {personalData.firstname} {personalData.lastName}
            </h1>
            <h1 style={{ fontSize: "21px", fontWeight: "600", fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif", textTransform: "uppercase" }}>
              {personalData.profileTitle}
            </h1>

            <div style={{ marginBottom: "5px", borderBottom: "4px solid black" }}>
              <p className="text-muted" style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "16px", spacing: "2px" }}>{personalData.email} | {personalData.phone} | {personalData.currentLocation}</p>
            </div>
          </header>

          <section style={{ gap: "30px", marginTop: "20px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", marginTop: "10px", lineHeight: "22px", borderBottom: "2.5px solid black", fontFamily: "Gill Sans, sans-serif" }}>SUMMARY</h2>
            <p style={{ fontFamily: "Trebuchet MS, sans-serif", fontSize: "15px" }}>
              Experienced professional with expertise in {professionalData.skills.join(' and ')}.
              Currently located in {personalData.currentLocation} and seeking opportunities in {personalData.preferredWorkLocation}.
            </p>
          </section>

          <section style={{ gap: "30px", marginTop: "20px" }}>
            <div>
              <h2 style={{ fontSize: "19px", fontWeight: "800", marginTop: "10px", lineHeight: "22px", borderBottom: "2.5px solid black", fontFamily: "Gill Sans, sans-serif" }}>PROFESSIONAL EXPERIENCE</h2>
            </div>
            <div>
              {professionalData.workExperience.map((experience, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginRight: "10px"
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Trebuchet MS, sans-serif",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {experience.role}, {experience.company}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Trebuchet MS, sans-serif",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {new Date(experience.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      - {" "}
                      {new Date(experience.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p
                    style={{
                      marginTop: "-10px",
                      fontFamily: "Trebuchet MS, sans-serif",
                      fontSize: "15px",
                    }}
                  >
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ gap: "30px", marginTop: "20px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", marginTop: "10px", lineHeight: "22px", borderBottom: "2.5px solid black", fontFamily: "Gill Sans, sans-serif" }}>PROJECTS</h2>
            <div className="flex flex-wrap gap-2">
              <div style={{ fontFamily: "Trebuchet MS, sans-serif" }}>
                <p style={{ fontSize: "18px", marginBottom: "-2px" }}>{professionalData.projects[0].title}</p>
                <p style={{ fontSize: "15px" }}>{professionalData.projects[0].description}</p>
              </div>
            </div>
          </section>


          <section style={{ gap: "30px", marginTop: "20px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", marginTop: "10px", lineHeight: "22px", borderBottom: "2.5px solid black", fontFamily: "Gill Sans, sans-serif" }}>SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {professionalData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section style={{ gap: "30px", marginTop: "20px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", marginTop: "10px", lineHeight: "22px", borderBottom: "2.5px solid black", fontFamily: "Gill Sans, sans-serif" }}>EDUCATION</h2>

            {academicData[0] && (
              <div style={{ fontSize: "19px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <span
                    style={{
                      fontFamily: "Gill Sans, sans-serif",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {academicData[0].level}
                  </span>
                  <span
                    style={{
                      fontFamily: "Gill Sans, sans-serif",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {new Date(academicData[0].startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} -{" "}
                    {new Date(academicData[0].endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
                <span
                  className="small"
                  style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "15px" }}
                >
                  {academicData[0].school}
                </span>
                <br />
                <span
                  className="small"
                  style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "15px" }}
                >
                  GPA: {academicData[0].grade}
                </span>
                <br />
                <br />
              </div>
            )}
          </section>

          <section style={{ gap: "30px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", lineHeight: "22px", borderBottom: "2.5px solid black", fontFamily: "Gill Sans, sans-serif" }}>ADDITIONAL INFORMATION</h2>
            <p>
              <strong>Languages : </strong>{professionalData.languages.join(", ")} <br />
              <strong>Certifications : </strong>{professionalData.certifications[0].name}, {professionalData.certifications[1].name}              
            </p>
          </section>



        </div>
      </div>
    </div>
  );
};

export default OneYearNoPhoto02;