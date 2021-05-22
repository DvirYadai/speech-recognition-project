import React from "react";
import "./App.css";
import { VoiceRecorder } from "./components/VoiceRecorder";
import { SocketProvider } from "./contexts/SocketContext";
import { RecorderProvider } from "./contexts/RecorderContext";

function App() {
  return (
    <SocketProvider>
      <RecorderProvider>
        <div className="App">
          <VoiceRecorder />
        </div>
      </RecorderProvider>
    </SocketProvider>
  );
}

export default App;
