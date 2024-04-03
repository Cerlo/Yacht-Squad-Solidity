'use client'
import React, { useState } from 'react';
import BuyAsset from '@/app/components/BuyAsset/BuyAsset'

/**
 * @title Card Component
 * @notice This component displays individual yacht details and handles the purchase interaction.
 * It allows users to view yacht details and initiate a purchase through a modal dialog.
 * @dev The component converts IPFS links to HTTP for image display and formats various yacht details for presentation.
 * It conditionally disables the 'Buy' button based on the `isBuyable` prop which is determined by the yacht's status and user's connection state.
 * @param {Object} data - The yacht data object containing details like name, MMSI, token price, etc.
 * @param {boolean} isBuyable - Determines if the yacht is currently buyable based on its status and user's connection state.
 */
const Card = ({ data , isBuyable}) => {
  const [isOpen, setIsOpen] = useState(false); 
  const statusText = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];
  // replace IPFS by HTTP
  const ipfsImageUrl = data.uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const formatAddress = (address) => address ? `${address.substring(0, 4)}…${address.substring(address.length - 4)}` : '';

  const formatdata = (data) => data ? `${data.substring(0, 4)}…${data.substring(data.length - 4)}` : '';
  // Format price 100 000 instead of 100000
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Total price
  const totalPrice = BigInt(data.tokenPrice) * BigInt(data.maxSupply);
  const formattedTotalPrice = formatPrice(totalPrice);

  const getStatusText = (status) => {
    const statusText = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];
    return statusText[status] || "Unknown";
  };


  return (
    <div className="flex justify-center items-center my-4">
      <div className="card card-bordered bg-lessDark w-full md:w-1/2 max-w-600px flex flex-col lg:flex-row rounded-none h-auto lg:h-96">


        <figure className="w-full lg:flex-1 cursor-pointer transition-transform">
          <img
            className="object-cover w-full h-48 lg:h-full hover:scale-105 overflow-hidden duration-300"
            src={ipfsImageUrl}
            alt={data.name}
          />
        </figure>

        <div className="card-body flex-1 flex flex-col justify-between break-words p-4">
          <div>
            <h2 className="card-title text-gold">{data.name}</h2>
            <p >
              MMSI: {data.mmsi.toString()}<br />
              Prix du Token: {data.tokenPrice.toString()}<br />
              Max Supply: {data.maxSupply.toString()}<br />
              Legal status hash : {formatdata(data.legal)}<br />
              Wallet de Paiement: {formatAddress(data.paymentWallet)}<br />
              Status: {getStatusText(data.status)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gold text-lg font-semibold">
              Total Price {formattedTotalPrice} $
            </p>
            <div className="card-actions">
              <button className="rounded-none btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold" disabled={!isBuyable} onClick={openModal}>
                Buy {data.name}
              </button>
            </div>
          </div>
        </div>


        {isOpen && (
          <div className="modal modal-open  border-gold">
            <div className="modal-box bg-dark">
              <BuyAsset data={data} onClose={closeModal}  />
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Card;
