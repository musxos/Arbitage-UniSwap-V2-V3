const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

const uniswapRouterAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // PancakeSwap router address
const uniswapRouterABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "name": "path",
          "type": "address[]"
        }
      ],
      "name": "getAmountsOut",
      "outputs": [
        {
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
   // PancakeSwap router ABI

const routerContract = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, provider);

async function getAmountsOut(amountIn, path) {
    return await routerContract.getAmountsOut(amountIn, path);
}

async function calculateMinimumReturn(path) {
    // We'll assume the input amount is 1 of the initial token, you can adjust this as necessary
    const amountIn = ethers.utils.parseUnits('1', 18); // Change this to match the decimals of your input token

    try {
        const amountsOut = await getAmountsOut(amountIn, path);
        // The last element of the amountsOut array is the amount of the output token you will receive
        const minimumReturn = ethers.utils.formatUnits(amountsOut[amountsOut.length - 1], 18); // Change this to match the decimals of your output token
        console.log('Minimum return for 1 input token:', minimumReturn);
    } catch (error) {
        console.error('Error calculating minimum return:', error);
    }
}

// Define the path (array of token addresses) you want to use
// 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c BNB
// 0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c BTCB
// 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56 BUSD
// 0x2170Ed0880ac9A755fd29B2688956BD959F933F8 ETH
// 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82 CAKE

const path = [`0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`,`0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82`,`0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`,`0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`];

calculateMinimumReturn(path);
