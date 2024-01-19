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
          <h2>What is BitCone?</h2>
          <p>
            BitCone (CONE) is a Decentralized Community Utility Token made by
            Cones, for Cones. 608 Billion tokens were created on the Polygon
            Network (with no mint function) to parallel the 608 Cone Head -
            Reddit Collectible Avatar NFT, that inspired a meme Conemunity.
            BitCone is governed democratically, so every decision is voted on
            via Conemunity Polls. BitCones can be earned through Airdrops and
            "BitCone Mining", a revolutionary automated content monetization
            platform, that incentivizes user engagement on partnered Subreddits.
          </p>
          <Link to="https://bitcone.lol/">
            <Button type="default" size="large">
              Click for more information
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
