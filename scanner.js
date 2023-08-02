const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc/c959ede980115cd371ebfc93d315f0746a0a5730f3759825b5a074170c4311c1');

const abi = [{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"}];
const v3abi = [{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"}];

const tokenListV2 = [
    {
        pair_id: 0,
        pair_name: "WBNB/BUSD",
        pair_address: "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16",
        token0: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        dec0: 18,
        dec1: 18,
        pair: true
    },
    {
        pair_id: 1,
        pair_name: "WBNB/USDT",
        pair_address: "0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae",
        token0: "0x55d398326f99059ff775485246999027b3197955",
        token1: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        dec0: 18,
        dec1: 18,
        pair: false
    }
];

const tokenListV3 = [
    {
        pair_id: 0,
        pair_name: "WBNB/BUSD",
        pair_address: "0x85FAac652b707FDf6907EF726751087F9E0b6687",
        token0: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        token1: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        dec0: 18,
        dec1: 18,
        pair: true
    },
    {
        pair_id: 1,
        pair_name: "USDT/WBNB",
        pair_address: "0x36696169C63e42cd08ce11f5deeBbCeBae652050",
        token0: "0x55d398326f99059ff775485246999027b3197955",
        token1: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        dec0: 18,
        dec1: 18,
        pair: false
    }
];

let priceArray = [];

async function calculatePercentDifference() {
    await getPriceV2(0);
    await getPriceV2(1);
    await getPriceV3(0);
    await getPriceV3(1);
    
    // En yüksek ve en düşük fiyatları bulun.
    let maxPrice = Math.max(...priceArray);
    let minPrice = Math.min(...priceArray);
    
    // Yüzdelik farkı hesaplayın.
    let percentDifference = ((maxPrice - minPrice) / minPrice) * 100;
    
    console.log("Yüzdelik Fark => " + percentDifference + "%");
    
    // priceArray'i sıfırlayın.
    priceArray = [];
};

setInterval(calculatePercentDifference, 5000);


async function getPriceV2(id) {
    try {
        const SelectedPair = tokenListV2[id];
        const contract = new ethers.Contract(SelectedPair.pair_address, abi, provider);

        const reserves = await contract.getReserves();

        const reserve0 = reserves._reserve0;
        const reserve1 = reserves._reserve1;
        
        let price; // Declare the variable here

        if (SelectedPair.pair == true){
            price = reserve1 / reserve0;
            priceArray.push(price);
        } else if(SelectedPair.pair == false){
            price = reserve0 / reserve1; 
            priceArray.push(price); 
        }
        
        console.log("Fiyat => " + price + " Pair => " + SelectedPair.pair_name + " V2");
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
async function getPriceV3(id) {
    try {
        const SelectedPair = tokenListV3[id];
        const contract = new ethers.Contract(SelectedPair.pair_address, v3abi, provider);

        const reserves = await contract.slot0();

        const sqrtPrice = reserves.sqrtPriceX96;
        const tokenPrice = (sqrtPrice * sqrtPrice) / 2 ** 192;
        
        let price; // Declare the variable here

        price = tokenPrice / 10 ** (tokenListV3[id].dec0 - tokenListV3[id].dec1)

        if (SelectedPair.pair == true){
            priceArray.push(price); // Fiyatı priceArray'e ekleyin.
        } else if(SelectedPair.pair == false){
            price = 1 / price;
            priceArray.push(price); 
        }
        
        console.log("Fiyat => " + price + " Pair => " + SelectedPair.pair_name + " V3");
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
