// ManageStatus.js
'use client'
import React, { useState } from 'react';

const ManageStatus = ({ yachtId, currentStatus, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const statusOptions = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];

  const handleStatusClick = (statusIndex) => {
    setSelectedStatus(statusIndex);
  };

  return (
    <div className="flex justify-between items-center gap-2 mb-4">
      <div className="flex flex-wrap justify-start items-center gap-2">
        {statusOptions.map((status, statusIndex) => (
          <span
            key={statusIndex}
            className={`cursor-pointer px-4 py-2 rounded ${selectedStatus === statusIndex ? 'text-dark bg-gold' : 'bg-dark text-gold'} ${statusIndex === currentStatus ? 'underline' : ''}`}
            onClick={() => handleStatusClick(statusIndex)}
          >
            {status}
          </span>
        ))}
      </div>
      <button className="btn btn-outline btn-success rounded-none" onClick={() => onSave(yachtId,selectedStatus)}
      >        Save Status
      </button>
      
    </div>
  );
};

export default ManageStatus;
