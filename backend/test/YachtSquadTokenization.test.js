const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Voting test", function () {
    async function deployContract() {
        const [owner, addVoter1, addVoter2] = await ethers.getSigners();
        const YachtSquadTokenisation = await ethers.getContractFactory("YachtSquadTokenisation");
        const yachtSquadToken = await YachtSquadTokenisation.deploy(YachtSquadTokenisation);
        return { yachtSquadToken, owner, yachtCharter1, investor1, investor2, investor3 };
    }

        // Test suite for testing the deployment phase of the Voting contract
    describe("Deployment", function () {
        // Test case to ensure the contract is deployed with the correct owner
        it("Should set the owner", async function () {
            // Deploying the contract and retrieving the owner
            const { voting, owner } = await loadFixture(deployContract);
            // Asserting that the deployed contract has the correct owner
            expect(await voting.owner()).to.be.equal(owner.address);
        });
    })

})