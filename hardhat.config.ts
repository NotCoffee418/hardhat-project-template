import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import '@typechain/hardhat'
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";


// Register Tasks
import "./tasks/block-number";


// Assertions for BigNumber
import { BigNumber } from "ethers";
var chai = require('chai');
chai.use(require('chai-bn')(BigNumber));


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const configForTest = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
      }
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL,
        //blockNumber: 28965632
      },
    },
  },
  mocha: {
    timeout: 200000,
  },
};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const configLocal = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      }
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL,
        //blockNumber: 28965632,
      },
    },
    polygon: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 200000,
  },
};

module.exports = process.env.PRIVATE_KEY ? configLocal : configForTest;