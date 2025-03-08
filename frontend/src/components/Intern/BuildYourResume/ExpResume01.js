import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCalendar, faMapMarkedAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const ExpResume01 = ({ resumeData }) => {
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
        <header className="border-b-2 border-blue-900 pb-4">
          <h1 style={{ fontSize: "40px", fontFamily: "Blippo, fantasy", textTransform: "uppercase" }}>
            {personalData.lastName} {personalData.firstname}
          </h1>
          <h3 style={{ color: "#fc6b03", fontSize: "25px", fontWeight: "bolder" }}>
            {personalData.profileTitle}
          </h3>
          <div style={{ justifyContent: "space-between", alignItems: "center" }}>
            <span className='text-muted' style={{ fontSize: "16px", marginLeft:"20px" }}><FontAwesomeIcon icon={faEnvelope} /> {personalData.email}</span>
            <span className='text-muted' style={{ fontSize: "16px", marginLeft:"110px" }}> <FontAwesomeIcon icon={faPhone} /> {personalData.phone} </span>
            <span className='text-muted' style={{ fontSize: "16px", marginLeft:"120px" }}> <FontAwesomeIcon icon={faMapMarkedAlt} /> {personalData.currentLocation} </span>
          </div>
        </header>

        <div className="row">

          <div className="col-lg" style={{ paddingTop: "30px", padding: "10px" }}>
            <section className="mb-2">
              <h2 style={{ fontFamily: "Helvetica, sans-serif", fontWeight: "900", fontSize: "22px",  borderBottom: "4px solid black", paddingBottom: "5px", textTransform: "uppercase" }}>Work Experience</h2>
              {professionalData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <p style={{fontSize:"25px", fontWeight:"Arial Narrow, sans-serif", marginBottom:"-4px"}}>{exp.role}</p>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bolder" style={{color:"#fc6b03"}}>{exp.company}</span>
                  </div>
                    <p className="small text-muted" style={{marginBottom:"2px"}}><FontAwesomeIcon icon={faCalendar} />  {exp.startDate} - {exp.endDate}</p>
                  <p className="text-muted" style={{ fontSize: "16px", fontFamily: "Gill Sans, sans-serif" }}>{exp.description}</p>
                </div>
              ))}
            </section>
          </div>

          <div style={{ zIndex: "1", width: "40%", paddingLeft: "20px" }} >

            <section className="mb-4">
              <h2  style={{ fontFamily: "Helvetica, sans-serif", fontWeight: "900", fontSize: "22px",  borderBottom: "4px solid black", paddingBottom: "5px", textTransform: "uppercase" }}>Objective</h2>
              <p className="small text-muted">
                <p style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "16px" }}>
                  Experienced professional with expertise in {professionalData.skills.join(' and ')}.
                  Currently located in {personalData.currentLocation} and seeking opportunities in {personalData.preferredWorkLocation}.
                </p>
              </p>
            </section>

            <section className="mb-4" style={{ fontSize: "16px" }}>
              <h2  style={{ fontFamily: "Helvetica, sans-serif", fontWeight: "900", fontSize: "22px",  borderBottom: "4px solid black", paddingBottom: "5px", textTransform: "uppercase" }}>
                Education
              </h2>
              {academicData[0] && (
                <div style={{ fontSize: "19px" }}>
                  <span
                    style={{
                      fontFamily: "Gill Sans, sans-serif",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {academicData[0].level}, {new Date(academicData[0].startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} -{" "}
                    {new Date(academicData[0].endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                  <br />
                  <span
                    className="small"
                    style={{ fontFamily: "Gill Sans, sans-serif", color:"#fc6b03", fontSize: "14px" }}
                  >
                    {academicData[0].school}
                  </span>
                  <br />
                  <span
                    className="small text-muted"
                    style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "14px" }}
                  >
                    GPA: {academicData[0].grade}
                  </span>
                  <br />
                  <br />
                </div>
              )}
            </section>


            <section className="mb-4">
              <h2  style={{ fontFamily: "Helvetica, sans-serif", fontWeight: "900", fontSize: "22px",  borderBottom: "4px solid black", paddingBottom: "5px", textTransform: "uppercase" }}>Skills</h2>
              <div className="gap-2" style={{ marginLeft: "10px", fontSize: "19px" }}>
                {professionalData.skills.map((skill, index) => (
                  <div key={index} className="small text-muted" style={{ fontFamily: "Gill Sans, sans-serif", fontSize: "14px" }}>
                    •  {skill} <br />
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpResume01;