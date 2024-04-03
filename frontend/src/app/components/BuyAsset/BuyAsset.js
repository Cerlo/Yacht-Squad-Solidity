import React, { useState, useEffect } from 'react';
import { prepareWriteContract, writeContract, watchContractEvent } from '@wagmi/core';
import { yachtContractHolderABI, yachtContractHolderAddress, yachtMarketPlaceABI, yachtMarketPlaceAddress } from '@/app/constants';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';

/**
 * @title BuyAsset Component
 * @notice Component for buying yacht assets on the blockchain.
 * Provides interface for users to specify quantity and initiate purchase transactions.
 * @dev This component interacts with yacht tokenization and marketplace contracts
 * to facilitate the purchase process depending on the yacht's current sale phase.
 */
const BuyAsset = ({ data, onClose }) => {
  
  // State and context hooks initialization
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { connectedAddress } = useAuth();
  const { showToast } = useToast();
  const statusOptions = ["Initial Mint", "PreSale", "Public Sale", "Chartered", "Maintenance", "Sold"];
  const [buyHash, setBuyHash] = useState(null);

  /**
   * @notice Checks if the yacht is available for purchase in the initial sale phases.
   * @return {boolean} True if yacht is in "Initial Mint", "PreSale", or "Public Sale" phase.
   */
  const isYachtAvailableForInitialPurchase = () => {
    return ["Initial Mint", "PreSale", "Public Sale"].includes(statusOptions[data.status])
  }

  const contractAddress = isYachtAvailableForInitialPurchase() ? yachtContractHolderAddress : yachtMarketPlaceAddress;
  const contractABI = isYachtAvailableForInitialPurchase() ? yachtContractHolderABI : yachtMarketPlaceABI;


  /**
   * @notice Initiates the token purchase transaction.
   * Validates quantity, prepares and executes the transaction based on yacht's sale phase.
   */
  const handleBuy = async () => {
    if (quantity < 1 || quantity > 1000) {
      alert("Please enter a valid quantity (1-1000)");
      return;
    }

    setIsProcessing(true);
    const functionName = isYachtAvailableForInitialPurchase() ? "transferToken" : "buyToken"; // buytoken must be implement later from SMmarketplace

    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: contractABI,
        functionName: functionName,
        args: [connectedAddress, data.id, quantity],
      });

      const { hash } = await writeContract(request);
      setBuyHash(hash);

    } catch (error) {
      console.error("Transaction failed", error);
      showToast('error', 'Transaction Failed', 'There was a problem with the transaction.');
      setIsProcessing(false);
    }
  };

/**
   * @notice Monitors the blockchain for completion of the buy transaction.
   * @dev Watches for a contract event corresponding to the successful token purchase.
   * Displays success notification and closes the buy interface upon transaction completion.
   */
  useEffect(() => {
    if (buyHash) {
      console.log(buyHash)
      const functionName = isYachtAvailableForInitialPurchase() ? "TokenTransfered" : ""; // event

      const unwatch = watchContractEvent({
        address: contractAddress,
        abi: contractABI,
        eventName: functionName,
      }, (event) => {
        console.log(event[0].args);
        showToast('success', `Purchase Successful`, `You have successfully purchased ${quantity} tokens of ${data.name}.`);
        setIsProcessing(false);
        onClose();
      }
      );

      return () => unwatch();
    }
  }, [buyHash, showToast]);

  return (
    <div className="p-4 bg-lessDark rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gold">Buy {data.name}</h3>

      <div className="mb-4 text-white">
        <p>Token price: {data.tokenPrice.toString()} ETH</p>
        <p>Supply Totale: {data.maxSupply.toString()}</p>
        <p>Remaining Supply: comming soon</p> 
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
        <div className="flex justify-between items-end mt-4"> 
          <p><span className="loading loading-spinner text-success"></span> Pending transaction

          </p>
          <button
            className="btn btn-outline btn-error rounded-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-end mt-4"> 
          <button
            className="rounded-none btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold"
            onClick={handleBuy}
            disabled={isProcessing}
          >
            Purchase
          </button>

          <button
            className="btn btn-outline btn-error rounded-none"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      )}
    </div>

  );
};

export default BuyAsset;
