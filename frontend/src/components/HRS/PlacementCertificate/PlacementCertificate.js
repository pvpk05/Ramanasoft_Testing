import React, { useState } from "react";
import html2canvas from "html2canvas";
import logo from './logo.png'
import jsPDF from "jspdf";

const CertificateApp = () => {
    // State to store user inputs
    const [formData, setFormData] = useState({
        name: "",
        courseName: "",
        companyName: "",
        date: "",
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // // Generate PDF function
    // const generatePDF = () => {
    //     const certificate = document.getElementById("certificate");
    //     html2canvas(certificate, { scale: 2 }).then((canvas) => {
    //         const pdf = new jsPDF("landscape", "pt", "a4");
    //         const imgData = canvas.toDataURL("image/png");
    //         pdf.addImage(imgData, "PNG", 0, 0, 841.89, 595.28);
    //         pdf.save(`${formData.name}.pdf`);
    //     });
    // };

    // Generate PNG function
    const generatePNG = () => {
        const certificate = document.getElementById("certificate");
        html2canvas(certificate, { scale: 2 }).then((canvas) => {
            const link = document.createElement("a");
            link.download = `${formData.name}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    };

    const generatePDF = () => {
        const certificate = document.getElementById("certificate");

        // Use a higher scale for better resolution
        html2canvas(certificate, { scale: 4 }).then((canvas) => {
            const imgWidth = 841.89; // A4 width in points
            const imgData = canvas.toDataURL("image/png", 1.0); // Max quality image data    
            // Create PDF with jsPDF
            const pdf = new jsPDF("landscape", "pt", "a4");
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, 595.28);
            pdf.save(`${formData.name}.pdf`);
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };


    return (
        <div style={{ fontFamily: "serif", padding: "20px" }}>
            <div style={{ marginBottom: "20px", textAlign: "left" }}>

                <form style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginLeft: "35%", marginBottom: "30px" }}>
                    {/* Name Input */}
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}

                        />
                    </label>

                    {/* Course Name Input */}
                    <label>
                        Course Name:
                        <input
                            type="text"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleInputChange}
                            placeholder="Enter course name"
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                            required
                        />
                    </label>
                    {/* Company Name Input */}
                    <label>
                        Company Name:
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                            required
                        />
                    </label>
                    {/* Date Input */}
                    <label>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                            required
                        />
                    </label>
                </form>
            </div>

            {/* Certificate Section */}
            <div style={{ fontFamily: "sans-serif" }}>
                <div
                    id="certificate"
                    style={{
                        width: "880px",
                        height: "595px",
                        padding: "20px",
                        color: "white",
                        backgroundImage: `url(${require('./background.png')})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "#fff",
                        position: "relative",
                        margin: "auto",
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        // style={{
                        //   width: "400px",
                        //   marginTop:"300px",
                        //   margin:"0 auto",
                        // }}
                        style={{
                            width: "380px",
                            position: "absolute",
                            top: "17%",
                            left: "51%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                    <h1 style={{ width: "100%", fontSize: "29px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", textTransform: "uppercase", color: "#ead23e", top: "30%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)" }}>
                        Certificate of Appreciation
                    </h1>
                    <div
                        style={{
                            alignItems: "center",
                            width: "50%",
                            fontFamily: "Optima, sans-serif",
                            color: "#f0ecda",
                            fontStyle: "italic",
                            textAlign: "center",
                        }}
                    >
                        <h6
                            style={{
                                position: "absolute",
                                top: "47%",
                                paddingLeft: "26%",
                                fontSize: "17px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.name}
                        </h6>
                        <h6
                            style={{
                                position: "absolute",
                                top: "51.2%",
                                paddingLeft: "26%",
                                fontSize: "17px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.courseName}
                        </h6>
                        <h6
                            style={{
                                position: "absolute",
                                top: "62%",
                                paddingLeft: "26%",
                                textAlign: "center",
                                fontSize: "17px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.companyName}
                        </h6>
                        <h6
                            style={{
                                position: "absolute",
                                top: "84%",
                                paddingLeft: "68%",
                                fontSize: "15px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.date}
                        </h6>
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                    onClick={generatePNG}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                    }}
                >
                    Download Certificate
                </button>
            </div>
        </div>
    );
};

export default CertificateApp;


// import React, { useState } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const CertificateApp = () => {
//     // State to store user inputs
//     const [formData, setFormData] = useState({
//         name: "",
//         courseName: "",
//         companyName: "",
//         date: "",
//     });

//     // Handle form input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

// // Generate PDF function
// const generatePDF = () => {
//     const certificate = document.getElementById("certificate");
//     html2canvas(certificate, { scale: 2 }).then((canvas) => {
//         const pdf = new jsPDF("landscape", "pt", "a4");
//         const imgData = canvas.toDataURL("image/png");
//         pdf.addImage(imgData, "PNG", 0, 0, 841.89, 595.28);
//         pdf.save("certificate.pdf");
//     });
// };

//     return (
//         <div style={{ fontFamily:"serif", padding: "20px" }}>

//             <div style={{ marginBottom: "20px", textAlign: "left" }}>
//                 <h2>Certificate Details Form</h2>
//                 <form style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
//                     {/* Name Input */}
//                     <label>
//                         Name:
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             placeholder="Enter your name"
//                             style={{
//                                 width: "100%",
//                                 padding: "8px",
//                                 marginTop: "5px",
//                                 borderRadius: "4px",
//                                 border: "1px solid #ccc",
//                             }}
//                             required
//                         />
//                     </label>

//                     {/* Course Name Input */}
//                     <label>
//                         Course Name:
//                         <input
//                             type="text"
//                             name="courseName"
//                             value={formData.courseName}
//                             onChange={handleInputChange}
//                             placeholder="Enter course name"
//                             style={{
//                                 width: "100%",
//                                 padding: "8px",
//                                 marginTop: "5px",
//                                 borderRadius: "4px",
//                                 border: "1px solid #ccc",
//                             }}
//                             required
//                         />
//                     </label>
//                     {/* company Name Input */}
//                     <label>
//                         company Name:
//                         <input
//                             type="text"
//                             name="companyName"
//                             value={formData.companyName}
//                             onChange={handleInputChange}
//                             placeholder="Enter company name"
//                             style={{
//                                 width: "100%",
//                                 padding: "8px",
//                                 marginTop: "5px",
//                                 borderRadius: "4px",
//                                 border: "1px solid #ccc",
//                             }}
//                             required
//                         />
//                     </label>
//                     {/* Date Input */}
//                     <label>
//                         Date:
//                         <input
//                             type="date"
//                             name="date"
//                             value={formData.date}
//                             onChange={handleInputChange}
//                             style={{
//                                 width: "100%",
//                                 padding: "8px",
//                                 marginTop: "5px",
//                                 borderRadius: "4px",
//                                 border: "1px solid #ccc",
//                             }}
//                             required
//                         />
//                     </label>
//                 </form>
//             </div>

//             {/* Certificate Section */}
//             <div style={{fontFamily:"sans-serif"}}>

//                 <div
//                     id="certificate"
//                     style={{
//                         width: "880px",
//                         height: "595px",
//                         padding: "20px",
//                         color: "white",
//                         backgroundImage: `url(${require('./background.png')})`,
//                         backgroundSize: "cover",
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center",
//                         backgroundColor: "#fff",
//                         position: "relative",
//                         margin: "auto",
//                     }}
//                 >
// {/*
// <img
//     src={logo}
//     alt="Logo"
//     // style={{
//     //   width: "400px",
//     //   marginTop:"300px",
//     //   margin:"0 auto",
//     // }}
//     style={{
//         width: "380px",
//         position: "absolute",
//         top: "16%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//     }}
// />

// <h1 style={{ width: "100%", fontSize: "29px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", textTransform: "uppercase", color: "#ead23e", top: "30%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)" }}>
//     Certificate of Appreciation
// </h1>
//                     <p
//                         // style={{ fontSize: "20px", margin: "20px 0" }}
//                         style={{ width: "100%", fontSize: "21px",fontWeight:"400", top: "45%",textAlign: "center", left: "35%", position: "absolute", transform: "translate(-50%, -50%)" }}
//                     >
//                         This certificate is awarded to
//                     </p>
//                     <div className="d-flex">
//                     <h2
//                         style={{ width: "100%", fontSize: "20px",textAlign:"center", top: "51%", left: "23%", position: "absolute", transform: "translate(-50%, -50%)" }}
//                     >
//                         Mr/Ms
//                     </h2>
//                     <h2 style={{ fontSize: "20px",textAlign:"left", top: "51%", marginLeft: "35%", position: "absolute", transform: "translate(-50%, -50%)" }}>{formData.name}</h2>
//                     </div>
//                     <div className="d-flex">
//                     <h2
//                         style={{ width: "100%", fontSize: "20px",textAlign:"center", top: "56%", left: "21%", position: "absolute", transform: "translate(-50%, -50%)" }}
//                     >
//                         of
//                     </h2>
//                     <h2 style={{ width: "100%", fontSize: "20px",textAlign:"center", top: "56%", left: "29%", position: "absolute", transform: "translate(-50%, -50%)" }}>{formData.courseName}</h2>
//                     </div>
//                     <h2 style={{ width: "100%", fontSize: "20px",textAlign:"center", top: "61%", left: "49%", position: "absolute", transform: "translate(-50%, -50%)" }}>Department as token of appreciation on getting placed in </h2>
//                     <h2 style={{ width: "100%", fontSize: "20px",textAlign:"center", top: "56%", left: "29%", position: "absolute", transform: "translate(-50%, -50%)" }}>{formData.date}</h2>
//                     <h2 style={{ width: "100%", fontSize: "20px",textAlign:"center", top: "71%", left: "51%", position: "absolute", transform: "translate(-50%, -50%)" }}>Company, during Acadamic Year 2023-24 Placement Season.</h2>
//                     <div>
//                     <img
//                         src={sign}
//                         alt="Logo"
//                         style={{
//                             width: "80px",
//                             position: "absolute",
//                             bottom: "16%",
//                             left: "10%",
//                             transform: "translate(-50%, -50%)",
//                         }}
//                     />
//                     </div> */}
//                     <div style={{alignItems:"center", width:"50%",fontFamily:"Didot, serif", color :"#f0ecda", textAlign:"center"}}>
//                     <h6 style={{ position:"absolute", top:"47%", paddingLeft:"26%", fontSize:"17px", fontWeight:"bold"}}>{formData.name}</h6>
//                     <h6 style={{position:"absolute", top:"51.5%", paddingLeft:"26%", fontSize:"17px", fontWeight:"bold"}}>{formData.courseName}</h6>
//                     <h6 style={{position:"absolute", top:"62%", paddingLeft:"26%", textAlign:"center", fontSize:"17px", fontWeight:"bold"}}>{formData.companyName}</h6>
//                     <h6 style={{position:"absolute", top:"84%", paddingLeft:"67%", fontSize:"15px", fontWeight:"bold"}}>{formData.date}</h6>
//                     </div>
//                 </div>
//             </div>

//             {/* Download Button */}
// <div style={{ textAlign: "center", marginTop: "20px" }}>
//     <button
//         onClick={generatePDF}
//         style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             cursor: "pointer",
//             borderRadius: "5px",
//             backgroundColor: "#007BFF",
//             color: "#fff",
//             border: "none",
//         }}
//     >
//         Download Certificate
//     </button>
// </div>
//         </div>
//     );
// };

// export default CertificateApp;

