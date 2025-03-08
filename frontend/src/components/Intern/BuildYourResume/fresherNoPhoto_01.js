import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Packer, Document, Paragraph, TextRun } from 'docx';

import { Button } from '@mui/material';

const DynamicResume = ({ resumeData }) => {
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
              <div style={{gap:"30px", marginBottom:"30px"}}>
                <Button
                  variant='outlined'
                  onClick={() => handleDownload('docx')}
                  style={{marginRight:"20px"}}
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
          <header className="border-b-2 border-blue-900 pb-4">
            <h1 style={{ color: "#0f4882", fontSize: "34px", fontFamily: "Blippo, fantasy", textTransform: "uppercase" }}>
              {personalData.firstname} {personalData.lastName}
            </h1>
            <div style={{ marginBottom: "5px", borderBottom: "4px solid #0f4882" }}>
              <p style={{ fontFamily: "Arial Narrow, sans-serif", marginLeft: "10px" }}>{personalData.email} | {personalData.phone} | {personalData.currentLocation}</p>
            </div>
          </header>

          <section className="mt-6" style={{ display: "flex", gap: "30px", marginBottom: "5px", borderBottom: "4px solid #0f4882" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", marginLeft: "25px", fontFamily: "Arial Narrow, sans-serif", color: "#0f4882" }}>SUMMARY</h2>
            <p style={{ fontFamily: "Arial Narrow, sans-serif", marginLeft: "30px", fontSize: "19px" }}>
              Experienced professional with expertise in {professionalData.skills.join(' and ')}.
              Currently located in {personalData.currentLocation} and seeking opportunities in {personalData.preferredWorkLocation}.
            </p>
          </section>

          <section style={{ marginTop: "30px", marginBottom: "15px", borderBottom: "4px solid #0f4882", display: "flex" }}>
            <div style={{ flex: "1", marginLeft: "25px" }}>
              <h2
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  fontFamily: "Arial Narrow, sans-serif",
                  color: "#0f4882",
                }}
              >
                WORK <br /> EXPERIENCE
              </h2>
            </div>
            <div style={{ flex: "4" }}>
              {professionalData.workExperience.map((experience, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Arial Narrow, sans-serif",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {experience.role}, {experience.company}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Arial Narrow, sans-serif",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {new Date(experience.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -
                      {new Date(experience.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "Arial Narrow, sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              marginBottom: "30px",
              borderBottom: "4px solid #0f4882",
              display: "flex",
            }}
          >
            <div style={{ flex: "1", marginLeft: "25px" }}>
              <h2
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  fontFamily: "Arial Narrow, sans-serif",
                  color: "#0f4882",
                }}
              >
                EDUCATION
              </h2>
            </div>
            <div style={{ flex: "4"}}>
              {academicData.map((education, index) => (
                <div
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <h3
                      style={{
                        marginTop:"5px",
                        marginBottom:"-12px",
                        fontFamily: "Arial Narrow, sans-serif",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {education.level}, {education.specialization}
                    </h3>
                    <h3
                      style={{
                        fontFamily: "Arial Narrow, sans-serif",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {education.year}
                    </h3>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "Arial Narrow, sans-serif",
                        fontSize: "16px",
                        margin: "5px 0",
                      }}
                    >
                      {education.school}
                    </p>
                    <p
                      style={{
                        fontFamily: "Arial Narrow, sans-serif",
                        fontSize: "16px",
                        margin: "5px 0",
                      }}
                    >
                      Final CGPA: {education.grade}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "flex", marginTop: "30px", gap: "30px", marginBottom: "5px" }}>
            <h2 style={{ fontSize: "19px", fontWeight: "800", marginLeft: "25px", fontFamily: "Arial Narrow, sans-serif", color: "#0f4882" }}>KEY SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {professionalData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DynamicResume;