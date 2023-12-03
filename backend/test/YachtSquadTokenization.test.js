const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

  const status ={
    IntialMint:0,     // The yacht is listed and available for sale
    PreSale:1,        // Sale for holders of at least one SFT of yacht
    PublicSale:2,     // Public sale open to new investors
    Chartered:3,      // The yacht is currently chartered
    Maintenance:4,    // The yacht is under maintenance
    Sold:5            // The yacht has been sold
}






describe("YachtSquadTokenisation contract", function () {
    
    const yacht0= {
        id:0,
        mmsi:319113100, //mmsi/AIS => yacht identification
        tokenPrice:2000, 
        maxSupply:100000,
        name: 'Black Pearl',
        uri: 'Image du boat',
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
        uri:'Image du boat',
        legal: 'a899fc0d56ef54e9a2a9e7b8ef16e79f4ca11a56d86d79f6366d14b0c3c690aa', //Aquijo is owned by YachtSquad
        paymentWallet:"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        status : status.PreSale
    }
    
    const yacht2= {
        id:2,
        mmsi:229383000, //mmsi/AIS => yacht identification
        tokenPrice:100, 
        maxSupply:175000,
        name: 'Running on Waves',
        uri: 'Image du boat',
        legal: 'a0e02d6e77a73995d16888e188074198f0d96cecf79edd52d4072d3547207f54', //Running on Waves is owned by YachtSquad
        paymentWallet:"0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        status : status.PublicSale
    }

    /**
     * 
     * @returns 
     */
    async function deployTokenization_init() {
        const [owner ] = await ethers.getSigners();
        //const initialURI = 'https://chocolate-manual-reindeer-776.mypinata.cloud/ipfs/';//to be completed
        const YachtSquadTokenisation = await ethers.getContractFactory("YachtSquadTokenization");
        const yachtSquadToken = await YachtSquadTokenisation.deploy(YachtSquadTokenisation);
        return { yachtSquadToken, owner};
    }

    async function deployContract_SCholderYcc() {
        const [owner, scHolder, yachtCharterCompany] = await ethers.getSigners();
        //const initialURI = 'https://chocolate-manual-reindeer-776.mypinata.cloud/ipfs/';//to be completed
        const YachtSquadTokenisation = await ethers.getContractFactory("YachtSquadTokenization");
        const yachtSquadToken = await YachtSquadTokenisation.deploy(YachtSquadTokenisation);
        return { yachtSquadToken, owner ,scHolder, yachtCharterCompany};
    }

        // Test suite for testing the deployment phase of the Voting contract
    describe("Deployment", function () {
        // Test case to ensure the contract is deployed with the correct owner
        it("Should set the owner", async function () {
            // Deploying the contract and retrieving the owner
            const { yachtSquadToken, owner } = await loadFixture(deployTokenization_init);
            // Asserting that the deployed contract has the correct owner
            expect(await yachtSquadToken.owner()).to.be.equal(owner.address);
        });
    })

    describe("Support interface", function(){
        let yachtSquadTokenization;

        // Chargement du contrat avant chaque test
        beforeEach(async function () {
            const { yachtSquadToken } = await loadFixture(deployTokenization_init);
            yachtSquadTokenization = yachtSquadToken;
        });
        
        /** à doccumenter dans le REDME.md
         * Dans les normes ERC, chaque interface est représentée par un identifiant unique de 4 octets (bytes4). Par exemple :

                ERC1155: 0xd9b67a26
                ERC2981 (Royalties): 0x2a55205a

            Ces identifiants sont calculés à partir de la concaténation des signatures de fonction de l'interface, puis en prenant le keccak256 de cette chaîne et en gardant les 4 premiers octets.
         */
        it("Should support ERC1155 interface", async function () {
            const interfaceIdERC1155 = "0xd9b67a26"; 
            expect(await yachtSquadTokenization.supportsInterface(interfaceIdERC1155)).to.be.true;
        });
    
        it("Should support ERC2981 interface", async function () {
            const interfaceIdERC2981 = "0x2a55205a";
            expect(await yachtSquadTokenization.supportsInterface(interfaceIdERC2981)).to.be.true;
        });
    
        it("Should not support an invalid interface", async function () {
            const invalidInterfaceId = "0xabcdef01";
            expect(await yachtSquadTokenization.supportsInterface(invalidInterfaceId)).to.be.false;
        });
    })

    describe("Minting Yachts", async function() {
        it("Should mint yacht0 correctly", async function() {
            const { yachtSquadToken, owner, scHolder,yachtCharterCompany} = await loadFixture(deployContract_SCholderYcc);

            await yachtSquadToken.connect(owner).mintyachts(
                scHolder.address, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address
            );
            const yacht = await yachtSquadToken.getYacht(0);
            expect(yacht.id).to.equal(yacht0.id);
            expect(yacht.mmsi).to.equal(yacht0.mmsi);
            expect(yacht.tokenPrice).to.equal(yacht0.tokenPrice);
            expect(yacht.maxSupply).to.equal(yacht0.maxSupply);
            expect(yacht.name).to.equal(yacht0.name);
            expect(yacht.uri).to.equal(yacht0.uri);
            expect(yacht.legal).to.equal(yacht0.legal);
            expect(yacht.paymentWallet).to.equal(yachtCharterCompany.address);
            expect(yacht.status).to.equal(yacht0.status);
        });

        it("Should not mint yacht0 correctly", async function() {
            const { yachtSquadToken, owner, scHolder,yachtCharterCompany} = await loadFixture(deployContract_SCholderYcc);

            await expect(yachtSquadToken.connect(scHolder).mintyachts(
                scHolder.address, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address
            )).to.be.revertedWithCustomError(yachtSquadToken, "OwnableUnauthorizedAccount");
        });

        it("Should not mint yacht0 correctly", async function() {
            const { yachtSquadToken, owner, scHolder,yachtCharterCompany} = await loadFixture(deployContract_SCholderYcc);

            await expect(yachtSquadToken.connect(scHolder).mintyachts(
                scHolder.address, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address
            )).to.be.revertedWithCustomError(yachtSquadToken, "OwnableUnauthorizedAccount");
        });

        it("Should emit new minted yacht id, supply and name", async function () {
            //Deploying the contract for this test case and retriving datas
            const { yachtSquadToken, owner, scHolder,yachtCharterCompany} = await loadFixture(deployContract_SCholderYcc);
            // Registering voters
            await expect(yachtSquadToken.connect(owner).mintyachts(
                scHolder.address, 
                yacht0.mmsi, 
                yacht0.tokenPrice,
                yacht0.maxSupply,
                yacht0.name, 
                yacht0.uri,  
                yacht0.legal, 
                yachtCharterCompany.address)).to.emit(yachtSquadToken, 'NewMint')
                .withArgs(0, yacht0.maxSupply, yacht0.name);
        });

    });



})