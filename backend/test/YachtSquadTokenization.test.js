const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("YachtSquadTokenisation contract", function () {

    /**
     * 
     * @returns 
     */
    async function deployContract() {
        const [operator, tokenHolder, tokenBatchHolder, ...otherAccounts] = await ethers.getSigners();
        //const initialURI = 'https://chocolate-manual-reindeer-776.mypinata.cloud/ipfs/';//to be completed
        const YachtSquadTokenisation = await ethers.getContractFactory("YachtSquadTokenization");
        const yachtSquadToken = await YachtSquadTokenisation.deploy(YachtSquadTokenisation);
        return { yachtSquadToken, operator, tokenHolder,tokenBatchHolder, ...otherAccounts};
    }

        // Test suite for testing the deployment phase of the Voting contract
    describe("Deployment", function () {
        // Test case to ensure the contract is deployed with the correct owner
        it("Should set the owner", async function () {
            // Deploying the contract and retrieving the owner
            const { yachtSquadToken, operator, tokenHolder, test5 } = await loadFixture(deployContract);
            // Asserting that the deployed contract has the correct owner
            expect(await yachtSquadToken.owner()).to.be.equal(operator.address);
        });
    })

})