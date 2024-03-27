import React, { useState } from 'react';

const MintYachtForm = () => {


  const [formData, setFormData] = useState({
    name: '',
    mmsi: '',
    tokenPrice: '',
    maxSupply: '',
    legal: '',
    paymentWallet: '',
    imagePreview: null,
    imageName: '', // Pour stocker le nom de l'image sélectionnée
  });

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

  const handleRemoveImage = () => {
    setFormData((prevState) => ({
      ...prevState,
      imagePreview: null,
      imageName: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data to mint:', formData);
    alert('Yacht data submitted. Implement minting logic here.');
  };


  return (
    <div className="flex justify-center items-center my-4">
      <div className="card card-bordered bg-lessDark w-full md:w-1/2 max-w-600px flex flex-col md:flex-row rounded-none">

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
              <div className="flex items-center">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="input input-bordered hidden"
                />
                <label htmlFor="image" className="btn cursor-pointer bg-gold text-lessDark border border-gold hover:bg-dark hover:text-gold hover:border-gold">Select Image</label>
                {formData.imageName && (
                  <div className="ml-4 text-sm text-gold flex items-center">
                    {formData.imageName}
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
