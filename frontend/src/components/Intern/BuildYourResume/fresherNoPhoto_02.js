import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkedAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FresherNoPhoto_02 = ({ resumeData }) => {
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
        style={{ width: '210mm', height: '297mm', color: '#333', padding: '25mm 18mm' }}
      >
        {/* Header */}
        <header className="mb-4" style={{ padding: "10px 30px", display: "flex", justifyContent: "space-between", width: "100%" }}>
          <section style={{ paddingTop: "30px", paddingLeft: "15px" }}>
            <h1 style={{ fontWeight: "600", fontFamily: "Arial Narrow, sans-serif", fontSize: "25px", textTransform: "uppercase" }}>
              {personalData.firstname} <br />
              {personalData.lastName}
            </h1>
            <p className="text-uppercase text-muted small">{resumeData.personalData.profileTitle}</p>
          </section>
          <section className="mb-4" style={{ paddingRight: "80px", paddingTop: "30px" }}>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2"><FontAwesomeIcon icon={faPhone} /> +91 {personalData.phone}</li>
              <li className="mb-2"><FontAwesomeIcon icon={faEnvelope} />  {personalData.email}</li>
              <li className="mb-2"><FontAwesomeIcon icon={faMapMarkedAlt} /> {personalData.currentLocation}</li>
              <li>{personalData.website}</li>
            </ul>
          </section>

        </header>

        <div className="row" style={{ padding: "0px 20px" }}>
          <div className="col-lg">
            <section className="mb-4">
              <h2 className="text-muted" style={{ fontFamily: "Arial Narrow, sans-serif", fontWeight: "900", fontSize: "19px", letterSpacing: "5px", textTransform: "uppercase", color: "#0c151a" }}>Profile</h2>
              <p className="small text-muted">
                <p style={{ fontFamily: "Optima, sans-serif", marginLeft: "30px", fontSize: "16px" }}>
                  Experienced professional with expertise in {professionalData.skills.join(' and ')}.
                  Currently located in {personalData.currentLocation} and seeking opportunities in {personalData.preferredWorkLocation}.
                </p>
              </p>
            </section>

            <section className="mb-4">
              <h2 className="text-muted" style={{ fontFamily: "Arial Narrow, sans-serif", fontWeight: "900", fontSize: "19px", letterSpacing: "5px", textTransform: "uppercase", color: "#0c151a" }}>Work Experience</h2>
              {professionalData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bolder">{exp.company}</span>
                    <span className="small">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="small fw-medium mb-2">{exp.role}</p>
                  <p className="text-muted" style={{ padding: "0 15px", fontSize: "19px", fontFamily: "Arial Narrow, sans-serif" }}>{exp.description}</p>
                </div>
              ))}
            </section>

          </div>

          {/* Right Column */}
          <div className="col-md" style={{ padding: "0px 20px" }}>
            <section className="mb-4">
              <h2 className="text-muted" style={{ fontFamily: "Arial Narrow, sans-serif", fontWeight: "900", fontSize: "19px", letterSpacing: "5px", textTransform: "uppercase", color: "#0c151a" }}>Education</h2>
              {academicData.map((edu, index) => (
                <div key={index} style={{ fontSize: "19px" }}>
                  <span className="small fw-bolder" style={{ fontFamily: "Arial Narrow, sans-serif" }}>
                    {edu.level}, {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span> <br />
                  <span className="small text-muted" style={{ fontFamily: "Arial Narrow, sans-serif" }}>{edu.school}</span> <br />
                  <span className="small text-muted" style={{ fontFamily: "Arial Narrow, sans-serif" }}>GPA: {edu.grade}</span> <br /> <br />
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-muted" style={{ fontFamily: "Arial Narrow, sans-serif", fontWeight: "900", fontSize: "19px", letterSpacing: "5px", textTransform: "uppercase", color: "#0c151a" }}>Skills</h2>
              <div className="gap-2" style={{ marginLeft: "10px", fontSize: "19px" }}>
                {professionalData.skills.map((skill, index) => (
                  <div key={index} className="small text-muted" style={{ fontFamily: "Arial Narrow, sans-serif" }}>
                    •  {skill} <br />
                  </div>
                ))}
              </div>
            </section>

            {professionalData.languages && <section className="mt-2">
              <h2 className="text-muted" style={{ fontFamily: "Arial Narrow, sans-serif", fontWeight: "900", fontSize: "19px", letterSpacing: "5px", textTransform: "uppercase", color: "#0c151a" }}>Languages</h2>
              <div className="gap-2" style={{ marginLeft: "10px", fontSize: "19px" }}>
                {professionalData.languages?.map((lang, index) => (
                  <div key={index} className="small text-muted" style={{ fontFamily: "Arial Narrow, sans-serif" }}>
                  •  {lang} <br />
                </div>
                ))}
              </div>
            </section>
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default FresherNoPhoto_02;