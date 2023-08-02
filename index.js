const ethers = require('ethers');
let abi = require('./contractABI.json');

// Set up provider for Binance Smart Chain
let provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

// Private key of the owner account
let ownerPrivateKey = 'YOUR_PRIVATE_KEY';
let wallet = new ethers.Wallet(ownerPrivateKey, provider);

// The address of the deployed contract
let contractAddress = 'DEPLOYED_CONTRACT_ADDRESS';

// The ABI of the contract
let abi = [
    // include the contract's full ABI here
];

let contract = new ethers.Contract(contractAddress, abi, wallet);

async function tradeChainMasterX(amountIn, path0, path1, path2, approves) {
    let tx = await contract.tradeChainMasterX(amountIn, path0, path1, path2, approves);
    let receipt = await tx.wait();
    console.log('Transaction receipt: ', receipt);
}

async function singleRouter(amountIn, amountOut, path, approves, router) {
    let tx = await contract.singleRouter(amountIn, amountOut, path, approves, router);
    let receipt = await tx.wait();
    console.log('Transaction receipt: ', receipt);
}

async function pancakeV2toV3(_amountIn, amountOut, path, approve, tokenV3In, tokenV3Out, _poolFee) {
    let tx = await contract.pancakeV2toV3(_amountIn, amountOut, path, approve, tokenV3In, tokenV3Out, _poolFee);
    let receipt = await tx.wait();
    console.log('Transaction receipt: ', receipt);
}

// tradeChainMasterX(
//     ethers.utils.parseEther("1.0"), 
//     ['0x...', '0x...', '0x...'], 
//     ['0x...', '0x...', '0x...'], 
//     ['0x...', '0x...', '0x...'], 
//     ['0x...', '0x...', '0x...']
// );

// singleRouter(
//     ethers.utils.parseEther("1.0"), 
//     ethers.utils.parseEther("0.1"), 
//     ['0x...', '0x...', '0x...'], 
//     '0x...', 
//     '0x...'
// );

// pancakeV2toV3(
//     ethers.utils.parseEther("1.0"), 
//     ethers.utils.parseEther("0.1"), 
//     ['0x...', '0x...', '0x...'], 
//     '0x...', 
//     '0x...', 
//     '0x...', 
//     3000
// );

