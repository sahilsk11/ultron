import React, { useState, useEffect, useRef } from "react";
import "./pi.css";

export default function PiApp({
  message,
  transcript,
  startSession,
  closeSession,
  state,
  intentResponse,
  updateState
}) {
  let content;
  const screens = {
    sleepClock: SleepClock({ updateState })
  }
  if (state === "ambient") {
    content = AmbientScreen({ startSession });
  } else if (state === "listening") {
    content = ActionScreen({ closeSession, greeting: "listening...", state, transcript });
  } else if (state === "processing") {
    content = ActionScreen({ closeSession, greeting: "thinking...", state });
  } else if (state === "sleep") {
    //return SleepMode({ updateState });
    content = screens.sleepClock;
  } else if (state === "response") {
    content = ResponseScreen({ intentResponse, message, updateState });
  }
  return (
    <div className="pi-wrapper">
      {content}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap" rel="stylesheet" />
    </div>
  )
}

function AmbientScreen({ startSession }) {
  return (
    <img
      className="pi-ambient"
      onClick={() => startSession()}
      src="pi-ambient.gif"
      alt=""
    />
  );
}

function ActionScreen({ closeSession, greeting, state, transcript }) {
  const gif = state === "listening" ? ListeningWaves() : Processing();
  return (
    <div onClick={() => closeSession()} className="pi-active-container">
      <h1 className="pi-greeting"><em>{greeting}</em></h1>
      <div className="pi-transcript-wrapper">
        <p className="pi-transcript"><em>{transcript}</em></p>
      </div>
      {gif}
    </div >
  );
}

function ResponseScreen({ intentResponse, message, updateState }) {
  return (
    <div className="pi-active-container" onClick={() => updateState("ambient")}>
      <h1 className="pi-greeting"><em>{intentResponse}</em></h1>
      <div className="pi-transcript-wrapper">
        <p className="pi-transcript"><em>{message}</em></p>
      </div>
    </div>
  )
}

function ListeningWaves() {
  return (
    <img src="./pi-listening.gif" className="pi-listening" alt="" />
  );
}

function Processing() {
  return (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}

function SleepMode({ updateState }) {
  return (
    <div className="pi-sleep-container" onClick={() => updateState("ambient")} />
  );
}

/*
 * Clock for sleep mode
 * HH:MM PM/AM
 */
function SleepClock({ updateState }) {
  const [time, updateTime] = useState("");
  useInterval(() => {
    const currentTime = new Date().toLocaleTimeString().toString();
    const lastColon = currentTime.lastIndexOf(":");
    const cleanedTimeStr = currentTime.substring(0, lastColon) + currentTime.substring(lastColon + 3);
    updateTime(cleanedTimeStr);
  }, 1000);
  return (
    <div onClick={() => updateState("ambient")}>
      <h3 className="pi-clock">{time}</h3>
    </div>
  )
}

/*
 * Clock in listening mode
 */
function ActiveClock({ startSession }) {
  const [time, updateTime] = useState("");
  useInterval(() => {
    const currentTime = new Date().toLocaleTimeString().toString();
    const lastColon = currentTime.lastIndexOf(":");
    const cleanedTimeStr = currentTime.substring(0, lastColon) + currentTime.substring(lastColon + 3);
    updateTime(cleanedTimeStr);
  }, 1000);
  return (
    <div>
      <h3 className="pi-clock">{time}</h3>
      <img
        className="pi-ambient-clock"
        onClick={() => startSession()}
        src="pi-ambient.gif"
        alt=""
      />
    </div>
  )
}


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}