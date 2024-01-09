import React, { useState, useEffect } from "react";
import { Collapse, Modal, message, Alert } from "antd";
import polygonLogo from "../images/polygonlogo.png";
import bitconeLogo from "../images/bitcone192.png";
import LOTTERY_ABI from "../abis/Lottery.json";
import TOKEN_ABI from "../abis/Token.json";
import "./Lottery.css";

const { ethers } = require("ethers");

const { Panel } = Collapse;

const CONTRACT_ADDRESS = "0xF038747b6A3D44b03E7EFD7AC21c539701C95DAe";
const TOKEN_CONTRACT_ADDRESS = "0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [currentPool, setCurrentPool] = useState(0);
  const [lastWinner, setLastWinner] = useState("");
  const [lastPrize, setLastPrize] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "net_version" }).then((networkId) => {
        if (networkId === "137") {
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
      window.ethereum.on("chainChanged", (chainId) => {
        if (parseInt(chainId, 16) === 137) {
          setWrongNetwork(false);
          // Re-initialize your contracts here if needed
        } else {
          setWrongNetwork(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const difference = tomorrow - now;

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    if (networkId !== "137") {
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
        params: [{ chainId: "0x89" }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLotteryInfo = async () => {
    const pool = await contract.getCurrentPool();
    const winner = await contract.getLastWinner();
    const prize = await contract.getLastPrize();
    setCurrentPool(ethers.utils.formatEther(pool));
    setLastWinner(winner);
    setLastPrize(ethers.utils.formatEther(prize));
  };

  const enterLottery = async () => {
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tokenContractWithSigner = tokenContract.connect(signer);

      // Check allowance
      const allowance = await tokenContractWithSigner.allowance(
        account,
        CONTRACT_ADDRESS
      );
      const requiredAllowance = ethers.utils.parseUnits("1000000", 18); // 1000000 tokens with 18 decimals

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
          duration: 60,
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
      const tx = await contractWithSigner.enterLottery();
      await tx.wait();
      message.success({
        content: (
          <>
            Successfully entered the Lottery.
            <a
              href={`https://polygonscan.com/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "10px" }}
            >
              Transaction Receipt
            </a>
          </>
        ),
        key: loadingMessageKey,
        duration: 60,
      });
      setTransactionHash(tx.hash);
      fetchLotteryInfo();
      setErrorMessage(null); // clear any previous error messages
    } catch (error) {
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

  function formatNumber(num) {
    return new Intl.NumberFormat().format(Math.floor(num));
  }

  return (
    <div className="lottery-app">
      <div className="App">
        <header className="App-header">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {wrongNetwork ? (
              <button onClick={switchNetwork}>Wrong Network</button>
            ) : account ? (
              <>
                <div className="header-right">
                  <div className="wallet-info" onClick={showModal}>
                    <img
                      src={polygonLogo}
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
                        href={`https://polygonscan.com/address/${account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {account}
                      </a>
                    </p>
                  </Modal>
                </div>
              </>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </div>
        </header>
        <main>
          <h1>
            <img
              src={bitconeLogo}
              alt="Bitcone Logo Left"
              className="bitcone-header"
              style={{ marginRight: "1%", marginLeft: "1%" }}
            />
            BitCone Lottery
            <img
              src={bitconeLogo}
              alt="Bitcone Logo Left"
              className="bitcone-header"
              style={{ marginRight: "1%", marginLeft: "1%" }}
            />
          </h1>
          <Alert
            type="warning"
            description="For optimal experience, please access our Lottery using a desktop browser instead of a mobile wallet's in-app browser."
            showIcon={true}
            className="alert"
          />
          <div className="lottery-info">
            <p>Next pull in: {countdown}</p>
            <p>Amount in current Lottery: {formatNumber(currentPool)} CONE</p>
            <p>Entry Amount: 10.000 CONE</p>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button onClick={enterLottery} disabled={!account}>
              Enter Lottery
            </button>
          </div>
          <div className="lastWinner">
            <p>
              Last Winner:{" "}
              {lastWinner.substring(0, 5) +
                "..." +
                lastWinner.substring(lastWinner.length - 3)}
            </p>
            <p>Last amount won: {formatNumber(lastPrize)} CONE</p>
          </div>
          <div className="faq-section">
            <h2>FAQs</h2>
            <Collapse defaultActiveKey={["0"]} className="faq-collapse">
              <Panel header="How does this Lottery work?" key="1">
                <p>
                  Users can purchase Lottery Tickets for a fixed price in CONE
                  per Ticket. At the end of each Lottery round a winning ticket
                  is randomly selected to win the Prize Pot!
                </p>
              </Panel>
              <Panel header="How often is a winner selected?" key="2">
                <p>
                  A winner is selected at the end of each Lottery round. Each
                  round lasts for 7 days, you may view the next Winner pull date
                  at the top of the website!
                </p>
              </Panel>
              <Panel header="How are winners selected?" key="3">
                <p>
                  Our Lottery Smart Contract uses Chainlink VRF to guarantee
                  100% unpredictable randomness when selecting a winning ticket.
                  We also utilize Chainlink Upkeeps to keep the contract running
                  automatically.
                </p>
              </Panel>
              <Panel header="How many tickets can I buy?" key="4">
                <p>
                  The current fee for an entry ticket is 1,000,000 CONE. Each
                  user can purchase an unlimited amount of tickets, but only 1
                  ticket can be purchased per transaction.
                </p>
              </Panel>
              <Panel header="Is there any kind of fee to play?" key="5">
                <p>
                  There is no fee to purchase Lottery Tickets, but there is a
                  10% fee on the Prize Pool. 5% of which goes to the Bitcone
                  Treasury Wallet, along with a 5% fee which goes to the Creator
                  to cover $LINK Chainlink utilization costs on every
                  transaction, as well as operational and hosting costs.
                </p>
              </Panel>
              <Panel
                header="What are the benefits of using this Lottery?"
                key="6"
              >
                <p>
                  The Lottery Smart contract is immutable, this means the owner
                  can not influnce the outcome of the Lottery. Using this smart
                  contract ensures that each Ticket gets an equal chance to win!
                </p>
              </Panel>
            </Collapse>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
