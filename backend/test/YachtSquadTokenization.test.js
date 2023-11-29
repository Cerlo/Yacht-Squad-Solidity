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
        return { yachtSquadToken, owner, addVoter1, addVoter2 };
    }

})