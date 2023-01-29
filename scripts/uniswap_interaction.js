const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent} = require('@uniswap/sdk');
const { ethers } = require("hardhat");
const { uniswapv2router02_abi } = require("../abis");

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const uniswapRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

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

    const accounts = await ethers.getSigners();
    const ethBalance = await ethers.provider.getBalance(accounts[0].address);
    console.log(ethers.utils.formatEther(ethBalance));

    const slippageTolerance = new Percent('50', '10000'); // 50 bips. 1 bip = 0.0001 or 0.1 permille
    const amountOutMin = ethers.BigNumber.from(trade.minimumAmountOut(slippageTolerance).raw.toString());
    const path = [weth.address, dai.address];
    const to = accounts[0].address;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20min from now (time in seconds)
    const value = ethers.BigNumber.from(trade.inputAmount.raw.toString());
    console.log(amountOutMin, path, to, deadline, value);

    // const deployer = (await getNamedAccounts()).deployer;
    const uniswap = new ethers.Contract(uniswapRouterAddress, uniswapv2router02_abi, accounts[0]);
    const tx = await uniswap.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadline,
        { value: value, gasPrice: 20e9, gasLimit: 250000 }
    );
    const receipt = await tx.wait(1)
    console.log(`Transaction hash: ${tx.hash}`);
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
};

init();
