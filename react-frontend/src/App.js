import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import actionLauncher from "./actionLauncher";
import "./App.css"
import PiApp from "./Pi/PiApp";

function Index() {
  const [message, setMessage] = useState("Hello, Sahil.");
  const [lastTranscriptUpdate, setUpdateTime] = useState(null);
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const [state, updateState] = useState("ambient");

  // useEffect(() => {
  //   if (listening) {
  //     setMessage("Go ahead...");
  //     setUpdateTime(new Date());
  //     updateState("listening");
  //   } else {
  //     setMessage("Hello, Sahil.");
  //     updateState("ambient");
  //   }
  //   if (!listening && transcript !== '') {
  //     send({ transcript, startListening: SpeechRecognition.startListening, resetTranscript, setMessage, updateState });
  //     updateState("processing");
  //   }
  // }, [listening]);

  const startSession = () => {
    setMessage("Go ahead...");
    setUpdateTime(new Date());
    updateState("listening");
    SpeechRecognition.startListening({ continuous: true });
  }

  const endSession = () => {
    send({ transcript, startListening: SpeechRecognition.startListening, resetTranscript, setMessage, updateState });
    setMessage("processing...")
    updateState("processing");
  }

  const closeSession = () => {
    setMessage("Hello, Sahil.");
    updateState("ambient");
  }

  useEffect(() => setUpdateTime(new Date()), [transcript]);

  useInterval(() => {
    if (transcript !== '' && listening) {
      const timeDiff = (new Date() - lastTranscriptUpdate) / 1000;
      if (timeDiff > 2) {
        // setMessage("processing...")
        // resetTranscript();
        // send({ transcript, startListening: SpeechRecognition.startListening, resetTranscript, setMessage, updateState });
        // updateState("processing");
        endSession();
      }
    }
  }, transcript !== '' ? 1000 : null);

  const props = {
    message,
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
      <p onClick={() => alert('transcript')} className="transcript"><em>{transcript}</em></p>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet" />
    </div>
  );
}

const send = async ({ transcript, startListening, resetTranscript, setMessage, updateState }) => {
  const simulateProd = false;
  const endpoint = simulateProd || process.env.NODE_ENV === "production" ? "https://api.sahilkapur.com/setIntent" : "http://localhost:8080/setIntent";
  const params = "?transcript=" + transcript.toLowerCase();
  fetch(endpoint + params)
    .then(response => response.json())
    .then(data => {
      actionLauncher({ data, setMessage });
      updateState("response");
    });
  setTimeout(() => {
    resetTranscript();
  }, 1000);
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
