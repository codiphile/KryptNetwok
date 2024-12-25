require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Import dotenv to load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_URL, // Use environment variable for URL
      accounts: [process.env.PRIVATE_KEY], // Use environment variable for private key
    },
  },
};
