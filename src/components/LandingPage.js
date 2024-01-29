import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./LandingPage.css";
import bitconewinlogo from "../images/bitconewinlogo.png";

// LandingPage component
const LandingPage = () => {
  return (
    <div>
      <div className="vanta-hero">
        <img
          src={bitconewinlogo}
          alt="Bitconwin Logo"
          style={{ margin: "auto" }}
        />
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
          <h2>ConeDEX V2 - WorkInProgress</h2>
          <p>
            ConeDEX V2 is a Decentralized more modern Exchange built on the
            Polygon Network. Here you can grab some free Testnet CONE. The Site
            is a work in Progress, do not use it on Mainnet!
          </p>
          <a
            href="https://conedex.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="default" size="large">
              Enter ConeDEX
            </Button>
          </a>
        </div>
        <div className="lottery-section">
          <h2>ConeDEX V1- WorkInProgress</h2>
          <p>
            ConeDEX is a Decentralized Exchange built on the Polygon Network.
            Here you can grab some free Testnet CONE. The Site is a work in
            Progress, do not use it on Mainnet!
          </p>
          <a
            href="https://testnet.conedex.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="default" size="large">
              Enter ConeDEX
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
