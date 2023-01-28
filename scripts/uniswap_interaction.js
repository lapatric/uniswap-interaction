const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType} = require('@uniswap/sdk')

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

async function init() {
    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai, weth); // order not important
    const route = new Route([pair], weth) // if you want to swap across several pairs (chain), specify several pairs
    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log(route.midPrice.toSignificant(6));
    // console.log(route.midPrice.invert().toSignificant(6));
    console.log(trade.executionPrice.toSignificant(6));
    console.log(trade.nextMidPrice.toSignificant(6));
};

init();
