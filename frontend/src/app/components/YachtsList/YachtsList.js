'use client'
import React, { useState } from 'react';
import ManageStatus from '@/app/components/ManageStatus/ManageStatus';


/**
 * @notice Initializes the YachtsListWithCollapse component with yacht data and an onSave callback.
 * @param yacht The yacht object containing all relevant yacht information.
 * @param yachtIndex The index of the yacht in the list, used for handling unique collapse elements.
 * @param onSave Callback function to execute when a new status is saved for the yacht.
*/
const YachtsListWithCollapse = ({ yacht, yachtIndex, onSave }) => {

    const [openCollapseIndex, setOpenCollapseIndex] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(yacht.status);

    /**
     * @notice Toggles the collapse open state for a yacht.
     * @param yachtIndex The index of the yacht whose collapse state is to be toggled.
    */
    const handleCollapseClick = (yachtIndex) => {
        setOpenCollapseIndex(openCollapseIndex === yachtIndex ? null : yachtIndex);
    };

    /**
     * @notice Handles the saving of a new status for a yacht.
     * @param yachtId The ID of the yacht whose status is to be updated.
     * @param statusId The new status ID to be assigned to the yacht.
    */
    const handleSaveStatus = (yachtId, statusId) => {
        onSave(yachtId, statusId);
    };

    return (
        <div className={`collapse w-full md:w-1/2 max-w-600px bg-lessDark mb-4 rounded-none ${openCollapseIndex === yachtIndex ? 'border border-gold' : ''}`}>
            <input
                type="checkbox"
                checked={openCollapseIndex === yachtIndex}
                onChange={() => handleCollapseClick(yachtIndex)}
                className="peer"
                id={`collapse-checkbox-${yachtIndex}`}
                hidden
            />
            <label htmlFor={`collapse-checkbox-${yachtIndex}`} className="collapse-title flex justify-between items-center px-4 py-2 cursor-pointer text-gold border-b border-gold">
                <span>{yacht.name}</span>
                <svg className="fill-current h-4 w-4 transform transition-transform duration-500 peer-checked:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </label>
            <div className="collapse-content bg-lessDark text-white peer-checked:block hidden p-4">
                <ManageStatus yachtId={yacht.id} currentStatus={yacht.status} onSave={handleSaveStatus} />
            </div>
        </div>
    );
};

export default YachtsListWithCollapse;
