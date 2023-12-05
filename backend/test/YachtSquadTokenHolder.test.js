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
        uri: 'bafkreiabh7oeweksbqznghhapoc5ekgmsjr64ia3bhors3ws3rzuyybjny', // string : Image du boat
        legal: '07762f76dfdbb1597218313ea27680c28bac238600230cc7a20c7e2cd9de4d73', //Black Pearl is owned by YachtSquad 
        paymentWallet:"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        status : status.IntialMint
    }
    
    const yacht1= {
        id:1,
        mmsi:319085900, //mmsi/AIS => yacht identification
        tokenPrice:1000, 
        maxSupply:100000,
        name: 'Aquijo',
        uri:'bafkreihcta63ik4fe5cuttvdjx4smtp5acd5qzv4joypeg7nb7ggasxipq',
        legal: 'a899fc0d56ef54e9a2a9e7b8ef16e79f4ca11a56d86d79f6366d14b0c3c690aa', //Aquijo is owned by YachtSquad
        paymentWallet:"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        status : status.PreSale
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
        it("Should handle receiving multiple tokens correctly", async function () {
            const { yachtSquadTokenHolder, yachtSquadTokenization, owner, investor, yachtCharterCompany } = await loadFixture(deployContracts);
            // Mint two yachts to the token holder
            const tokenIds = [0,1];
            const amounts = [10000,5000];
            // Mint each yacht to the token holder
            await yachtSquadTokenization.connect(owner).mintyachts(
                yachtSquadTokenHolder.target, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply, // Use the corresponding amount for each yacht
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address
            );
            await yachtSquadTokenization.connect(owner).mintyachts(
                yachtSquadTokenHolder.target, 
                yacht1.mmsi, 
                yacht1.tokenPrice,
                yacht1.maxSupply, // Use the corresponding amount for each yacht
                yacht1.name, 
                yacht1.uri,  
                yacht1.legal, 
                yachtCharterCompany.address
            );
                // Set the YachtSquadTokenization contract as the authorized caller in YachtSquadTokenHolder
            await yachtSquadTokenHolder.connect(owner).setYachtSquadTokenisationContract(investor.address);

            // Transfer tokens from the holder to an investor
            await yachtSquadTokenHolder.connect(investor).transferTokenBatch( investor.address, tokenIds, amounts);


            // Simulate batch transfer (this part may vary depending on how your contracts are set up)
            // Assuming yachtSquadTokenization contract has a method to batch transfer tokens
            await yachtSquadTokenization.connect(investor).safeBatchTransferFrom(
                investor.address, 
                yachtSquadTokenHolder.target, 
                tokenIds, 
                amounts, 
                "0x"
            );
    
            // Verify that each token is correctly recorded in the receivedTokens mapping
            for (let i = 0; i < tokenIds.length; i++) {
                const tokenInfo = await yachtSquadTokenHolder.getTokenInfo(tokenIds[i]);
                expect(tokenInfo.amount).to.equal(amounts[i]);
                expect(tokenInfo.sender).to.equal(investor.address); // Assuming the owner is the one who transferred the tokens
            }
        });
    }); // token reception

    //add security tests
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
    
            await yachtSquadTokenHolder.connect(owner).setYachtSquadTokenisationContract(investor.address);
            await yachtSquadTokenHolder.connect(investor).transferToken(investor.address, tokenId, amount);
    
            // Check balances
            const balanceHolder = await yachtSquadTokenization.balanceOf(yachtSquadTokenHolder.target, tokenId);
            const balanceInvestor = await yachtSquadTokenization.balanceOf(investor.address, tokenId);
    
            expect(balanceHolder).to.equal(yacht0.maxSupply-amount);
            expect(balanceInvestor).to.equal(amount);
        });
    }); // end token transfert

    //add security tests
    describe("Token Batch Transfer", function () {
        it("Should transfer multiple tokens correctly", async function () {
            const { yachtSquadTokenHolder, yachtSquadTokenization, owner, investor, yachtCharterCompany } = await loadFixture(deployContracts);

            // Mint two yachts to the token holder
            const tokenId0 = yacht0.id;
            const tokenId1 = yacht1.id;
            const amount0 = 10000;
            const amount1 = 5000;

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

            await yachtSquadTokenization.connect(owner).mintyachts(
                yachtSquadTokenHolder.target, 
                yacht1.mmsi, 
                yacht1.tokenPrice,
                yacht1.maxSupply,
                yacht1.name, 
                yacht1.uri,  
                yacht1.legal, 
                yachtCharterCompany.address
            );

            // Set the YachtSquadTokenization contract as the authorized caller in YachtSquadTokenHolder
            await yachtSquadTokenHolder.connect(owner).setYachtSquadTokenisationContract(investor.address);

            // Transfer tokens from the holder to an investor
            await yachtSquadTokenHolder.connect(investor).transferTokenBatch( investor.address, [tokenId0, tokenId1], [amount0, amount1]);

            // Check balances for both tokens
            const balanceHolder0 = await yachtSquadTokenization.balanceOf(yachtSquadTokenHolder.target, tokenId0);
            const balanceInvestor0 = await yachtSquadTokenization.balanceOf(investor.address, tokenId0);
            const balanceHolder1 = await yachtSquadTokenization.balanceOf(yachtSquadTokenHolder.target, tokenId1);
            const balanceInvestor1 = await yachtSquadTokenization.balanceOf(investor.address, tokenId1);

            expect(balanceHolder0).to.equal(yacht0.maxSupply - amount0);
            expect(balanceInvestor0).to.equal(amount0);
            expect(balanceHolder1).to.equal(yacht1.maxSupply - amount1);
            expect(balanceInvestor1).to.equal(amount1);
        });
    }); // end token Batch transfert

    describe("Get Token Info", function () {
        it("Should return correct information for a received token", async function () {
            const { yachtSquadTokenHolder, yachtSquadTokenization, owner, yachtCharterCompany } = await loadFixture(deployContracts);
    
            // Mint a yacht to the token holder
            const tokenId = yacht0.id;
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
    
            // Retrieve token information
            const tokenInfo = await yachtSquadTokenHolder.getTokenInfo(tokenId);
    
            // Check if the token information is correct
            expect(tokenInfo.amount).to.equal(yacht0.maxSupply);
            expect(tokenInfo.sender).to.equal(constants.ZERO_ADDRESS); // Assuming the owner is the one who minted the token
        });
    
        it("Should return zero information for a non-received token", async function () {
            const { yachtSquadTokenHolder } = await loadFixture(deployContracts);
    
            // Use a tokenId that has not been minted or transferred
            const nonExistentTokenId = 999; // Example token ID that hasn't been used
    
            // Retrieve token information
            const tokenInfo = await yachtSquadTokenHolder.getTokenInfo(nonExistentTokenId);
    
            // Check if the token information shows zero values
            expect(tokenInfo.amount).to.equal(0);
            expect(tokenInfo.sender).to.equal(constants.ZERO_ADDRESS); // ZERO_ADDRESS for a non-received token
        });
    }); //Get Token Info

});