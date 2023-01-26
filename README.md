# Interacting with Uniswap

Uniswap is a deceentralised crypto trading protocol. Instead of trading peer-to-peer, Uniswap uses liquidity pools to greatly increase the liquidity of the exchange. One of the main Smart Contracts of Uniswap is the *Factory* which is used to create the different markets. Each market consists of a *Pair* contract which holds two ERC20 tokens that can be swapped with one another. It further serves as a registery for all the different markets. Finally, the *Router* smart contract is a utility which simplifies the interaction with the protocol.

*Liquidity providers* interact with the pair contract by adding or removing liquidity. Similarly, traders interact with the Pair smart contract in order to swap tokens. Although, it is possible to interact with the pair contract directly in these cases, the router contract offers additional functionality such as swapping two tokens that do exist as a pair on their own but instead have a route to market through two or more other pair contracts, e.g. given pairs (A, B) and (B, C) the router enables a market between A and C. In addition, the router automatically handles the wrapping of native ETH tokens into ERC20 WETH tokens when performing swaps that involve WETH.


## Setting up environment

After setting up a basic Hardhat environment we install the relevant Uniswap package using `yarn`. We also add it to the `hardhat.config.js` file as a `require`.

```bash
yarn add --dev @uniswap/sdk 
```