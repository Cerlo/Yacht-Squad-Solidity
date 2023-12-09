/**
 * Import modules
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');
const pinataSDK = require('@pinata/sdk');

// Initialize Pinata SDK with the API credentials
const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);

// Define the path to the assets folder
const assetsFolderPath = path.join(__dirname, '../assets');

/**
 * Contract address
 */
const yachtSquadTokenizationAddress = process.env.YACHTSQUADCONTRACTHOLDERADDRESS;
// Upload fils to Pinata and return IPFS hash
async function uploadFile(filePath, options) {
    const readableStreamForFile = fs.createReadStream(filePath);
    return pinata.pinFileToIPFS(readableStreamForFile, options);
}

// JSON upload to Pinata and return IPFS hash
async function uploadJSON(body, options) {
    return pinata.pinJSONToIPFS(body, options);
}

async function mintYacht(tokenURI, jsonData) {
    const [deployer] = await ethers.getSigners();
    console.log(deployer.address)
    const YachtSquadTokenization = await ethers.getContractFactory("YachtSquadTokenization");
    const yachtSquadTokenization = YachtSquadTokenization.attach(yachtSquadTokenizationAddress);

    // Replace with your mint function parameters
    const mintTx = await yachtSquadTokenization.mintyachts("0xC0626132e04da0a96544d4cF8e2fEF512b6F3829", jsonData.mmsi, jsonData.tokenPrice, jsonData.maxSupply, jsonData.name, tokenURI, jsonData.legal, jsonData.paymentWallet);
    const receipt = await mintTx.wait();
    //Get the NewMint event
    console.log(`NewMint has been send on wallet: ${receipt.to}`);
}

async function uploadAssets() {
    try {
        // Read all files in assets folder
        const files = fs.readdirSync(assetsFolderPath);

        // Iterate over each file in the folder
        for (const file of files) {
            if (file.endsWith('.png')) {

                // Construct the corresponding JSON filename
                const jsonFile = file.replace('.png', '.json');
                const jsonPath = path.join(assetsFolderPath, jsonFile);

                if (fs.existsSync(jsonPath)) {
                    // Construct the corresponding JSON filename
                    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                    const yachtName = jsonData.name; // Extract name from JSON data

                    // Set options for image upload
                    const imageOptions = {
                        pinataMetadata: { name: yachtName },
                        pinataOptions: { cidVersion: 1 }
                    };

                    // Upload the image file to Pinata
                    const imageResult = await uploadFile(path.join(assetsFolderPath, file), imageOptions);
                    console.log(`Image uploaded: ${imageResult.IpfsHash}`);

                    // Update JSON data with IPFS hash
                    jsonData.uri = `ipfs://${imageResult.IpfsHash}`; // Update the URI with the new IPFS hash
                    
                        // Set options for JSON upload
                    const jsonOptions = {
                        pinataMetadata: { name: yachtName },
                        pinataOptions: { cidVersion: 1 }
                    };
                    
                    // Upload JSON file to Pinata
                    const jsonResult = await uploadJSON(jsonData, jsonOptions);
                    // Mint the yacht with the JSON IPFS URI
                    await mintYacht(jsonData.uri, jsonData);
                    console.log(`JSON uploaded: ${jsonResult.IpfsHash}`);
                }
            }
        }
    } catch (error) {
        console.error('Error uploading assets:', error);
    }
}

uploadAssets();
