import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiService from '../../../apiService';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FaStopCircle, FaBan } from 'react-icons/fa';


const isIntern = (id) => id.startsWith("RS");


const InternsTable = ({ currentData, handleToggleBlock }) => {

    const isIntern = (id) => id.startsWith("RS");
    
    const columnDefs = [
        {
            headerName: 'ID',
            field: 'id',
            minWidth: 50,
            maxWidth: 100,
            sortable: true,
            filter: true,
            valueGetter: params =>
                isIntern(params.data.candidateID || params.data.guestID)
                    ? params.data.candidateID
                    : params.data.guestID,
        },
        {
            headerName: 'Full Name',
            field: 'fullName',
            sortable: true,
            filter: true,
            minWidth: 150,
            maxWidth: 250,
            cellRenderer: params => {
                const id = params.data.candidateID || params.data.guestID;
                const linkPath = `/sa_dash/student/${id}`;
                return (
                    <Link
                        to={linkPath}
                        style={{ textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        {params.value}
                    </Link>
                );
            },
        },
        { headerName: 'Domain', field: 'domain', sortable: true, filter: true, width:200 },
        { headerName: 'Batch No', field: 'batchNo', sortable: true, filter: true, minWidth: 50, maxWidth: 100, valueGetter : params => params.data.batchNo || params.data.batchno },

        { headerName: 'Email', field: 'email', sortable: true, filter: true },



        {
            headerName: 'Mobile No',
            field: 'MobileNo',
            sortable: true,
            filter: true,
            valueGetter: params =>
                params.data.mobileNo || params.data.mobileno
        },

        {
            headerName: 'Action',
            field: 'action',
            minWidth: 50,
            maxWidth: 100,
            cellRenderer: params => (
                <button
                    onClick={() => handleToggleBlock(params.data)}
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: params.data.blockProfile ? "red" : "black",
                    }}
                >
                    {params.data.blockProfile ? (
                        <FaStopCircle style={{ width: "16px", color: "green" }} title="Unblock" />
                    ) : (
                        <FaBan style={{ width: "16px", color: "red" }} title="Block" />
                    )}
                </button>
            ),
        },
    ];

    const defaultColDef = {
        resizable: true,
        flex: 1,
        sortable: true,
        filter: true,
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <AgGridReact
                rowData={currentData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
            />
        </div>
    );
};

const BlockedData = () => {
    const [currentData, setCurrentData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.get('/api/blocked_data');
                const combinedData = [
                    ...response.data.internData.map(intern => ({
                        ...intern,
                        candidateID: intern.candidateID,

                    })),
                    ...response.data.guestData.map(guest => ({
                        ...guest,
                        guestID: guest.guestID, // Guest ID
                    })),
                ];
                setCurrentData(combinedData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const handleToggleBlock = async (data) => {
        try {
            const updatedStatus = !data.blockProfile;
            const endpoint = isIntern(data.candidateID || data.guestID)
                ? `/api/toggle_block_intern/${data.candidateID}`
                : `/api/toggle_block_guest/${data.guestID}`;
            await apiService.post(endpoint, { blockProfile: updatedStatus });
            toast.success("Unblocked Successfully");
            setCurrentData(prev =>
                prev.map(item =>
                    (item.candidateID || item.guestID) === (data.candidateID || data.guestID)
                        ? { ...item, blockProfile: updatedStatus }
                        : item
                )
            );
        } catch (error) {
            console.error("Error toggling block status: ", error);
        }
    };

    return (
        <InternsTable currentData={currentData} handleToggleBlock={handleToggleBlock} />
    );
};

export default BlockedData;

