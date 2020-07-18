import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css"

function App() {
  const [message, setMessage] = useState("Hello, Sahil.");
  const [lastTranscriptUpdate, setUpdateTime] = useState(null);
  const { listening, transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      setMessage("Go ahead...");
      setUpdateTime(new Date());
    }
    if (!listening && transcript !== '') {
      send({ transcript, startListening: SpeechRecognition.startListening, resetTranscript, setMessage })
    }
  }, [listening]);

  useEffect(() => setUpdateTime(new Date()), [transcript]);

  useInterval(() => {
    if (transcript !== '' && listening) {
      const timeDiff = (new Date() - lastTranscriptUpdate) / 1000;
      console.log(timeDiff);
      if (timeDiff > 3) {
        send({ transcript, startListening: SpeechRecognition.startListening, resetTranscript, setMessage })
        setTimeout(() => resetTranscript(), 1000);
      }
    }
  }, transcript !== '' ? 2000 : null);

  return (
    <div>
      <h2 className="greeting">{message}</h2>
      <img className="voice-icon" onClick={() => SpeechRecognition.startListening({ continuous: true })}
        src="https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif" />
      <div className="listening" />
      <p className="transcript"><em>{transcript}</em></p>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet" />

    </div>
  );
}

const send = async ({ transcript, startListening, resetTranscript, setMessage }) => {
  const simulateProd = false;
  const endpoint = simulateProd || process.env.NODE_ENV === "production" ? "https://api.sahilkapur.com/setIntent" : "http://localhost:8080/setIntent";
  const params = "?transcript=" + transcript.toLowerCase();
  fetch(endpoint + params)
    .then(response => response.json())
    .then(data => {
      if (data.intent === "launch") {
        window.open(data.url);
        setMessage("Launching Lyft...")
      }
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

export default App;
