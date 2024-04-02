// BuyAsset.js
import React, { useState } from 'react';

const BuyAsset = ({ data, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);


  /**
   * @Dev must implement buy logic here
   * 
   */
  const handleBuy = async () => {
    if (quantity < 1 || quantity > 1000) {
      alert("Please enter a valid quantity (1-1000)");
      return;
    }

    setIsProcessing(true);

    try {
      console.log(`Buying ${quantity} of ${data.name}`);

      setTransactionStatus('success');
      setIsProcessing(false);

      onClose();
    } catch (error) {
      console.error("Transaction failed", error);
      setTransactionStatus('error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 bg-lessDark rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4 text-gold">Buy {data.name}</h3>
  
    <div className="mb-4 text-white">
      <p>Token price: {data.tokenPrice.toString()} ETH</p>
      <p>Supply Totale: {data.maxSupply.toString()}</p>
      <p>Remaining Supply: comming soon</p> {/* later */}
    </div>
  
    <div className="mb-4">
      <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gold">Token quandtitty</label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        min="1"
        max="1000"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="input input-bordered w-full bg-dark text-gold"
      />
    </div>
  
    {isProcessing ? (
      <p>Pending transaction...</p>
    ) : (
      <>
        <button
          className="rounded-none btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold"
          onClick={handleBuy}
          disabled={isProcessing}
        >
          Purchase
        </button>
        {transactionStatus === 'error' && <p className="mt-2 text-red-500">Transaction has been refused</p>}
      </>
    )}
  </div>
  
  );
};

export default BuyAsset;
