'use client'
import React, { useState } from 'react';

const YachtsListWithCollapse = ({ yacht, index }) => {
  const [openCollapseIndex, setOpenCollapseIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(yacht.status);

  const statusOptions = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];

  const handleCollapseClick = (index) => {
    setOpenCollapseIndex(openCollapseIndex === index ? null : index);
  };

  const handleStatusClick = (statusIndex) => {
    setSelectedStatus(statusIndex);
  };

  const handleSaveClick = () => {
    console.log(`Saving for Yacht ID: ${yacht.id}, Status ID: ${selectedStatus}`);
    // Ici vous ajouterez la logique pour sauvegarder le statut dans la blockchain ou votre backend
  };

  return (
    <div className={`collapse w-full md:w-1/2 max-w-600px bg-lessDark mb-4 rounded-none ${openCollapseIndex === index ? 'border border-gold' : ''}`}>
      <input
        type="checkbox"
        checked={openCollapseIndex === index}
        onChange={() => handleCollapseClick(index)}
        className="peer"
        id={`collapse-checkbox-${index}`}
        hidden
      />
      <label htmlFor={`collapse-checkbox-${index}`} className="collapse-title flex justify-between items-center px-4 py-2 cursor-pointer text-gold border-b border-gold">
        <span>{yacht.name}</span>
        <svg className="fill-current h-4 w-4 transform transition-transform duration-500 peer-checked:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
      </label>
      <div className="collapse-content bg-lessDark text-white peer-checked:block hidden p-4">
        <div className="flex flex-wrap justify-start items-center gap-2 mb-4">
          {statusOptions.map((status, statusIndex) => (
            <span
              key={statusIndex}
              className={`cursor-pointer px-4 py-2 rounded  ${selectedStatus === statusIndex ? 'text-gold border-gold bg-dark border' : ' text-gold border-gold'} ${statusIndex === yacht.status ? 'underline' : ''}`}
              onClick={() => handleStatusClick(statusIndex)}
            >
              {status}
            </span>
          ))}
        </div>
        <button
          className="rounded-none btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold"
          onClick={handleSaveClick}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default YachtsListWithCollapse;
