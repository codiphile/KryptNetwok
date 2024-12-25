import React, { useEffect, useState } from "react";

import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum); // Initialize the provider
  const signer = await provider.getSigner(); // Await the signer (required in v6)
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  ); // Connect the contract with the signer
  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        //getAllTransactions();
      } else {
        console.log("No Accounts Found");
      }

      console.log(accounts);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const getAllTransactions = async () => {
    try {
      if (!window.ethereum) {
        console.log("Ethereum is not present");
        return;
      }

      const transactionsContract = await createEthereumContract(); // Initialize the contract instance

      // Call the `getAllTransactions` function on the contract
      const availableTransactions =
        await transactionsContract.getAllTransactions();

      // Structure the transactions
      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.reciever,
          addressFrom: transaction.sender,
          timestamp: new Date(
            Number(transaction.timestamp) * 1000
          ).toLocaleString(), // Convert BigInt to number
          message: transaction.message,
          keyword: transaction.keyword,
          amount: Number(ethers.formatEther(transaction.amount)), // Use `ethers.formatEther` to format amount
        })
      );

      console.log(structuredTransactions);

      // Update the state with the structured transactions
      setTransactions(structuredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        return alert("Please install MetaMask");
      }

      // Get form data
      const { addressTo, amount, keyword, message } = formData;

      // Create contract instance
      const transactionsContract = await createEthereumContract(); // Use `await`

      // Parse the amount
      const parsedAmount = ethers.parseEther(amount);

      // Send Ether to the address
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount.toString(16), // Convert BigInt to hexadecimal
          },
        ],
      });

      // Call the contract function
      const transactionHash = await transactionsContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait(); // Wait for the transaction to be mined
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      // Get transaction count
      const transactionCount = await transactionsContract.getTransactionCount();
      setTransactionCount(Number(transactionCount)); // Convert BigInt to a number
      window.reload();
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExists();
    getAllTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
