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

    async function deployContract_SCholderYccnvestor() {
        const [owner, scHolder ,yachtCharterCompany, investor1, investor2, lead1] = await ethers.getSigners();
        //const initialURI = 'https://chocolate-manual-reindeer-776.mypinata.cloud/ipfs/';//to be completed
        const YachtSquadTokenisation = await ethers.getContractFactory("YachtSquadTokenization");
        const yachtSquadToken = await YachtSquadTokenisation.deploy(YachtSquadTokenisation);
        return { yachtSquadToken, owner ,scHolder, yachtCharterCompany, investor1, investor2, lead1};
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

    describe("Safe Transfert process", async function(){
        let _yachtSquadTokenization;
        let _owner;
        let _investor1;
        let _scHolder;
        let _yachtCharterCompany;
    
        beforeEach(async function () {
            const { yachtSquadToken, owner, scHolder ,yachtCharterCompany, investor1} = await loadFixture(deployContract_SCholderYccnvestor);
            _yachtSquadTokenization= yachtSquadToken;
            _owner = owner;
            _investor1 = investor1;
            _scHolder = scHolder
            _yachtCharterCompany = yachtCharterCompany;
        });
    
        describe("SafeTransfert one SFT", function () {
            it("Should mint a yacht correctly and emit NewMint event", async function () {    
                await expect(_yachtSquadTokenization.connect(_owner).mintyachts(
                    _scHolder.address, 
                    yacht0.mmsi, 
                    yacht0.tokenPrice,
                    yacht0.maxSupply,
                    yacht0.name, 
                    yacht0.uri,  
                    yacht0.legal, 
                    _yachtCharterCompany.address
                )).to.emit(_yachtSquadTokenization, "NewMint").withArgs(0, yacht0.maxSupply, yacht0.name);
    
                const yacht = await _yachtSquadTokenization.getYacht(0);
                expect(yacht.name).to.equal(yacht0.name);
                expect(yacht.mmsi).to.equal(yacht0.mmsi);
                expect(yacht.tokenPrice).to.equal(yacht0.tokenPrice);
                expect(yacht.maxSupply).to.equal(yacht0.maxSupply);
                expect(yacht.uri).to.equal(yacht0.uri);
                expect(yacht.legal).to.equal(yacht0.legal);
                expect(yacht.paymentWallet).to.equal(_yachtCharterCompany.address);
                expect(yacht.status).to.equal(0); // Assuming 0 is the enum value for IntialMint
            });
    
            it("Should update balances correctly after safeTransferFrom", async function () {
                const tokenId = 0;
                const amount = 100;
    
                // Minting yacht to yachtTokenHolderAddress
                await _yachtSquadTokenization.connect(_owner).mintyachts(
                    _scHolder.address, 
                    yacht0.mmsi, 
                    yacht0.tokenPrice,
                    yacht0.maxSupply,
                    yacht0.name, 
                    yacht0.uri,  
                    yacht0.legal, 
                    _yachtCharterCompany.address
                );

                await _yachtSquadTokenization.connect(_scHolder).setApprovalForAll(_owner.address, true);
                
                // Transferring tokens from yachtTokenHolderAddress to otherAccount
                await _yachtSquadTokenization.connect(_owner).safeTransferFrom(
                    _scHolder.address, 
                    _investor1.address, 
                    tokenId, 
                    amount, 
                    "0x"
                );
    
                const balanceHolder = await _yachtSquadTokenization.balanceOf(_scHolder.address, tokenId);
                const balanceOther = await _yachtSquadTokenization.balanceOf(_investor1.address, tokenId);
    
                expect(balanceHolder).to.equal(yacht0.maxSupply - amount);
                expect(balanceOther).to.equal(amount);
            });
    
            it("Should emit RecivedToken event on safeTransferFrom", async function () {
                const tokenId = 0;
                const amount = 100;
    
                // Minting yacht to yachtTokenHolderAddress
                await _yachtSquadTokenization.connect(_owner).mintyachts(
                    _scHolder.address, 
                    yacht0.mmsi, 
                    yacht0.tokenPrice,
                    yacht0.maxSupply,
                    yacht0.name, 
                    yacht0.uri,  
                    yacht0.legal, 
                    _yachtCharterCompany.address
                );
    
                await _yachtSquadTokenization.connect(_scHolder).setApprovalForAll(_owner.address, true);
                // Transferring tokens from yachtTokenHolderAddress to otherAccount
                await expect(_yachtSquadTokenization.connect(_owner).safeTransferFrom(
                    _scHolder.address, 
                    _investor1.address,  
                    tokenId, 
                    amount, 
                    "0x"
                )).to.emit(_yachtSquadTokenization, "RecivedToken").withArgs(_scHolder.address, _investor1.address, tokenId, amount);
            });
        });
    })



})