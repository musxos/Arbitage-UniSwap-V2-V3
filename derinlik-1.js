const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');

const abi = [{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"}];

async function getPrice(pairAddress,desc) {
    const contract = new ethers.Contract(pairAddress, abi, provider);
    const reserves = await contract.getReserves();
    const reserve0 = reserves._reserve0;
    const reserve1 = reserves._reserve1;
    let price = reserve0 / reserve1;
    // console.log("USDT/BUSD")
    // console.log(price + " DEX " + desc)
    return price; 
}

// BiSwap USDT/BUSD 0xDA8ceb724A06819c0A5cDb4304ea0cB27F8304cF
// '0x249cd054697f41d73F1A81fa0F5279fcce3cF70c','baby'
// '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00','pancake'

async function calculatePercentageDifference() {
    const price1 = await getPrice('0x8840C6252e2e86e545deFb6da98B2a0E26d8C1BA','biBNB').catch(console.error);
    const price2 = await getPrice('0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE','pancake').catch(console.error);
    const percentageDifference = ((price1 - price2) / price2) * 100;
    console.log(percentageDifference + `%`);
    return percentageDifference;
}

async function monitorDifference() {
    while (true) {
        const percentageDifference = await calculatePercentageDifference().catch(console.error);

        if (Math.abs(percentageDifference) > 0.7) {
            console.log(`Al! Fark: ${percentageDifference}%`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Her 1 saniye kontrol eder
    }
}

monitorDifference().catch(console.error);
