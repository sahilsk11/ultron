import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import actionLauncher from "./actionLauncher";
import "./App.css"
import PiApp from "./Pi/PiApp";
import Chat from "./Chat/Chat";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function Index() {
  const [lastTranscriptUpdate, setUpdateTime] = useState(null);
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const [state, updateState] = useState("ambient");
  const [message, setMessage] = useState("Hello, Sahil.");
  const [intentResponse, setIntent] = useState(null);

  const wakeWords = ["okay ultron", "jarvis"];

  //https://www.npmjs.com/package/react-mic

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Unsupported Browser");
    }
  }, []);

  console.log(state);
  if (state === "sleep" && listening) {
    SpeechRecognition.stopListening();
  } else if (state !== "sleep" && !listening) {
    SpeechRecognition.startListening({ continuous: true });
  }

  const startSession = () => {
    resetTranscript();
    setMessage("Go ahead...");
    setUpdateTime(new Date());
    updateState("listening");
  }

  const endSession = async () => {
    setMessage("processing...")
    updateState("processing");
    const onAudioFinish = () => {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    SpeechRecognition.stopListening();
    send({ transcript, resetTranscript, setMessage, setIntent, updateState, onAudioFinish });
  }

  useEffect(() => {
    setUpdateTime(new Date());
  }, [transcript]);

  const wakeWordSpoken = (cleanTranscript) => {
    console.log(cleanTranscript)
    for (const word of wakeWords) {
      if (cleanTranscript.includes(word)) {
        return true;
      }
    }
    return false;
  }

  if (state !== "listening") {
    if (wakeWordSpoken(transcript.toLocaleLowerCase())) {
      resetTranscript();
      startSession();
    } else if (listening && state === "response") {
      if (transcript.toLowerCase().includes("clear")) {
        resetTranscript();
        updateState("ambient");
      }
    }
  }

  useInterval(() => {
    if (transcript !== '' && state === "listening") {
      const timeDiff = (new Date() - lastTranscriptUpdate) / 1000;
      let timeTreshold = 2;
      if (transcript.includes("add weight") && !transcript.includes("send")) {
        timeTreshold = 60;
      }
      if (timeDiff > timeTreshold) {
        endSession();
      }
    }
  }, transcript !== '' && state === "listening" ? 1000 : null);

  const props = {
    message,
    intentResponse,
    transcript: state === 'listening' ? transcript : '',
    startSession,
    state,
    updateState,
    updateMessage: setMessage
  }
  const sendProps = {
    resetTranscript, setMessage, setIntent, updateState, onAudioFinish: () => resetTranscript()
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const device = urlParams.get('device');
  if (device === "pi") {
    return PiApp(props)
  } else {
    return App({ ...props, sendProps });
  }
}

function App({
  message,
  updateMessage,
  listening,
  stopListening,
  startSession,
  transcript,
  sendProps
}) {
  return (
    <div className="app-container">
      <h2 className="greeting">{message}</h2>
      <div className="voice-icon-wrapper" onClick={() => { listening ? stopListening() : startSession() }}>
        <img className="voice-icon"
          src="https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif"
          alt=""
        />
      </div>
      <p className="transcript"><em>{transcript}</em></p>
      <p className="credit">animation design by <a href="https://dribbble.com/glebich" target="_blank">Gleb Kuznetsov</a></p>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />
    </div>
  );
}

const MessageInput = ({ message, updateMessage, sendProps }) => {
  const handleSubmit = (e) => {
    if (e.charCode == 13) {
      send({ transcript: message, ...sendProps });
    }
  }
  return (
    <input className="transcript-input" value={message} onChange={e => updateMessage(e.target.value)} onKeyPress={(e) => handleSubmit(e)} />
  )
}

const getApiToken = () => {
  let apiKey = localStorage.getItem('api_key');
  if (!apiKey) {
    apiKey = prompt("Enter device api key");
    if (!!apiKey && apiKey.length > 5)
      localStorage.setItem('api_key', apiKey);
  }
  return apiKey;
}

const send = ({ transcript, resetTranscript, setMessage, setIntent, updateState, onAudioFinish }) => {
  let apiKey = getApiToken();
  const simulateProd = false;
  const host = simulateProd || process.env.NODE_ENV === "production" ? "https://www.ultron.sh/server" : "http://localhost:8080";
  //let params = "?transcript=" + transcript.toLowerCase();
  //params += "&api_key=" + apiKey;
  try {
    fetch(host, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript,
        api_key: apiKey,
        generateAudio: true
      })
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          setMessage("Error in request");
          updateState("Error");
          throw Error(`Request rejected`)
        }
      }).then(data => {
        const { intent, message, code } = data;
        if (message === "Invalid credentials") {
          apiKey = prompt("Enter device api key");
          if (!!apiKey && apiKey.length > 5)
            localStorage.setItem('api_key', apiKey);
        }
        setIntent(intent);
        setMessage(message);
        updateState("response");
        actionLauncher({ data, updateState, resetTranscript });
        const audio = new Audio(host + '/audioFile?fileName=' + data.fileName);
        audio.play();
        audio.addEventListener("ended", data => onAudioFinish(data));
      }).catch(error => {
        console.error(error);
        updateState("error");
        setMessage(error.message);
      });
  } catch (error) {
    alert();
  }
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

function AppWrapper() {
  return (
    <Router>
      <Switch>
        <Route path="/chat">
          <Chat />
        </Route>
        <Route path="/">
          <Index />
        </Route>
      </Switch>
    </Router>
  )
}

export default AppWrapper;
