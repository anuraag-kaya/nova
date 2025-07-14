"use client";
import React from 'react';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../globals.css'; // Import the CSS file for styling

export default function TestCasesList({ testCases, onRowClick }) {
  const [selectedRowId, setSelectedRowId] = useState(null); // Fixed initialization

  const handleRadioChange = (row) => {
    setSelectedRowId(row.testcase_id);
    onRowClick(row);
  };

  const columns = [
    { field: 'select', headerName: '', width: 60, renderCell: (params) => (
      <input
        type="radio"
        checked={params.row.testcase_id === selectedRowId}
        onChange={() => {
          handleRadioChange(params.row);
        }}
      />
    )},
    { field: 'testcase_id', headerName: 'Test Case ID', width: 100 },
    {
      field: 'testcase_title',
      headerName: 'Test Case Name',
      flex: 1,
      minWidth: 250,
    },
  ];

  return (
    <DataGrid
      rows={testCases}
      columns={columns}
      getRowId={(row) => row.testcase_id}
      autoHeight
      pagination
      disableRowSelectionOnClick
      rowHeight={40}
      pageSizeOptions={[5, 10, 25, 100]}
      onRowClick={(params) => {
        // Sync row click with radio selection
        setSelectedRowId(params.row.testcase_id);
        onRowClick(params.row);
      }}
      getRowClassName={(params) =>
        params.row.testcase_id === selectedRowId ? 'selected-row' : ''
      }
      sx={{
        border: 'none',
        fontSize: '14px',
      }}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
    />
  );
}