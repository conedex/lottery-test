import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, message, Alert, InputNumber } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import "./StakingPage.css";
import poolData from "../json/staking.json";
import bitcone192Image from "../images/bitcone192.png";
import polygon from "../images/polygonlogo.png";
import LOTTERY_ABI from "../abis/Lottery.json";
import TOKEN_ABI from "../abis/Token.json";

const { ethers } = require("ethers");
const RPC_PROVIDER_URL =
  "https://polygon-mumbai.g.alchemy.com/v2/GFlZaSYw8xngFQT_K2m0yGmRkRzZlg6E";
const CONTRACT_ADDRESS = "0x..."; // Your contract address here
const TOKEN_CONTRACT_ADDRESS = "0x..."; // Your token contract address here

function Staking() {
  const [pools, setPools] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [account, setAccount] = useState(null);

  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [newAllowance, setNewAllowance] = useState(10000);
  const [isContractPaused, setIsContractPaused] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const fetchContractPausedState = async () => {
    try {
      // Assuming your contract has a function called 'isPaused' that returns a boolean
      const paused = await contract.isPaused();
      setIsContractPaused(paused);
    } catch (error) {
      console.error("Error fetching contract paused state:", error);
    }
  };

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  useEffect(() => {
    const mappedPools = poolData.map((pool) => ({
      ...pool,
      image: pool.imageKey === "bitcone192" ? bitcone192Image : null,
      image2: pool.imageKey2 === "polygon" ? polygon : null,
    }));
    setPools(mappedPools);
  }, []);

  useEffect(() => {
    if (contract) {
      fetchContractPausedState();
    }
  }, [contract]); // Dependency array ensures this effect runs whenever the contract instance changes

  useEffect(() => {
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER_URL);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      LOTTERY_ABI,
      rpcProvider
    );
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_ABI,
      rpcProvider
    );

    setProvider(rpcProvider);
    setContract(contract);
    setTokenContract(tokenContract);

    if (window.ethereum) {
      window.ethereum.request({ method: "net_version" }).then((networkId) => {
        if (networkId === "80001") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            LOTTERY_ABI,
            provider
          );
          const tokenContract = new ethers.Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_ABI,
            provider
          );
          setProvider(provider);
          setContract(contract);
          setTokenContract(tokenContract);
          setWrongNetwork(false);
        } else {
          setWrongNetwork(true);
        }
      });

      window.ethereum.on("chainChanged", async () => {
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        if (networkId === "80001") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            LOTTERY_ABI,
            provider
          );
          const tokenContract = new ethers.Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_ABI,
            provider
          );
          setProvider(provider);
          setContract(contract);
          setTokenContract(tokenContract);
          setWrongNetwork(false);
        } else {
          setWrongNetwork(true);
          setErrorMessage("Please switch to the Polygon Mumbai Testnet.");
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    if (networkId !== "80001") {
      setWrongNetwork(true);
    } else {
      setAccount(accounts[0]);
      setWrongNetwork(false);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  {
    /*} const enterLottery = async () => {
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tokenContractWithSigner = tokenContract.connect(signer);

      // Check allowance
      const requiredAllowance = ethers.utils.parseUnits(
        (10001 * numEntries + 1).toString(),
        18
      ); // Multiply the required allowance by the number of entries
      const allowance = await tokenContractWithSigner.allowance(
        account,
        CONTRACT_ADDRESS
      );

      if (allowance.lt(requiredAllowance)) {
        // If allowance is less than required, ask for approval
        const allowanceMessageKey = "allowanceMessage";
        message.loading({
          content: "Processing Allowance for Contract...",
          key: allowanceMessageKey,
          duration: 30,
        });
        const tx = await tokenContractWithSigner.approve(
          CONTRACT_ADDRESS,
          requiredAllowance
        );
        await tx.wait();
        message.success({
          content: "Successfully granted Allowance",
          key: allowanceMessageKey,
          duration: 30,
        });

        // Check allowance again after approval
        const newAllowance = await tokenContractWithSigner.allowance(
          account,
          CONTRACT_ADDRESS
        );
        if (newAllowance.lt(requiredAllowance)) {
          // If allowance is still less than required, stop execution
          setErrorMessage("Please Approve Contract");
          return;
        }
      }

      // If allowance is sufficient, enter lottery
      const loadingMessageKey = "loadingMessage";
      message.loading({
        content: "Processing transaction...",
        key: loadingMessageKey,
      });
      const tx = await contractWithSigner.enterLottery(numEntries);
      await tx.wait();
      message.success({
        content: (
          <>
            Successfully entered the Lottery.
            <a
              href={`https://mumbai.polygonscan.com/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "10px" }}
            >
              Transaction Receipt
            </a>
          </>
        ),
        key: loadingMessageKey,
        duration: 30,
      });
      setTransactionHash(tx.hash);
      fetchLotteryInfo(); // Refresh lottery info
      setErrorMessage(null); // clear any previous error messages
    } catch (error) {
      console.error(error); // Log the error object to the console
      if (error.code === 4001) {
        // error code for user rejected transaction
        setErrorMessage("Transaction was not approved.");
      } else {
        setErrorMessage("An error occurred.");
      }
    }
  };

 

  useEffect(() => {
    if (contract) {
      fetchLotteryInfo();
    }
  }, [contract]);

  useEffect(() => {
    if (contract && account) {
      const fetchUserEntriesAndAllowance = async () => {
        const entries = await contract.getUserEntries(account);
        setUserEntries(entries.toString()); // Convert the BigNumber to a string

        const allowance = await tokenContract.allowance(
          account,
          CONTRACT_ADDRESS
        );
        setAllowance(ethers.utils.formatEther(allowance));
      };

      fetchUserEntriesAndAllowance();
    }
  }, [contract, account]);
*/
  }

  const increaseAllowance = async () => {
    const newAllowanceInWei = ethers.utils.parseEther(newAllowance.toString());

    const signer = provider.getSigner();
    const tokenContractWithSigner = tokenContract.connect(signer);

    const tx = await tokenContractWithSigner.approve(
      CONTRACT_ADDRESS,
      newAllowanceInWei
    );
    await tx.wait();

    // Refresh allowance
    const updatedAllowance = await tokenContractWithSigner.allowance(
      account,
      CONTRACT_ADDRESS
    );
    setAllowance(ethers.utils.formatEther(updatedAllowance));
  };
  function formatNumber(num) {
    return new Intl.NumberFormat().format(Math.floor(num));
  }

  return (
    <div className="lottery-app">
      <div className="App">
        <header className="App-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Link to="/">
                <LeftCircleOutlined
                  style={{
                    fontSize: "2rem",
                    color: "black",
                    marginRight: "90%",
                    marginLeft: "25%",
                  }}
                />
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {wrongNetwork ? (
                <button onClick={switchNetwork}>Wrong Network</button>
              ) : account ? (
                <>
                  <div className="header-right">
                    <div className="wallet-info" onClick={showModal}>
                      <img
                        src={polygon}
                        alt="Polygon Image"
                        className="wallet-image"
                        style={{ marginRight: "10px" }}
                      />
                      {account.substring(0, 5) +
                        "..." +
                        account.substring(account.length - 3)}
                    </div>
                  </div>
                  <div style={{ width: 0 }}>
                    <Modal
                      title="Profile"
                      open={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleOk}
                      footer={null}
                    >
                      <p className="modal-wallet-info">
                        Account Wallet:{" "}
                        <a
                          href={`https://mumbai.polygonscan.com/address/${account}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {account}
                        </a>
                      </p>
                      <p className="modal-wallet-info">
                        Allowance given: <strong>{allowance}</strong>
                      </p>
                      <InputNumber
                        min={1}
                        defaultValue={10000}
                        onChange={(value) => setNewAllowance(value)}
                      />
                      <button onClick={increaseAllowance}>
                        Change Allowance
                      </button>
                    </Modal>
                  </div>
                </>
              ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
              )}
            </div>
          </div>
        </header>
        <main>
          <h1>Staking</h1>
          {/*<Alert
            type="warning"
            description="For the best experience access our Lottery with a Browser on a Desktop."
            showIcon={true}
            className="alert"
              />*/}
          <div className="staking-info">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reward</th>
                  <th>TVL</th>
                  <th>APR</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((pool, index) => (
                  <React.Fragment key={index}>
                    <tr
                      onClick={() => toggleRow(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <img
                          src={pool.image}
                          alt={pool.name}
                          className="pool-image"
                        />
                        {pool.name}
                      </td>
                      <td>
                        <img
                          src={pool.image2}
                          alt={pool.reward}
                          className="pool-image"
                        />
                        {pool.reward}
                      </td>
                      <td>{pool.tvl}</td>
                      <td>{pool.apr}</td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan="4">
                          <div className="pool-details">
                            <div className="pool-detail">
                              Amount Staked: <span></span>
                              <button>Stake</button>
                            </div>
                            <div className="pool-detail">
                              Rewards Earned: <span></span>
                              <button>Withdraw</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Staking;
