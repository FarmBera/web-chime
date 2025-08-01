// import React from 'react';
import { useState } from "react";
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

// selections
const selections_hour = { p0: nums_lim, p1: nums };
const selections_min = { p0: nums_lim, p1: nums };
const selections_sec = { p0: nums_lim, p1: nums };

// nums_lim.at(-1) // Array: access last index
function ClockController() {
  const [pickerHourValue, setPickerHourValue] = useState({ p0: 0, p1: 0 });
  const [pickerMinValue, setPickerMinValue] = useState({ p0: 0, p1: 0 });
  const [pickerSecValue, setPickerSecValue] = useState({ p0: 0, p1: 0 });
  const [clock, setClock] = useState("");

  const onChangeClockTime = (t) => {
    // setClock(t);
    // console.log(t); // 1754053077959

    const date = new Date(t);

    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");

    const formattedTime = `${h}:${m}:${s}`;

    setClock(formattedTime);
    console.log(clock);
  };

  const onClickResetBtn = () => {
    setPickerHourValue({ p0: 0, p1: 0 });
    setPickerMinValue({ p0: 0, p1: 0 });
    setPickerSecValue({ p0: 0, p1: 0 });
    // console.log("Reset Time");
  };

  const onClickValueBtn = (n, type) => {
    let value = null;

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

    // console.log(`pressed: ${n}${type}\nprev/new: ${value}`);
  };

  return (
    <div className="ClockController">
      {/* <h1>Current Time</h1> */}
      <Clock
        format={"HH:mm:ss"}
        style={{ fontSize: "4em" }}
        ticking={true}
        onChange={onChangeClockTime}
      />
      <div>
        {/* <h1>Time Setup</h1> */}
        <button onClick={() => onClickResetBtn}>Reset</button>
      </div>

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
                    // style={pickerStyle}
                  >
                    {Object.keys(selections_hour).map((name) => (
                      <Picker.Column key={name} name={name}>
                        {selections_hour[name].map((option) => (
                          <Picker.Item key={option} value={option}>
                            {option}
                          </Picker.Item>
                        ))}
                      </Picker.Column>
                    ))}
                  </Picker>
                </td>
                <td className="col">:</td>
                <td className="pkc">
                  <Picker
                    value={pickerMinValue}
                    onChange={setPickerMinValue}
                    wheelMode={wheelmod}
                    // style={pickerStyle}
                  >
                    {Object.keys(selections_min).map((name) => (
                      <Picker.Column key={name} name={name}>
                        {selections_min[name].map((option) => (
                          <Picker.Item key={option} value={option}>
                            {option}
                          </Picker.Item>
                        ))}
                      </Picker.Column>
                    ))}
                  </Picker>
                </td>
                <td className="col">:</td>
                <td className="pkc">
                  <Picker
                    value={pickerSecValue}
                    onChange={setPickerSecValue}
                    wheelMode={wheelmod}
                    // style={pickerStyle}
                  >
                    {Object.keys(selections_sec).map((name) => (
                      <Picker.Column key={name} name={name}>
                        {selections_sec[name].map((option) => (
                          <Picker.Item key={option} value={option}>
                            {option}
                          </Picker.Item>
                        ))}
                      </Picker.Column>
                    ))}
                  </Picker>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PickerWrapper>

      <br></br>

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
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}

export default ClockController;

const PickerWrapper = styled.div`
  /* width: 100px; */
  /* display: flex; */
  /* position: absolute; */
  display: inline-block;
  /* display: table-column; */
  /* grid-template-columns: 1fr 1fr 1fr; */
  /* grid-template-rows: 1fr 1fr 1fr; */
  /* size: 20px; */
  /* text-align: center; */
  /* align-items: center; */
  table {
    /* width: 00px; */
  }
  td.col {
    font-size: 20px;
  }
  td.pkc {
    font-size: 20px;
    width: 100px;
    /* padding-left: 30px;
    padding-right: 30px; */
  }
  td.pkch {
    width: 140px;
  }
`;

const TableWrapper = styled.div`
  display: inline-block;
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
