const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { ethers } = require("hardhat");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("YachtTokenMarketrplace contract", function () {
    
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
        const [owner, investor] = await ethers.getSigners();

        // Deploy YachtSquadTokenization contract
        const YachtSquadTokenization = await ethers.getContractFactory("YachtSquadTokenization");
        const yachtSquadTokenization = await YachtSquadTokenization.deploy();

        // Deploy YachtSquadTokenHolder contract
        const YachtSquadTokenHolder = await ethers.getContractFactory("YachtSquadTokenHolder");
        const yachtSquadTokenHolder = await YachtSquadTokenHolder.deploy(yachtSquadTokenization.target);

        // Deploy YachtTokenMarketplace contract
        const YachtTokenMarketplace = await ethers.getContractFactory("YachtTokenMarketplace");
        const yachtTokenMarketplace = await YachtTokenMarketplace.deploy(yachtSquadTokenization.target, yachtSquadTokenHolder.target);

        return { yachtTokenMarketplace, yachtSquadTokenization, yachtSquadTokenHolder, owner, investor };
    }
    describe("Deployment", function () {
        it("Should deploy and set the initial state correctly", async function () {
            const { yachtTokenMarketplace, yachtSquadTokenization, yachtSquadTokenHolder, owner } = await loadFixture(deployContracts);

            // Check if the YachtSquadTokenization contract address is set correctly
            expect(await yachtTokenMarketplace.yachtSquadTokenisationContract()).to.equal(yachtSquadTokenization.target);

            // Check if the YachtSquadTokenHolder contract address is set correctly
            expect(await yachtTokenMarketplace.yachtSquadTokenHolderContract()).to.equal(yachtSquadTokenHolder.target);

            // Check if the owner is set correctly
            expect(await yachtTokenMarketplace.owner()).to.equal(owner.address);
        });
    });

    describe("Token Listing", function () {
        it("Should allow a user to list a token for sale", async function () {
            const { yachtTokenMarketplace, yachtSquadTokenization, yachtSquadTokenHolder, owner, investor } = await loadFixture(deployContracts);

            // Mint a yacht token to the owner
            const tokenId = 0;
            const tokenAmount = 100;
            const tokenPrice = ethers.parseEther("1"); // 1 ETH per token
            await yachtSquadTokenization.connect(owner).mintyachts(
                owner.address, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yacht0.paymentWallet
            );

            // Approve the marketplace to transfer owner's tokens
            await yachtSquadTokenization.connect(owner).setApprovalForAll(yachtTokenMarketplace.target, true);

            // List the token for sale
            await yachtTokenMarketplace.connect(owner).listTokenForSale(tokenId, tokenAmount, tokenPrice);

            // Retrieve the sale offer
            const saleOffer = await yachtTokenMarketplace.saleOffers(tokenId);

            // Check if the sale offer is set correctly
            expect(saleOffer.tokenId).to.equal(tokenId);
            expect(saleOffer.amount).to.equal(tokenAmount);
            expect(saleOffer.pricePerToken).to.equal(tokenPrice);
            expect(saleOffer.seller).to.equal(owner.address);
        });

        it("Should be reverted Insufficient token balance", async function () {
            const { yachtTokenMarketplace, yachtSquadTokenization, yachtSquadTokenHolder, owner, investor } = await loadFixture(deployContracts);

            // Mint a yacht token to the owner
            const tokenId = 0;
            const tokenPrice = ethers.parseEther("1"); // 1 ETH per token
            await yachtSquadTokenization.connect(owner).mintyachts(
                yachtSquadTokenHolder.target, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yacht0.paymentWallet
            );

            // Approve the marketplace to transfer owner's tokens
            await yachtSquadTokenization.connect(owner).setApprovalForAll(yachtTokenMarketplace.target, true);

            expect(yachtTokenMarketplace.connect(owner).listTokenForSale(tokenId, yacht0.maxSupply+1, tokenPrice)).to.be.revertedWith("Insufficient token balance");
        });
    });

    describe("Token Purchase", function () {
        it("Should allow a user to buy a listed token", async function () {
            const { yachtTokenMarketplace, yachtSquadTokenization, yachtSquadTokenHolder, owner, investor } = await loadFixture(deployContracts);

            // Mint a yacht token to the owner
            const tokenId = 0;
            const tokenPrice = ethers.parseEther("1"); // 1 ETH per token
            await yachtSquadTokenization.connect(owner).mintyachts(
                owner.address, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yacht0.paymentWallet
            );

            // Approve the marketplace to transfer owner's tokens
            await yachtSquadTokenization.connect(owner).setApprovalForAll(yachtTokenMarketplace.target, true);

            // List the token for sale
            await yachtTokenMarketplace.connect(owner).listTokenForSale(tokenId, yacht0.maxSupply, tokenPrice);

            // Investor buys the token
            const purchaseAmount = 10; // Amount of tokens to buy
            const totalPrice = tokenPrice*BigInt(purchaseAmount); // Total price for the tokens
            await yachtTokenMarketplace.connect(investor).buyToken(tokenId, purchaseAmount, { value: totalPrice });//Test of the payable function
            

            // Check balances after purchase
            const balanceSeller = await yachtSquadTokenization.balanceOf(owner.address, tokenId);
            const balanceBuyer = await yachtSquadTokenization.balanceOf(investor.address, tokenId);

            // Check if the balances are updated correctly
            expect(balanceSeller).to.equal(yacht0.maxSupply - purchaseAmount);
            expect(balanceBuyer).to.equal(purchaseAmount);

            // Retrieve the sale offer
            const saleOffer = await yachtTokenMarketplace.saleOffers(tokenId);
            expect(saleOffer.amount).to.equal(yacht0.maxSupply - purchaseAmount); // Assuming the offer is updated with remaining amount

        });
    });
});