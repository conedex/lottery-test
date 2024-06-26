import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header.js";
import LotteryButton from "../components/buttons/LotteryButton.js";
import DonutButton from "../components/buttons/DonutButton.js";
import ShroomButton from "../components/buttons/ShroomButton.js";
import "./newlandingpage.css";
import Shroom from "../images/Mushroom_Logo.png";

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
            <DonutButton label="DONUT LOTTERY" />
          </Link>
          <Link to="/shroomlottery" className="Link">
            <ShroomButton label="SHROOM LOTTERY" />
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
