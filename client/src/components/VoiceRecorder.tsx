import React, { useState, useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
// @ts-ignore
import { useRecorder } from "../contexts/RecorderContext";

export const VoiceRecorder = () => {
  const { socket } = useSocket();
  const { startRecording, stopRecording } = useRecorder();
  const [translation, setTranslation] = useState("");

  useEffect(() => {
    socket?.on("results", (data) => {
      console.log(data);
      setTranslation((prev) => prev + " " + data);
    });
  }, [socket]);

  return (
    <div>
      <button onClick={() => startRecording()}>start</button>
      <button onClick={() => stopRecording()}>stop</button>
      <p>{translation}</p>
    </div>
  );
};
