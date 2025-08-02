// import React from 'react';
import { useEffect, useState } from "react";
import styled from "styled-components";
import Picker from "react-mobile-picker";
import Clock from "react-live-clock";

import "../style/clock-controller.css";
// import Lists from "./lists";

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

function convertToTimeStr(t) {
  const diff = new Date(t);
  // console.log(diff);

  const h = String(diff.getHours()).padStart(2, "0");
  const m = String(diff.getMinutes()).padStart(2, "0");
  const s = String(diff.getSeconds()).padStart(2, "0");

  // console.log(`${h}${m}${s}`);
  return `${h}${m}${s}`;
}
function convertToUnixTime(str) {
  const obj = new Date(str);
  console.log(obj, "(from convertToUnixTime)");
  return obj;
}

function getMode(m) {
  switch (m) {
    case 0:
      return "Clock";
    case 1:
      return "Custom Time";
    default:
      return null;
  }
}

let GLOBAL_ID = 3;

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
  const [mode, setMode] = useState(0); //TODO: rollback to '0'
  const [clock, setClock] = useState();
  const [reminder, setReminder] = useState([
    {
      id: 0,
      initime: "00:00:10",
      time: "00:00:10",
      isEnabled: false,
      isAlarm: false,
      isDone: false,
      note: null,
    },
  ]); //TODO: rollback to '[]'

  // on first loading
  // useEffect(() => {}, []);

  // update clock / check timer & alert
  useEffect(() => {
    // update clock continuously
    if (mode === 0) {
      try {
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
      } catch (e) {
        return;
      }
    }

    let r = reminder;
    for (let i = 0; i < r.length; i++) {
      // not enabled
      if (!r[i].isEnabled) continue;

      // check alarm time
      if (r[i].isAlarm && r[i].isEnabled) {
        if (clock.slice(0, 6) === r[i].time.slice(0, 6)) {
          console.log("Alarm Activated:", r[i].time);
          // TODO: notify
          r[i].isEnabled = false;
          r[i].isDone = true;
        }
      }

      // skip alarm
      if (r[i].isAlarm) continue;

      // (for timer only)
      let h, m, s;
      let t = r[i].time.split(":");

      h = Number(t[0]);
      m = Number(t[1]);
      s = Number(t[2]);

      if (--s < 0) {
        s = 59;
        if (--m < 0) {
          m = 59;
          if (--h < 0) {
            console.log("END TIMER");
            r[i].isEnabled = false;
            r[i].isDone = true;
            // TODO: notify
            continue;
          }
        }
      }

      r[i].time = `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(2, "0")}`;
    }
    setReminder(r);
  }, [clock]);

  // on change mode
  useEffect(() => {
    if (mode === 0) {
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

    if (mode !== 0) onClickResetBtn();
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
    if (mode === 0) return;
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

  const AddObject = (obj) => {
    obj = [...reminder, obj];
    console.log(obj);

    setReminder(obj);
    onClickResetBtn();
  };
  const onClickAlarmBtn = () => {
    if (mode === 0) return;

    const t = `${pickerHourValue.p0}${pickerHourValue.p1}:${pickerMinValue.p0}${pickerMinValue.p1}:${pickerSecValue.p0}${pickerSecValue.p1}`;

    let obj = {
      id: ++GLOBAL_ID,
      initime: t,
      time: t,
      isEnabled: true,
      isAlarm: true,
      isDone: false,
      note: null,
    };
    AddObject(obj);
  };
  const onClickTimerBtn = () => {
    if (mode === 0) return;

    const t = `${pickerHourValue.p0}${pickerHourValue.p1}:${pickerMinValue.p0}${pickerMinValue.p1}:${pickerSecValue.p0}${pickerSecValue.p1}`;

    let obj = {
      id: ++GLOBAL_ID,
      initime: t,
      time: t,
      isEnabled: true,
      isAlarm: false,
      isDone: false,
      note: null,
    };
    AddObject(obj);
  };

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

  // on click list area
  const onClickListDelBtn = (id) => {
    let r = reminder;
    for (let i = 0; i < r.length; i++) {
      if (r[i].id === id) {
        console.log(id, r[i].id);
        r.splice(i, 1);
        setReminder(r);
        break;
      }
    }
  };
  const onClickListStartBtn = (id) => {
    let r = reminder;
    for (let i = 0; i < r.length; i++) {
      let rr = r[i];
      // reset time
      if (rr.isDone) {
        rr.time = rr.initime;
        rr.isDone = false;
        setReminder(r);
      }
      // change isEnabled flag
      if (rr.id === id) {
        rr.isEnabled = !rr.isEnabled;
        setReminder(r);
        break;
      }
    }
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
      <p>Mode: {getMode(mode)}</p>

      {/* main button area */}
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
              {/* <td><button>Start</button></td><td><button>Stop</button></td> */}
              <td>
                <button onClick={onClickAlarmBtn}>Alarm</button>
              </td>
              <td>
                <button onClick={onClickTimerBtn}>Timer</button>
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

      {/* time button area */}
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

      <hr></hr>

      {/* timer, alarm list area */}
      <h2>Alert List Area</h2>
      <ListWrapper>
        {reminder.length === 0 ? (
          <h3>Reminder is Empty!</h3>
        ) : (
          reminder.map((item) => (
            <div className="body" key={item.id}>
              <p className="time">{item.isDone ? item.initime : item.time}</p>
              <p>/</p>
              {/* <p>{convertToTimeStr(clock, item.time)}</p> */}
              <p className="isEnabled">{String(item.isEnabled)}</p>
              <br></br>
              <p>{item.isAlarm ? "Alarm" : "Timer"} </p>
              <p>/</p>
              <p className="note">{String(item.note)}</p>
              <br></br>
              <p>{String(item.isDone)}</p>
              <button
                className={item.isEnabled ? "stop" : "start"}
                onClick={() => onClickListStartBtn(item.id)}
              >
                {item.isEnabled ? "Stop" : "Start"}
              </button>
              <button onClick={() => onClickListDelBtn(item.id)}>Del</button>
            </div>
          ))
        )}
      </ListWrapper>
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
  }
  td.pkch {
    /* width: 140px; */
  }
`;

const TableWrapper = styled.div`
  /* font-size: 20px; */
  display: inline-block;

  button {
    background-color: #282c34;
    color: lavender;
    border: 0.5px solid;
    /* border: none; */
    font-size: 20px;
    width: 100%;
    height: 100%;
  }
  button:hover {
    background-color: #61dafb;
    color: #000;
  }
  button:active {
    background-color: yellow;
  }
`;

const ListWrapper = styled.div`
  .body {
    border: 1px solid #fff;
    width: 200px;
    margin: 0 auto;
  }

  button {
    background-color: #282c34;
    color: #fff;
    border: 1px solid #fff;
  }
  button:hover {
    background-color: #61dafb;
    color: #000;
  }

  p {
    display: inline-table;
    margin-top: 0;
    margin-bottom: 0;
  }

  .start {
    background-color: yellowgreen;
    color: #000;
  }
  .stop {
    background-color: orange;
  }
`;
