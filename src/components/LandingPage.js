import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header.js";
import LotteryButton from "../components/buttons/LotteryButton.js";
import "./newlandingpage.css";
import Donut from "../images/donuts_icon.png";
import Shroom from "../images/Mushroom_Logo.png";
import ETH from "../images/eth-logo.png";

const NewLandingPage = () => {
  const [showLotteries, setShowLotteries] = useState(false);

  const toggleLotteries = () => {
    setShowLotteries(!showLotteries);
  };

  return (
    <div className="LandingPage">
      <Header />

      <button className="main-lottery-button" onClick={toggleLotteries}>
        Lottery
      </button>
      {showLotteries && (
        <>
          <Link to="/lottery" className="Link">
            <LotteryButton label="BITCONE LOTTERY" />
          </Link>
          <Link to="/donutlottery" className="Link">
            <LotteryButton label="DONUT LOTTERY" />
          </Link>
          <Link to="/shroomlottery" className="Link">
            <LotteryButton label="SHROOM LOTTERY" />
          </Link>
        </>
      )}
      <Link to="/highscore">
        <button className="highscore-page-button">Highscores</button>
      </Link>
    </div>
  );
};

export default NewLandingPage;
