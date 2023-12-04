const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {constants,  } = require('@openzeppelin/test-helpers');// Common constants, like the zero address and largest integers
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("YachtSquadTokenHolder contract", function () {
    const status ={
        IntialMint:0,     // The yacht is listed and available for sale
        PreSale:1,        // Sale for holders of at least one SFT of yacht
        PublicSale:2,     // Public sale open to new investors
        Chartered:3,      // The yacht is currently chartered
        Maintenance:4,    // The yacht is under maintenance
        Sold:5            // The yacht has been sold
    }
    const yacht0= {
        id:0,
        mmsi:319113100, //mmsi/AIS => yacht identification
        tokenPrice:2000, 
        maxSupply:100000,
        name: 'Black Pearl',
        uri: 'cb8480dedb3a9f7fbb1d5707e228d80c119fc57184651bdecfdb1cef9c0dc899', // string : Image du boat
        legal: '07762f76dfdbb1597218313ea27680c28bac238600230cc7a20c7e2cd9de4d73', //Black Pearl is owned by YachtSquad 
        paymentWallet:"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        status : status.IntialMint
    }

    async function deployContracts() {
        const [owner, investor, yachtCharterCompany] = await ethers.getSigners();

        // Deploy YachtSquadTokenization contract
        const YachtSquadTokenization = await ethers.getContractFactory("YachtSquadTokenization");
        const yachtSquadTokenization = await YachtSquadTokenization.deploy(YachtSquadTokenization);
        // Deploy YachtSquadTokenHolder contract with the address of YachtSquadTokenization
        const YachtSquadTokenHolder = await ethers.getContractFactory("YachtSquadTokenHolder");
        const yachtSquadTokenHolder = await YachtSquadTokenHolder.deploy(yachtSquadTokenization.target);

        return { yachtSquadTokenHolder, yachtSquadTokenization, owner, investor, yachtCharterCompany };
    }
    
    describe("Token Reception", function () {
        it("Should handle receiving a single token correctly", async function () {
            const { yachtSquadTokenHolder, yachtSquadTokenization, owner, yachtCharterCompany } = await loadFixture(deployContracts);
            await yachtSquadTokenization.connect(owner).mintyachts(
                yachtSquadTokenHolder.target, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address
            );
            const tokenInfo = await yachtSquadTokenHolder.getTokenInfo(0); // Assuming the first minted token has ID 0
            expect(tokenInfo.amount).to.equal(yacht0.maxSupply);
            expect(tokenInfo.sender).to.equal(constants.ZERO_ADDRESS); // The initial mint must be from ZERO_ADDRESS
        });
    }); // token reception

    describe("Token Transfer", function () {
        it("Should transfer a token correctly", async function () {
            const { yachtSquadTokenHolder, yachtSquadTokenization, owner, investor,yachtCharterCompany } = await loadFixture(deployContracts);
    
            // Mint a yacht to the token holder
            const tokenId = 0;
            const amount = 100;
            await yachtSquadTokenization.connect(owner).mintyachts(
                yachtSquadTokenHolder.target, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address
            );
    
            //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (owner)   ----- 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 (yachtSquadTokenHolder)
            await yachtSquadTokenHolder.connect(owner).setYachtSquadTokenisationContract(investor.address);
            await yachtSquadTokenHolder.connect(investor).transferToken(investor.address, tokenId, amount);
    
            // Check balances
            const balanceHolder = await yachtSquadTokenization.balanceOf(yachtSquadTokenHolder.target, tokenId);
            const balanceInvestor = await yachtSquadTokenization.balanceOf(investor.address, tokenId);
    
            expect(balanceHolder).to.equal(yacht0.maxSupply-amount);
            expect(balanceInvestor).to.equal(amount);
        });
    }); // end token transfert

});