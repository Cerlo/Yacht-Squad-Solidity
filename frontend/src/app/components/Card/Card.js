// src/app/components/Card.js
'use client'
import React, { useState } from 'react';

const Card = ({ data }) => {
  const ipfsImageUrl = `https://ipfs.io/ipfs/${data.uri}`;
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="card card-bordered bg-lessDark w-full max-w-600px flex flex-row">
      {/* Image à gauche */}
      <figure className="flex-1 cursor-pointer" onClick={openModal}>
        <img
          className="object-cover w-full h-full"
          src={ipfsImageUrl}
          alt={data.name}
        />
      </figure>

      {/* Contenu de la carte à droite */}
      <div className="card-body flex-1">
        <h2 className="card-title text-gold">{data.name}</h2>
        <p>
          MMSI: {data.mmsi}<br />
          Prix du Token: {data.tokenPrice}<br />
          Max Supply: {data.maxSupply}<br />
          Wallet de Paiement: {data.paymentWallet}<br />
          Status: {data.status}
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold" onClick={openModal}>
            Buy {data.name}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <img src={ipfsImageUrl} alt={data.name} />
            <div className="modal-action">
              <button onClick={closeModal} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
