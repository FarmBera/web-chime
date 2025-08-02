// import React from 'react';

import "./style/App.css";
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
