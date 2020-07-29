import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import actionLauncher from "./actionLauncher";
import "./App.css"
import PiApp from "./Pi/PiApp";

function Index() {
  const [lastTranscriptUpdate, setUpdateTime] = useState(null);
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const [state, updateState] = useState("ambient");
  const [message, setMessage] = useState("Hello, Sahil.");
  const [intentResponse, setIntent] = useState(null);

  const startSession = () => {
    setMessage("Go ahead...");
    setUpdateTime(new Date());
    updateState("listening");
    SpeechRecognition.startListening({ continuous: true });
  }

  const endSession = async () => {
    setMessage("processing...")
    updateState("processing");
    await send({ transcript, setMessage, setIntent });
    resetTranscript();
    updateState("response");
    setTimeout(() => {
      if (state === "response") updateState("ambient")
    }, 10000)
    //updateIntent
  }

  const closeSession = () => {
    setMessage("Hello, Sahil.");
    updateState("ambient");
  }

  useEffect(() => setUpdateTime(new Date()), [transcript]);

  if (state === "ambient" && !listening) {
    SpeechRecognition.startListening({ continuous: true });
  }

  if (state !== "listening") {
    if (transcript.toLowerCase().includes("ultron")) {
      resetTranscript();
      startSession();
    }
  }

  if (state === "response") {
    if (transcript.toLowerCase().includes("clear")) {
      resetTranscript();
      closeSession();
    }
  }

  useInterval(() => {
    if (transcript !== '' && state === "listening") {
      const timeDiff = (new Date() - lastTranscriptUpdate) / 1000;
      if (timeDiff > 2) {
        // setMessage("processing...")
        // resetTranscript();
        // send({ transcript, startListening: SpeechRecognition.startListening, resetTranscript, setMessage, updateState });
        // updateState("processing");
        endSession();
      }
    }
  }, transcript !== '' && state === "listening" ? 1000 : null);

  const props = {
    message,
    intentResponse,
    transcript,
    startSession,
    closeSession,
    state,
    updateState
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const device = urlParams.get('device');
  if (device === "pi") {
    return PiApp(props)
  } else {
    return App(props);
  }
}

function App({
  message,
  listening,
  stopListening,
  startSession,
  transcript
}) {
  return (
    <div className="app-container">
      <h2 className="greeting">{message}</h2>
      <div className="voice-icon-wrapper" onClick={() => { listening ? stopListening() : startSession({ continuous: true }) }}>
        <img className="voice-icon"
          src="https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif" />
      </div>
      <p className="transcript"><em>{transcript}</em></p>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet" />
    </div>
  );
}

const send = async ({ transcript, setMessage, setIntent }) => {
  const simulateProd = false;
  const endpoint = simulateProd || process.env.NODE_ENV === "production" ? "https://api.sahilkapur.com/setIntent" : "http://192.168.2.97:8080/setIntent";
  const params = "?transcript=" + transcript.toLowerCase();
  fetch(endpoint + params)
    .then(response => response.json())
    .then(data => {
      const { intent, message } = actionLauncher({ data, setMessage });
      setIntent(intent);
      setMessage(message);
      //updateState("response");
    });
  // setTimeout(() => {
  //   resetTranscript();
  // }, 1000);
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

export default Index;
