
"use client"
import './style.css';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { prepareWriteContract, writeContract, watchContractEvent } from '@wagmi/core';
import { yachtTokenizationABI, yachtTokenizationAddress, yachtContractHolderAddress } from '@/app/constants';
import { useToast } from '@/app/context/ToastContext';

/**
 * @title Mint Yacht Form Component
 * @dev Allows users to input details for minting a new yacht NFT, including yacht name, MMSI, token price, max supply, legal status, payment wallet, and an image.
 * Users can submit the form to initiate the minting process on the blockchain. The component listens for a minting event and displays a success message upon completion.
 */
const MintYachtForm = () => {

  const { address } = useAccount();

  const [formData, setFormData] = useState({
    name: '',
    mmsi: '',
    tokenPrice: '',
    maxSupply: '',
    legal: '',
    paymentWallet: '',
    imagePreview: null,
    imageName: '',
  });

  const [mintTxHash, setMintTxHash] = useState(null);
  const { showToast } = useToast();



  /**
   * @notice Handles input changes and updates form data state.
   * @param e The event triggered by input field changes.
   * @dev When the 'image' field is updated, it reads the file, converts it to a Data URL, and updates the form data state with the image preview and file name.
   * For other fields, it simply updates the corresponding value in the form data state.
 */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          imagePreview: reader.result,
          imageName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  /**
   * @notice Allows the user to remove the selected image.
   * @dev Sets the imagePreview and imageName in the form data state to null, effectively removing the selected image.
  */
  const handleRemoveImage = () => {
    setFormData((prevState) => ({
      ...prevState,
      imagePreview: null,
      imageName: '',
    }));
  };

  /**
   * @notice Submits the yacht minting form and initiates the minting process.
   * @param e The event triggered by form submission.
   * @dev Prepares and sends a minting transaction to the blockchain using the form data. On success, it updates the mintTxHash state with the transaction hash.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { request } = await prepareWriteContract({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        functionName: "mintyachts",
        args: [
          yachtContractHolderAddress,
          formData.mmsi,
          formData.tokenPrice,
          formData.maxSupply,
          formData.name,
          'ipfs://bafybeidlko2jbq7wifsc743akyg6w7yv5nhtryamfn7z27jjjksollqa7e',
          formData.legal,
          '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720'
        ]
      });
      const { hash } = await writeContract(request);
      setMintTxHash(hash);
    } catch (error) {
      showToast('Error', `Minted could not be performed`, `${error.message} `);

    }
  };



  /**
   * @notice Watches for the minting event and displays a success message upon detection.
   * @dev Uses the `watchContractEvent` function to listen for the 'NewMint' event from the yacht tokenization contract. Displays a toast message with the minting details on success.
  */
  useEffect(() => {
    if (mintTxHash) {
      const unwatch = watchContractEvent({
        address: yachtTokenizationAddress,
        abi: yachtTokenizationABI,
        eventName: 'NewMint',
      }, (event) => {
        const { transactionHash } = event[0];
        if (transactionHash === mintTxHash) {
          const { _tokenIds, _maxSupply, _yachtName } = event[0].args;
          console.log(`Minted done with hash : ${event[0].transactionHash}`);
          showToast('success', `Minted YachtID: ${_tokenIds}`, `${_yachtName} with Supply ${_maxSupply} has been minted with hash : ${event[0].transactionHash} `);
          setMintTxHash(null);
        }
      });
      return () => unwatch();
    }
  }, [mintTxHash, showToast]);


  return (
    <div className="flex justify-center items-center my-4">
      <div className="card card-bordered bg-lessDark w-full md:w-1/2 max-w-600px flex flex-col rounded-none">

        <div className="md:flex-1 bg-lessDark flex justify-center items-center text-white relative" style={{ minHeight: '200px' }}>
          {formData.imagePreview ? (
            <>
              <img
                className="object-cover h-full"
                src={formData.imagePreview}
                alt="Yacht Preview"
              />
              <span
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                style={{ fontSize: '24px' }}
              >
                &#10005;
              </span>
            </>
          ) : (
            <div className="text-center">
              <p>No Image Selected</p>
            </div>
          )}
        </div>
        <div className="card-body flex-1 p-4">
          <h2 className="card-title text-gold mb-4">Mint New Yacht</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="float-label">
              <input
                type="text"
                id="name"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
              <label htmlFor="name" className="text-gold">Yacht Name:</label>
            </div>

            <div className="float-label">
              <input
                type="text"
                name="mmsi"
                placeholder="MMSI"
                value={formData.mmsi}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
              <label htmlFor="mmsi" className="text-gold">MMSI:</label>
            </div>

            <div className="float-label">
              <input
                type="number"
                name="tokenPrice"
                placeholder=" "
                value={formData.tokenPrice}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
              <label htmlFor="tokenPrice" className="text-gold">Token Price:</label>
            </div>

            <div className="float-label">
              <input
                type="number"
                name="maxSupply"
                placeholder=" "
                value={formData.maxSupply}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
              <label htmlFor="maxSupply" className="text-gold">Max Supply:</label>
            </div>

            <div className="float-label">
              <input
                type="text"
                name="legal"
                placeholder=" "
                value={formData.legal}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
              <label htmlFor="legal" className="text-gold">Legal Status Hash:</label>
            </div>

            <div className="float-label">
              <input
                type="text"
                name="paymentWallet"
                placeholder=" "
                value={formData.paymentWallet}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
              <label htmlFor="paymentWallet" className="text-gold">Payment Wallet:</label>
            </div>

            <div>
              <label htmlFor="image" className="block mb-2 text-gold">Yacht Image:</label>
              <div className="flex flex-row items-center">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="input input-bordered hidden"
                />
                <label htmlFor="image" className="btn cursor-pointer bg-gold text-lessDark border border-gold hover:bg-dark hover:text-gold hover:border-gold my-2 sm:my-0 sm:mr-4">Select Image</label>
                {formData.imageName && (
                  <div className="text-sm text-gold flex items-center mt-2 sm:mt-0 w-full overflow-hidden">
                    <span className="truncate">{formData.imageName}</span>
                    <span onClick={handleRemoveImage} className="ml-2 text-red-500 cursor-pointer" style={{ fontSize: '24px' }}>&#10005;</span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="mt-4 rounded-none btn btn-primary border-dark bg-gold hover:bg-lessDark hover:text-gold hover:border-gold">
              Mint Yacht
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MintYachtForm;
