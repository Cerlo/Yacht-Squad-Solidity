'use client'
import React, { useState } from 'react';

const Card = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Remplacer le préfixe IPFS par un lien HTTP
  const ipfsImageUrl = data.uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="flex justify-center items-center my-4">
    <div className="card card-bordered bg-lessDark w-1/2 max-w-600px flex flex-row rounded-none h-auto md:h-96">
      {/* Image à gauche */}
      <figure className="flex-1 cursor-pointer  transition-transform ">
        <img
          className="object-cover w-full h-full hover:scale-105 overflow-hidden duration-300"
          src={ipfsImageUrl}
          alt={data.name}
        />
      </figure>

      {/* Contenu de la carte à droite */}
      <div className="card-body flex-1 flex flex-col justify-between">
        <div>
          <h2 className="card-title text-gold">{data.name}</h2>
          <p>
            MMSI: {data.mmsi.toString()}<br />
            Prix du Token: {data.tokenPrice.toString()}<br />
            Max Supply: {data.maxSupply.toString()}<br />
            Wallet de Paiement: {data.paymentWallet}<br />
            Status: {data.status}
          </p>
        </div>
        <div className="card-actions justify-center">
          <button className="rounded-none btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold" onClick={openModal}>
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
  </div>
  );
};

export default Card;
