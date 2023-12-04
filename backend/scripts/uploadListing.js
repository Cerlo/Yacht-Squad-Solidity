/**
 * Import modules
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');

// Initialize Pinata SDK with the API credentials
const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);

// Define the path to the assets folder
const assetsFolderPath = path.join(__dirname, '../assets');

// Upload fils to Pinata and return IPFS hash
async function uploadFile(filePath, options) {
    const readableStreamForFile = fs.createReadStream(filePath);
    return pinata.pinFileToIPFS(readableStreamForFile, options);
}

// JSON upload to Pinata and return IPFS hash
async function uploadJSON(body, options) {
    return pinata.pinJSONToIPFS(body, options);
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
                    console.log(`JSON uploaded: ${jsonResult.IpfsHash}`);
                }
            }
        }
    } catch (error) {
        console.error('Error uploading assets:', error);
    }
}

uploadAssets();
