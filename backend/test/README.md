# YachtSquad Project - Testing Guide

Welcome to the YachtSquad project's testing documentation. This guide will walk you through the process of running the test suites for our Ethereum smart contracts, which are crucial for ensuring the reliability and security of our yacht tokenization platform.

## Prerequisites
Before running the tests, ensure you have the following installed:

* [`Node.js`](https://nodejs.org/en/) (version 12 or higher)
* [`Yarn`](https://yarnpkg.com/) or [`npm`](https://www.npmjs.com/) package manager
* [`Hardhat`](https://hardhat.org/) - Ethereum development environment

## Installation
Clone the repository:

```bash
git clone https://github.com/Cerlo/Yacht-Squad-Solidity
cd backend
```

## Install dependencies:

```bash
yarn install
# or
npm install
```

## Running Tests

To run the test suite, execute the following command in the project root directory:

```bash
npx hardhat test
```
This command will execute all test files located in the test directory.

## Test Structure

Our tests are structured to cover various aspects of the smart contracts, including:

* Deployment Tests: Ensure that contracts are deployed correctly with the proper initial state.
* Functionality Tests: Validate the core functionalities like minting yachts, transferring tokens, and handling royalties.
* Security Tests: Check for vulnerabilities and ensure that functions revert under expected conditions.

## Test Files Overview

1. YachtSquadTokenization.test.js: Tests the YachtSquadTokenization contract, focusing on minting yachts, token URI management, and royalty information.

2. YachtSquadTokenHolder.test.js: Focuses on the YachtSquadTokenHolder contract, testing token reception, transfers, and batch operations.

3. YachtMarketplace.test.js: Tests the YachtTokenMarketplace contract, covering token listing, purchasing, and sale offer management.

Each test file contains multiple describe blocks, grouping related tests for better readability and organization.