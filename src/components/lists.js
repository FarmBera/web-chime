// import React from 'react';
import styled from "styled-components";

function Lists({ reminderList, onClickListDelBtn, onClickListStartBtn }) {
  return (
    <div className="Lists">
      <h2>Alert List Area</h2>
      <ListWrapper>
        {reminderList.length === 0 ? (
          <h3>Reminder is Empty!</h3>
        ) : (
          reminderList.map((item) => (
            <div className="body" key={item.id}>
              <p className="time">{item.time}</p>
              <p className="isEnabled">{String(item.isEnabled)}</p>
              <br></br>
              <p>{item.isAlarm ? "Alarm" : "Timer"} </p>
              <p className="note">{String(item.note)}</p>
              <br></br>
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

const ListWrapper = styled.div`
  .body {
    border: 1px solid #fff;
    width: 200px;
    /* height: auto; */
    text-align: center;
    align-items: center;
    margin: 0 auto;
    /* display: inline-block; */
    /* display: flexbox; */
    /* justify-content: center; */
    /* display: grid; */
    /* grid-template-columns: 1fr 1fr 1fr; */
  }

  p {
    display: inline-table;
    margin-top: 0;
    margin-bottom: 0;
  }

  .start {
    background-color: yellowgreen;
  }
  .stop {
    background-color: orange;
  }
`;

export default Lists;
