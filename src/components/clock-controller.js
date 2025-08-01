// import React from 'react';
import { useEffect, useState } from "react";
import styled from "styled-components";
import Picker from "react-mobile-picker";
import Clock from "react-live-clock";

import "../style/clock-controller.css";

/* Picker variables */
// settings
const wheelmod = "normal";

// numbers
const nums = Array.from({ length: 10 }, (_, i) => i);
const nums_lim = Array.from({ length: 6 }, (_, i) => i);

function renderOptions(selections) {
  return Object.keys(selections).map((name) => (
    <Picker.Column key={name} name={name}>
      {selections[name].map((option) => (
        <Picker.Item key={option} value={option}>
          {({ selected }) => (
            <div className={selected ? `selected` : "text-neutral"}>
              {option}
            </div>
          )}
        </Picker.Item>
      ))}
    </Picker.Column>
  ));
}

// nums_lim.at(-1) // Array: access last index
function ClockController() {
  const [selections_hour, setSelection_hour] = useState({
    p0: nums_lim,
    p1: nums,
  });
  const [selections_min, setSelection_min] = useState({
    p0: nums_lim,
    p1: nums,
  });
  const [selections_sec, setSelection_sec] = useState({
    p0: nums_lim,
    p1: nums,
  });

  const [pickerHourValue, setPickerHourValue] = useState({ p0: 0, p1: 0 });
  const [pickerMinValue, setPickerMinValue] = useState({ p0: 0, p1: 0 });
  const [pickerSecValue, setPickerSecValue] = useState({ p0: 0, p1: 0 });
  /** mode
   * 0: clock
   * 1: custom time (timer)
   */
  const [mode, setMode] = useState(0);
  const [clock, setClock] = useState("");
  const [reminder, setReminder] = useState([]);

  // on first loading
  // useEffect(() => {}, []);

  // update clock / check timer & alert
  useEffect(() => {
    if (mode == 0) {
      let s = "";
      s = clock.slice(0, 2);
      setPickerHourValue({
        p0: Number(clock.slice(0, 1)),
        p1: Number(clock.slice(1, 2)),
      });
      setPickerMinValue({
        p0: Number(clock.slice(3, 4)),
        p1: Number(clock.slice(4, 5)),
      });
      setPickerSecValue({
        p0: Number(clock.slice(6, 7)),
        p1: Number(clock.slice(7, 8)),
      });
    }
  }, [clock]);

  // on change mode
  useEffect(() => {
    if (mode == 0) {
      setSelection_hour({
        p0: Array.from({ length: 3 }, (_, i) => i),
        p1: nums,
      });
    } else {
      setSelection_hour({
        p0: nums_lim,
        p1: nums,
      });
    }

    if (mode != 0) onClickResetBtn();
  }, [mode]);

  // auto update clock variable
  const onChangeClockTime = (t) => {
    // console.log(t); // 1754053077959

    const date = new Date(t);

    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");

    setClock(`${h}:${m}:${s}`);
  };

  const onClickResetBtn = () => {
    setPickerHourValue({ p0: 0, p1: 0 });
    setPickerMinValue({ p0: 0, p1: 0 });
    setPickerSecValue({ p0: 0, p1: 0 });
    // setMode(0);
  };

  const onClickModeBtn = () => {
    let m = mode;
    if (++m > 1) {
      setMode(0);
      return;
    }
    setMode(m);
  };

  const onClickAlarmBtn = () => {
    let obj = [];

    // insert processing logic

    setReminder([...reminder, obj]);
    return null;
  };

  const onClickStartBtn = () => {
    return null;
  };

  const onClickStopBtn = () => {};

  const onClickValueBtn = (n, type) => {
    let value = 0;

    if (type === "h")
      value = Number(`${pickerHourValue.p0}${pickerHourValue.p1}`);
    else if (type === "m")
      value = Number(`${pickerMinValue.p0}${pickerMinValue.p1}`);
    else if (type === "s")
      value = Number(`${pickerSecValue.p0}${pickerSecValue.p1}`);
    else
      console.error(
        `Something went wrong (from onClickValueBtn/switch(type))\n${n}${type}`
      );

    // add amount
    value += n;

    // START OF overflow check
    let ten = 0;
    let one = 0;
    const isTwo = (val) => {
      return String(val).split("").length >= 2 ? true : false;
    };
    // overflow check
    if (value >= 60) {
      value -= 60;

      if (type === "m") {
        let t_p0 = pickerHourValue.p0;
        let t_p1 = pickerHourValue.p1;
        if (++t_p1 > 9) t_p0++;
        setPickerHourValue({ p0: t_p0, p1: t_p1 });
      }

      if (type === "s") {
        let t_p0 = pickerMinValue.p0;
        let t_p1 = pickerMinValue.p1;
        if (++t_p1 > 9) t_p0++;
        setPickerMinValue({ p0: t_p0, p1: t_p1 });
      }
    }
    // END OF overflow check

    if (isTwo(value)) [ten, one] = String(value).split("").map(Number);
    else one = value;

    // set values
    if (type === "h") setPickerHourValue({ p0: ten, p1: one });
    else if (type === "m") setPickerMinValue({ p0: ten, p1: one });
    else if (type === "s") setPickerSecValue({ p0: ten, p1: one });
    else
      console.error(
        `Something went wrong (from onClickValueBtn, set values)\n${n}${type}`
      );
  };

  return (
    <div className="ClockController">
      {/* <h1>Current Time</h1> */}

      {/* clock area */}
      <Clock
        className="hidden"
        format={"HH:mm:ss"}
        style={{ fontSize: "4em" }}
        ticking={true}
        onChange={onChangeClockTime}
      />

      <div></div>
      <p>Mode: {mode}</p>

      {/* button area */}
      <TableWrapper>
        <table className="main">
          <tbody>
            <tr>
              <td>
                <button onClick={onClickResetBtn}>Reset</button>
              </td>
              <td>
                <button onClick={onClickModeBtn}>Mode</button>
              </td>
              <td>
                <button>Start</button>
              </td>
              <td>
                <button>Stop</button>
              </td>
              <td>
                <button>Alarm</button>
              </td>
            </tr>
          </tbody>
        </table>
        {/* <h1>Time Setup</h1> */}
      </TableWrapper>

      <div></div>

      {/* time picker area */}
      <PickerWrapper>
        <div>
          <table>
            <thead>
              <tr>
                <td>Hour</td>
                <td></td>
                <td>Minute</td>
                <td></td>
                <td>Seconds</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pkc pkch">
                  <Picker
                    value={pickerHourValue}
                    onChange={setPickerHourValue}
                    wheelMode={wheelmod}
                  >
                    {renderOptions(selections_hour)}
                  </Picker>
                </td>
                <td className="col">:</td>
                <td className="pkc">
                  <Picker
                    value={pickerMinValue}
                    onChange={setPickerMinValue}
                    wheelMode={wheelmod}
                  >
                    {renderOptions(selections_min)}
                  </Picker>
                </td>
                <td className="col">:</td>
                <td className="pkc">
                  <Picker
                    value={pickerSecValue}
                    onChange={setPickerSecValue}
                    wheelMode={wheelmod}
                  >
                    {renderOptions(selections_sec)}
                  </Picker>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PickerWrapper>

      <br></br>

      {/* button area */}
      <TableWrapper>
        <table>
          <tbody>
            <tr>
              <td>
                <button onClick={() => onClickValueBtn(1, "s")}>1s</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(3, "s")}>3s</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(5, "s")}>5s</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(10, "s")}>10s</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(15, "s")}>15s</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(20, "s")}>20s</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(30, "s")}>30s</button>
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={() => onClickValueBtn(1, "m")}>1m</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(3, "m")}>3m</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(5, "m")}>5m</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(10, "m")}>10m</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(15, "m")}>15m</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(20, "m")}>20m</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(30, "m")}>30m</button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>
                <button onClick={() => onClickValueBtn(1, "h")}>1h</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(2, "h")}>2h</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(3, "h")}>3h</button>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}

export default ClockController;

const PickerWrapper = styled.div`
  font-size: 20px;
  /* width: 100px; */
  /* display: flex; */
  /* position: absolute; */
  display: inline-block;
  /* display: table-column; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* grid-template-rows: 1fr 1fr 1fr; */

  .text-neutral {
    color: #666;
  }

  .selected {
    color: white;
    font-weight: bold;
  }

  /* size: 20px; */
  /* text-align: center; */
  /* align-items: center; */
  table {
    /* width: 00px; */
  }

  .main > th {
    width: 300px;
  }

  td.col {
    font-size: 20px;
  }
  td.pkc {
    font-size: 25px;
    width: 90px;
    /* padding-left: 30px;
    padding-right: 30px; */
  }
  td.pkch {
    /* width: 140px; */
  }
`;

const TableWrapper = styled.div`
  /* font-size: 20px; */
  display: inline-block;
  button {
    font-size: 20px;
    width: 100%;
    height: 100%;
  }
`;

//////////////////////
// import { useState } from "react";
// import Picker from "react-mobile-picker";

// const selections = {
//   title: ["Mr.", "Mrs.", "Ms.", "Dr."],
//   firstName: ["John", "Micheal", "Elizabeth"],
//   lastName: ["Lennon", "Jackson", "Jordan", "Legend", "Taylor"],
// };

// function MyPicker() {
//   const [pickerValue, setPickerValue] = useState({
//     title: "Mr.",
//     firstName: "Micheal",
//     lastName: "Jordan",
//   });

//   return (
//     <Picker value={pickerValue} onChange={setPickerValue}>
//       {Object.keys(selections).map((name) => (
//         <Picker.Column key={name} name={name}>
//           {selections[name].map((option) => (
//             <Picker.Item key={option} value={option}>
//               {option}
//             </Picker.Item>
//           ))}
//         </Picker.Column>
//       ))}
//     </Picker>
//   );
// }

// export default MyPicker;
