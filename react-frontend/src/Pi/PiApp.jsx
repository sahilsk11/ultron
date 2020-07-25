import React, { useEffect, useState, useRef } from "react";
import "./pi.css";
import { act } from "react-dom/test-utils";

export default function PiApp({
  message,
  transcript,
  startSession,
  closeSession,
  state,
  updateState
}) {
  const ambient = (
    <img
      className="pi-ambient"
      onClick={() => startSession()}
      src="pi-ambient.gif"
    />
  );
  const active = ActionScreen({ closeSession, greeting: "listening...", state });
  const processing = ActionScreen({ closeSession, greeting: "thinking...", state });
  let content;
  console.log(state)
  if (state === "ambient") {
    content = ambient;
  } else if (state === "listening") {
    content = active;
  } else if (state === "processing") {
    content = processing;
  } else {
    content = message;
  }
  return (
    <div className="pi-wrapper">
      {content}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap" rel="stylesheet" />
    </div>
  )
}

function ActionScreen({ closeSession, greeting, state }) {
  const gif = state === "listening" ? ListeningWaves() : Processing();
  return (
    <div onClick={() => closeSession()} className="pi-active-container">
      <h1 className="pi-greeting"><em>{greeting}</em></h1>
      <div className="pi-transcript-wrapper">
        <p className="pi-transcript"><em>I'm talking and this is the text</em></p>
      </div>
      {gif}
    </div >
  );
}

function ListeningWaves() {
  const gif = <img src="./pi-listening.gif" className="pi-listening" />;
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