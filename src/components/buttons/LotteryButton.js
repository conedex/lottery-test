import React from "react";
import "./LotteryButton.css";
import Bitcone from "../../images/bitcone192.png";
import Polygon from "../../images/polygonlogo.png";

function LotteryButton({ label, onClick }) {
  return (
    <button className="lottery-button" onClick={onClick}>
      {/*<img src={Bitcone} alt="Bitcone-Logo" className="Bitcone-icon" />*/}
      <img src={Polygon} alt="Polygon-Logo" className="Polygon-icon" />
      {label}
      <img src={Polygon} alt="Polygon-Logo" className="Polygon-icon" />
    </button>
  );
}

export default LotteryButton;
