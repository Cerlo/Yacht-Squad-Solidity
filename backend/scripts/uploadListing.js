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
                // Set options for image upload
                const imageOptions = {
                    pinataMetadata: { name: path.basename(file, '.png') },
                    pinataOptions: { cidVersion: 1 }
                };

                // Upload the image file to Pinata
                const imageResult = await uploadFile(path.join(assetsFolderPath, file), imageOptions);
                console.log(`Image uploaded: ${imageResult.IpfsHash}`);

                // Construct the corresponding JSON filename
                const jsonFile = file.replace('.png', '.json');
                const jsonPath = path.join(assetsFolderPath, jsonFile);

                // JSON?
                if (fs.existsSync(jsonPath)) {
                    // Read and parse the JSON file
                    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                    // Update JSON data with IPFS hash
                    jsonData.image = imageResult.IpfsHash;

                    // Set options for JSON upload
                    const jsonOptions = {
                        pinataMetadata: { name: path.basename(jsonFile, '.json') },
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
