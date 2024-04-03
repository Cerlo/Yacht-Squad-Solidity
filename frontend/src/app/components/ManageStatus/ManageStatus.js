// ManageStatus.js
'use client'
import React, { useState } from 'react';

/**
 * @title Manage Status Component
 * @notice This component allows for the status of a yacht to be managed and updated.
 * It displays the available status options and lets the user select a new status.
 * @dev The component displays a set of status options that can be clicked to select a new status.
 * The currently selected status is highlighted, and the original status of the yacht is underlined.
 * On clicking the 'Save Status' button, the selected status is saved using the provided `onSave` callback function.
 * @param {number} yachtId - The unique identifier of the yacht whose status is being managed.
 * @param {number} currentStatus - The current status index of the yacht.
 * @param {function} onSave - A callback function that is called when the 'Save Status' button is clicked, with the `yachtId` and the new `selectedStatus` as arguments.
*/
const ManageStatus = ({ yachtId, currentStatus, onSave }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const statusOptions = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];

  /**
   * @notice Handles the click event on a status option.
   * @dev Sets the selected status to the index of the clicked status option.
   * @param {number} statusIndex - The index of the clicked status option in the `statusOptions` array.
  */
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
      <button className="btn btn-outline btn-success rounded-none" onClick={() => onSave(yachtId, selectedStatus)}
      >        Save Status
      </button>

    </div>
  );
};

export default ManageStatus;
