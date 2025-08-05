import { useEffect, useState } from "react";
import styled from "styled-components";
import Picker from "react-mobile-picker";
import Clock from "react-live-clock";
import useSound from "use-sound";

import "../style/clock-controller.css";

// sounds
// import sfx_hintblock from "../audio/hintBlock.mp3";
// import sfx_loa_bell from "../audio/loa_sfx_bell.wav";
import ui_click_active from "../audio/pop-down.mp3";
import ui_click_after_up from "../audio/pop-up-on.mp3";
import ui_click_hover from "../audio/ui-click-hover.wav";
import sfx_alert from "../audio/s-tickles.mp3";

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

let GLOBAL_ID = 3;
const MODE_NAME = ["Clock", "Set Time"];
const BTN_STATE = ["Disabled", "Enabled"];

// nums_lim.at(-1) // Array: access last index
function ClockController() {
  const selections_hour = {
    p0: Array.from({ length: 3 }, (_, i) => i),
    p1: nums,
  };
  const selections_min = {
    p0: nums_lim,
    p1: nums,
  };
  const selections_sec = {
    p0: nums_lim,
    p1: nums,
  };

  const [pickerHourValue, setPickerHourValue] = useState({ p0: 0, p1: 0 });
  const [pickerMinValue, setPickerMinValue] = useState({ p0: 0, p1: 0 });
  const [pickerSecValue, setPickerSecValue] = useState({ p0: 0, p1: 0 });

  const [chimeCycle, setChimeCycle] = useState(60);

  /** mode desc
   * 0: clock
   * 1: custom time (timer)
   */
  const [mode, setMode] = useState(0);
  const [clock, setClock] = useState();
  const [reminder, setReminder] = useState([
    {
      id: 0,
      initime: "00:00:10",
      time: "00:00:10",
      isEnabled: false,
      isAlarm: true,
      isDone: false,
      note: null,
    },
  ]); //TODO: rollback to '[]'

  // const [sfxUIHover] = useSound(ui_click_hover);
  const [sfxUIActive] = useSound(ui_click_active);
  const [sfxUIAfterUp] = useSound(ui_click_after_up);
  const [sfxAlert] = useSound(sfx_alert);

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

    let IS_UPDATED = false;
    let r = reminder;
    for (let i = 0; i < r.length; i++) {
      let rr = r[i];
      // not enabled
      if (!rr.isEnabled) continue;

      // check alarm time
      if (rr.isAlarm && rr.isEnabled) {
        if (clock.slice(0, 6) === rr.time.slice(0, 6)) {
          console.log("Alarm Activated:", rr.time);
          sfxAlert();
          rr.isEnabled = false;
          rr.isDone = true;
          IS_UPDATED = true;
        }
      }
    }
    if (IS_UPDATED) setReminder(r);
  }, [clock, mode, reminder, sfxAlert]);

  // on change mode
  useEffect(() => {
    onClickResetBtn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // main button area func
  const onClickResetBtn = () => {
    if (mode === 0) return;
    setPickerHourValue({ p0: 0, p1: 0 });
    setPickerMinValue({ p0: 0, p1: 0 });
    setPickerSecValue({ p0: 0, p1: 0 });
  };

  const onClickModeBtn = () => {
    let m = mode;
    if (++m > 1) setMode(0);
    else setMode(m);
  };

  const onClickCurrBtn = () => {
    if (mode === 0) return;
    const t = clock.split(":");
    setPickerHourValue({
      p0: Number(t[0].slice(0, 1)),
      p1: Number(t[0].slice(1, 2)),
    });
    setPickerMinValue({
      p0: Number(t[1].slice(0, 1)),
      p1: Number(t[1].slice(1, 2)),
    });
    setPickerSecValue({
      p0: Number(t[2].slice(0, 1)),
      p1: Number(t[2].slice(1, 2)),
    });
  };
  const AddObject = (obj) => {
    obj = [...reminder, obj];
    // console.log(obj);

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

  // chime cycle handler
  const onChangeSelection = (e) => {
    console.log(e);
  };
  // time buttons
  const onClickValueBtn = (n, type) => {
    if (mode === 0) return;

    const h = Number(`${pickerHourValue.p0}${pickerHourValue.p1}`);
    const m = Number(`${pickerMinValue.p0}${pickerMinValue.p1}`);
    const s = Number(`${pickerSecValue.p0}${pickerSecValue.p1}`);

    const date = new Date();
    date.setHours(h, m, s);

    if (type === "h") date.setHours(date.getHours() + n);
    else if (type === "m") date.setMinutes(date.getMinutes() + n);
    else if (type === "s") date.setSeconds(date.getSeconds() + n);

    const newHours = String(date.getHours()).padStart(2, "0");
    const newMinutes = String(date.getMinutes()).padStart(2, "0");
    const newSeconds = String(date.getSeconds()).padStart(2, "0");

    setPickerHourValue({
      p0: Number(newHours[0]),
      p1: Number(newHours[1]),
    });
    setPickerMinValue({
      p0: Number(newMinutes[0]),
      p1: Number(newMinutes[1]),
    });
    setPickerSecValue({
      p0: Number(newSeconds[0]),
      p1: Number(newSeconds[1]),
    });
  }; // END OF onClickValueBtn

  // on click list area
  const onClickListDelBtn = (id) => {
    let r = reminder;
    for (let i = 0; i < r.length; i++) {
      if (r[i].id === id) {
        // console.log(id, r[i].id);
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

      {/* <div></div><p>Mode: {getMode(mode)}</p> */}

      {/* main button area */}
      <TableWrapper>
        <table className="main">
          <tbody>
            <tr>
              <td>
                <button
                  onClick={onClickResetBtn}
                  onMouseDown={sfxUIActive}
                  onMouseUp={sfxUIAfterUp}
                  // onMouseEnter={sfxUIHover}
                  className={BTN_STATE[mode]}
                >
                  Reset
                </button>
              </td>
              <td>
                <button onClick={onClickModeBtn}>
                  Mode: {MODE_NAME[mode]}
                </button>
              </td>
              <td>
                <button onClick={onClickCurrBtn}>Current</button>
              </td>
              <td>
                <button onClick={onClickAlarmBtn} className={BTN_STATE[mode]}>
                  Add Alarm
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {/* <h1>Time Setup</h1> */}
      </TableWrapper>

      <br></br>

      <SelectorWrapper>
        <label className="label">Chime Cycle: </label>

        <select className="selection" onChange={(e) => onChangeSelection(e)}>
          <optgroup label="">
            <option value="none">None</option>
          </optgroup>
          <optgroup label="Minute">
            <option value="1">1m</option>
            <option value="5">5m</option>
            <option value="10">10m</option>
            <option value="15">15m</option>
            <option value="30">30m</option>
          </optgroup>
          <optgroup label="Hour">
            <option value="60" selected>
              1h
            </option>
            <option value="120">2h</option>
            <option value="180">3h</option>
            <option value="240">4h</option>
            <option value="300">5h</option>
          </optgroup>
          <optgroup label="Custom">
            <option value="custom">Custom</option>
          </optgroup>
        </select>
      </SelectorWrapper>

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
              <td>
                <button onClick={() => onClickValueBtn(1, "h")}>1h</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(2, "h")}>2h</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(3, "h")}>3h</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(5, "h")}>5h</button>
              </td>
              <td>
                <button onClick={() => onClickValueBtn(10, "h")}>10h</button>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </TableWrapper>

      <hr></hr>

      {/* timer, alarm list area */}
      <h2>Alert List</h2>
      <ListWrapper>
        {reminder.length === 0 ? (
          <div>
            <h3>Reminder is Empty!</h3>
            <p>You can add your own Alarm</p>
          </div>
        ) : (
          reminder.map((item) => (
            <div className="body" key={item.id}>
              <p className="time">{item.isDone ? item.initime : item.time}</p>
              &nbsp;
              <p>Alarm</p>
              <br></br>
              <p className="note">{String(item.note)}</p>
              <br></br>
              <p>isDone:</p>&nbsp;
              <p>{String(item.isDone)}</p>
              <br></br>
              <button
                className={BTN_STATE[Number(item.isEnabled)]}
                onClick={() => onClickListStartBtn(item.id)}
              >
                {BTN_STATE[Number(item.isEnabled)]}
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

const colorBg = "#282c34";
const PickerWrapper = styled.div`
  font-size: 20px;
  display: inline-block;

  .text-neutral {
    color: #666;
  }

  .selected {
    color: white;
    font-weight: bold;
  }

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
    background-color: ${colorBg};
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

const SelectorWrapper = styled.div`
  .selection {
    background-color: ${colorBg};
    color: #fff;
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

  .Enabled {
    background-color: yellowgreen;
    color: #000;
  }
  .Disabled {
    background-color: orange;
    color: #000;
  }
`;
