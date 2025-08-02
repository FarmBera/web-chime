// import React from 'react';
import styled from "styled-components";
import Clock from "react-live-clock";

import "./style/App.css";
import Lists from "./components/lists";
import ClockController from "./components/clock-controller";
import Headers from "./components/header";

function App() {
  return (
    <div className="App">
      <Headers />

      <hr></hr>

      <ClockController />
    </div>
  );
}

export default App;
