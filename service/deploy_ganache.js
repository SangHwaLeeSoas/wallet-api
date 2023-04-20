const Web3 = require("web3");
const { ethers } = require("ethers");
const { Contract, ContractFactory } = require("@ethersproject/contracts");
const SimpleStorage = require("./build/contracts/SimpleStorage.json");

// Ganache endpoint
const GANACHE_ENDPOINT = "http://localhost:7545";

// Account private key
const PRIVATE_KEY = "YOUR WALLET PRIVATE KEY";

// Deploy function
async function deploy() {
    // Set up provider and signer
    const provider = new Web3.providers.HttpProvider(GANACHE_ENDPOINT);
    const signer = new ethers.Wallet(PRIVATE_KEY);

    // Set up web3
    const web3 = new Web3(provider);

    // Get contract factory
    const factory = new ContractFactory(
        SimpleStorage.abi,
        SimpleStorage.bytecode,
        signer
    );

    // Deploy contract
    const contract = await factory.deploy();

    // Wait for contract address
    await contract.deployed();

    // Log contract address
    console.log("Contract deployed to:", contract.address);
}

// Call deploy function
deploy();