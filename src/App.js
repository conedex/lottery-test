import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Lottery from "./components/Lottery";
import DonutLottery from "./components/DonutLottery";
import MultipleLottery from "./components/MultipleLottery";
import HighScore from "./components/HighScore";
import Staking from "./components/StakingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lottery" element={<Lottery />} />
        <Route path="/sponsoredlottery" element={<MultipleLottery />} />
        <Route path="/donutlottery" element={<DonutLottery />} />
        <Route path="/highscore" element={<HighScore />} />
        <Route path="/staking" element={<Staking />} />
      </Routes>
    </Router>
  );
};

export default App;
