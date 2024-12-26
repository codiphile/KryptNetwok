# KryptNetwok

## Overview

KryptNetwok is a decentralized application (DApp) that enables users to transfer Ethereum securely from one MetaMask wallet to another. Leveraging React for the frontend and Ethereum smart contracts for the backend, KryptNetwok ensures transparent and reliable transactions on the blockchain.

## Features

- **Secure Transfers**: Safely send Ethereum between MetaMask wallets using smart contracts.
- **User-Friendly Interface**: Intuitive React-based UI for easy wallet connection and transaction handling.
- **Transaction History**: View all past transactions with detailed information.
- **Real-time Feedback**: Receive instant updates on transaction status.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Blockchain**: Ethereum, Ethers.js
- **Smart Contracts**: Solidity, Hardhat
- **APIs**: Giphy API for enhancing UI with GIFs based on transaction keywords

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [MetaMask](https://metamask.io/) extension installed in your browser.
- An Ethereum wallet with some test ETH on the Sepolia network.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/kryptnetwok.git
   cd kryptnetwok/client
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `client` directory and add your Giphy API key:

   ```env
   VITE_GIPHY_API=your_giphy_api_key
   ```

4. **Start the Application**

   ```bash
   npm run dev
   ```

   The application will be running at `http://localhost:5173` by default.

### Smart Contract Setup

1. **Navigate to the Smart Contract Directory**

   ```bash
   cd ../smart_contract
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Deploy Contracts**

   The smart contract is deployed on alchemy so create a wallet project on alchemy and paste the Alchemy api key in `hardhat.config.js`
   Also generate the `private key` in your `MetaMask` account
   The below command will deploy your smart contract to `alchemy`

   ```bash
   npx hardhat ignition deploy ./ignition/modules/Token.js --network sepolia
   ```

4. **Update Frontend Constants**

   After deployment, update the `contractAddress` and `contractABI` in `/client/src/utils/constants.js` with the deployed contract details.

## Usage

1. **Connect Wallet**

   Open the application and click on the "Connect Wallet" button to link your MetaMask account.

2. **Transfer Ethereum**

   Fill in the recipient's address, the amount of ETH to send, a keyword for the GIF, and an optional message. Click "Send now" to execute the transaction.

3. **View Transactions**

   All transactions will appear in the "Latest Transactions" section, complete with details and related GIFs.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is open-source and available under the [MIT License](LICENSE).
