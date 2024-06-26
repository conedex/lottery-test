import React from "react";
import "./DonutButton.css";
import Donut from "../../images/donuts_icon.png";
import ETH from "../../images/eth-logo.png";

function DonutButton({ label, onClick }) {
  return (
    <button className="lottery-button" onClick={onClick}>
      {/*<img src={Donut} alt="Bitcone-Logo" className="Donut-icon" />*/}
      <img src={ETH} alt="Polygon-Logo" className="ETH-icon" />
      {label}
      <img src={ETH} alt="Polygon-Logo" className="ETH-icon" />
    </button>
  );
}

export default DonutButton;
