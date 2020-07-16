import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const onClickFunction = listening ? SpeechRecognition.stopListening : () => SpeechRecognition.startListening({ continuous: true });
  const send = () => {
    const simulateProd = true;
    const endpoint = simulateProd || process.env.NODE_ENV === "production" ? "https://api.sahilkapur.com/addDailyWeight" : "http://localhost:8080/addDailyWeight";
    const params = "?transcript="+transcript;
    fetch(endpoint+params)
      .then(response => response.json())
      .then(data => alert(data));
  }
  return (
    <div>
      <button onClick={onClickFunction}>start</button>
      <button onClick={resetTranscript}>reset</button>
      <button onClick={send}>send</button>
      <p>{transcript}</p>
    </div>
  );
}

export default App;
