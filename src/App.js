// import React from 'react';
import styled from "styled-components";
import Clock from "react-live-clock";

import "./style/App.css";
import Lists from "./components/lists";
import ClockController from "./components/clock-controller";
import Buttons from "./components/button";
import Headers from "./components/header";

function App() {
  return (
    <div className="App">
      <Headers />

      <hr></hr>

      <p>Current Time</p>
      <Clock format={"HH:mm:ss"} style={{ fontSize: "1.5em" }} ticking={true} />

      <hr></hr>

      <ClockController />

      <hr></hr>

      <Lists />
    </div>
  );
}

export default App;
