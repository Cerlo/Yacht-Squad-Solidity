require('dotenv').config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(key, secret);
const fs = require('fs');
const readableStreamForFile = fs.createReadStream("mvp/yachtSquad-listing0.png");

const options = {
    pinataMetadata: {
        name: "Genesisyach-test",
    },
    pinataOptions: {
        cidVersion: 1
    }
};


pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
    const body = {
        name : options.pinataMetadata.name,//YachtName
        image : result.IpfsHash,//CID image
        mmsi : "227999700", //mmsi/AIS
        imo : "",//pas pour la plaisance
        legal : "",//hashcontract
        sn : "",//SerialNumber
        paymentWallet : ""//Dividende payment wallet
    };

    pinata.pinJSONToIPFS(body, options).then((json) => {
        console.log(json);
    }).catch((err) => {
        console.log(err);
    });

}).catch((err) => {
    console.log(err);
});
