import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css"

function App() {
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const send = async () => {
    const simulateProd = true;
    const endpoint = simulateProd || process.env.NODE_ENV === "production" ? "https://api.sahilkapur.com/addDailyWeight" : "http://localhost:8080/addDailyWeight";
    const params = "?transcript="+transcript.toLowerCase();
    fetch(endpoint+params)
      .then(response => response.json())
      .then(data => alert(data));
  }
  useEffect(() => {
    if (!listening && transcript !=='') {
      send()
    }
  }, [listening]);
  return (
    <div>
      {/* <button onClick={onClickFunction}>start</button>
      <button onClick={resetTranscript}>reset</button>
      <button onClick={send}>send</button> */}
      <h2 className="greeting">Good evening, Sahil.</h2>
      <img className="voice-icon" onClick={()=>SpeechRecognition.startListening({continuous: false})}
      src="https://cdn.dribbble.com/users/32512/screenshots/5668419/calm_ai_design_by_gleb.gif" />
      <p className="transcript"><em>{transcript}</em></p>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet" />

    </div>
  );
}

export default App;
