import React from "react";
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
  if (state === "ambient") {
    content = AmbientScreen({ startSession });
  } else if (state === "listening") {
    content = ActionScreen({ closeSession, greeting: "listening...", state, transcript });
  } else if (state === "processing") {
    content = ActionScreen({ closeSession, greeting: "thinking...", state });
  } else if (state === "sleep") {
    //alert();
    return SleepMode({ updateState });
  } else {
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
  const gif = <img src="./pi-listening.gif" className="pi-listening" alt="" />;
  return gif;
}

function Processing() {
  const loading = (
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  );
  return loading;
}

function SleepMode({ updateState }) {
  return (
    <div className="pi-sleep-container" onClick={() => updateState("ambient")}>

    </div>
  )
}