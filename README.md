# Interacting with Uniswap

Uniswap is a deceentralised crypto trading protocol. Instead of trading peer-to-peer, Uniswap uses liquidity pools to greatly increase the liquidity of the exchange. One of the main Smart Contracts of Uniswap is the *Factory* which is used to create the different markets. Each market consists of a *Pair* contract which holds two ERC20 tokens that can be swapped with one another. It further serves as a registery for all the different markets. Finally, the *Router* smart contract is a utility which simplifies the interaction with the protocol.

*Liquidity providers* interact with the pair contract by adding or removing liquidity. Similarly, traders interact with the Pair smart contract in order to swap tokens. Although, it is possible to interact with the pair contract directly in these cases, the router contract offers additional functionality such as swapping two tokens that do exist as a pair on their own but instead have a route to market through two or more other pair contracts, e.g. given pairs (A, B) and (B, C) the router enables a market between A and C. In addition, the router automatically handles the wrapping of native ETH tokens into ERC20 WETH tokens when performing swaps that involve WETH.


## Setting up environment

After setting up a basic Hardhat environment we install the [Uniswap SDK](https://docs.uniswap.org/sdk/v2/guides/quick-start) package using `yarn`. The Uniswap SDK is used to help developers build on top of Uniswap. We also add it to the `hardhat.config.js` file as a `require`.

```bash
yarn add --dev @uniswap/sdk 
```

## Script 

In the script we try out a few things. The script can be run with `hh run scripts/uniswap_interactions.js`

- Fetching a pair using `Fetcher`: 
    ```javascript
    const { Fetcher, WETH } = require('@uniswap/sdk')
    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai, weth); // order not important
    ```

- Creating a trading route with `Route`:
    ```javascript
    const { Route } = require('@uniswap/sdk')
    const route = new Route([pair], weth) // specify pair(s) and input token
    console.log(route.midPrice.toSignificant(6)); // returns DAI / WETH
    console.log(route.midPrice.invert().toSignificant(6)); // returns WETH / ETH
    ```

- Swap long a route using `Trade`:
    ```javascript
    const { Trade, TokenAmount, TradeType } = require('@uniswap/sdk')
    const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log(trade.executionPrice.toSignificant(6)); // returns hypothetical execution price
    console.log(trade.nextMidPrice.toSignificant(6)); // returns next mid price
    ```