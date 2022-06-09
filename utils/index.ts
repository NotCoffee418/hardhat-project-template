import { ethers } from "hardhat";
import { BigNumber, BigNumberish } from 'ethers';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

/* --- DATA --- */
type ERC20Map = { [erc20: string]: string };
export const erc20Address: ERC20Map = {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    WMATIC: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
};

type RouterMap = { [protocol: string]: string };
export const uniswapRouter: RouterMap = {
    POLYGON_UNISWAP_V3: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    POLYGON_QUICKSWAP: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
};

export const HODL_CONTRACT: string = "0x0ff652f7e5389ef66cb0c1add614f5a50d1e2e34";


/* --- UTIL FUNCTIONS --- */
// Buys a specific amount of a real token on quickswap for testing.
export const spawnToken = async (
    tokenAddress: string,
    amount: BigNumber,
    inputSigner: SignerWithAddress | null = null,
    uniswapV2Hops: string[] = [],
    factoryAddress: string | null = null
) => {
    // Get uniswap v2 factory (quickswap or override)
    if (factoryAddress === null)
        factoryAddress = uniswapRouter.POLYGON_QUICKSWAP;
    const uniswapV2 = await getUniswapV2(factoryAddress);

    // Define route
    const route: string[] = [erc20Address.WMATIC]
        .concat(uniswapV2Hops)
        .concat([tokenAddress])

    // Decide the price    
    const maticAmountIn: BigNumber = (await uniswapV2.getAmountsIn(amount, route))[0];

    // Approve wmatic
    const signer: SignerWithAddress = inputSigner ?? (await ethers.getSigners())[0]
    await approveERC20(
        uniswapV2.address,
        erc20Address.WMATIC,
        maticAmountIn,
        inputSigner)

    // Execute swap
    await uniswapV2.connect(signer).swapETHForExactTokens(
        amount,
        route,
        signer.address,
        (Date.now() + 1000 * 60 * 10),
        { value: maticAmountIn }
    )
}

export const approveERC20 = async (
    giveApprovalTo: string,
    tokenAddress: string,
    amount: BigNumberish,
    inputSigner: SignerWithAddress | null = null) => {
    const signer: SignerWithAddress = inputSigner ?? (await ethers.getSigners())[0]
    let token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", tokenAddress)
    await token.connect(signer).approve(giveApprovalTo, amount)
}

export const getErc20Balance = async (
    tokenAddress: string,
    addressToCheck: string,
): Promise<BigNumber> => {
    let token = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", tokenAddress)
    return await token.balanceOf(addressToCheck);
};

export const getUniswapV2 = async (routerAddress: string) =>
    await await ethers.getContractAt("IUniswapV2Router02", routerAddress)