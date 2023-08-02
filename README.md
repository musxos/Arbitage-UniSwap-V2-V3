# Arbitage-UniSwap-V2-V3
Built with love
node_modules surum hatasi alanlar olur diye ekledim.


Detayli Arbitaj Uygulaması
Bu repo, PancakeSwap, BabySwap ve diğer Uniswap türü otomatik market yapıcıları (AMM) ile etkileşime giren bir dizi Solidity akıllı sözleşme içerir. Bu sözleşmeler, belirli bir miktar token'ın farklı AMM'ler arasında nasıl takas edileceğini göstermektedir.

Fonksiyonlar
tradeChainMasterX
Bu fonksiyon, belirli bir miktar token'ı üç aşamada değiştirir: PancakeSwap, BabySwap ve yeniden PancakeSwap üzerinden.

Parametreler:

amountIn: İşlemde kullanılacak token miktarı.
path0, path1, path2: Her bir işlem için ayrı ayrı token adreslerinin yolunu belirtir. İşlemler bu yolları takip eder.
approves: Her bir işlem için ayrı ayrı onaylanacak token'ın adresini belirtir.
singleRouter
Bu fonksiyon, belirli bir miktar token'ı tek bir adımda belirli bir router üzerinden değiştirir.

Parametreler:

amountIn: İşlemde kullanılacak token miktarı.
amountOut: İşlemden alınacak minimum token miktarını belirtir.
path: İşlemin token adreslerinin yolunu belirtir.
approves: Onaylanacak token'ın adresini belirtir.
router: İşlemin yapılacağı router'ın adresini belirtir.
pancakeV2toV3
Bu fonksiyon, öncelikle PancakeSwap v2'de bir token takası yapar ve ardından PancakeSwap v3'te bir token takası yapar.

Parametreler:

_amountIn: Bu, işlemde kullanılacak token miktarıdır.
amountOut: Bu, PancakeSwap v2'deki işlemden alınacak minimum token miktarını belirtir.
path: PancakeSwap v2'deki işlemin token adreslerinin yolunu belirtir.
approve: PancakeSwap v2'deki onaylanacak token'ın adresini belirtir.
tokenV3In, tokenV3Out: PancakeSwap v3'deki işlem için giriş ve çıkış token adreslerini belirtir.
_poolFee: PancakeSwap v3'deki işlem için kullanılacak pool ücretini belirtir.
