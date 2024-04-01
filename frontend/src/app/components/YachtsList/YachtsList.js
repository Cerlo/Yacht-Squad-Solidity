'use client'
import React, { useState } from 'react';
import ManageStatus from '@/app/components/ManageStatus/ManageStatus';

const YachtsListWithCollapse = ({ yacht, yachtIndex,onSave }) => {

    const [openCollapseIndex, setOpenCollapseIndex] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(yacht.status);

    const handleCollapseClick = (yachtIndex) => {
        setOpenCollapseIndex(openCollapseIndex === yachtIndex ? null : yachtIndex);
    };

    
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
