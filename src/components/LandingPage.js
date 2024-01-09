import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./LandingPage.css";

// LandingPage component
const LandingPage = () => {
  return (
    <div>
      <div className="vanta-hero">
        <h1>Revolutionize Your Luck with Decentralized Gambling</h1>
        <p>
          Step into the future of gaming with our blockchain-powered lottery
          platform. Utilizing Chainlink's advanced services like Oracles,
          Upkeeps, and CCIP, we offer a secure and transparent way to multiply
          your earnings. Experience fair play and automated draws in a
          decentralized world
        </p>
      </div>
      <div className="content-section">
        <div className="lottery-section">
          <h2>Join the Coneheads Craze: Our Premier Bitcone Lottery</h2>
          <p>
            Dive into our pioneering lottery specifically crafted for the
            Coneheads community. Bet with Bitcone tokens and watch your fortune
            unfold. A slice of every jackpot enriches the Coneheads ecosystem,
            fostering community growth and shared success.
          </p>
          <Link to="/lottery">
            <Button type="default" size="large">
              Enter Bitcone Lottery
            </Button>
          </Link>
        </div>

        <div className="lottery-section">
          <h2>Coming Soon: The Cross Chain Extravaganza</h2>
          <p>
            Anticipate the thrill of our upcoming Cross Chain Lottery – a
            game-changer in the world of decentralized gambling. With CCIP
            integration, participate seamlessly across different blockchains.
            Your winnings, no matter the chain, are assuredly sent to you.
          </p>
          <Link to="/cross-chain-lottery">
            <Button type="default" size="large" disabled>
              Enter Cross Chain Lottery
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
