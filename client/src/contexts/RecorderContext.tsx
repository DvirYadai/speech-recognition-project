import React, { createContext, useContext, useEffect, useState } from "react";
import RecordRTC from "recordrtc";
// @ts-ignore
import ss from "socket.io-stream";
import { useSocket } from "../contexts/SocketContext";

export type GlobalContentRecorder = {
  startRecording: Function;
  stopRecording: Function;
};

const recorderContext = createContext<GlobalContentRecorder>({
  startRecording: () => {},
  stopRecording: () => {},
});

export function useRecorder() {
  return useContext(recorderContext);
}

export const RecorderProvider: React.FC = ({ children }) => {
  const [recorder, setRecorder] = useState<RecordRTC | undefined>();
  const { socket } = useSocket();

  useEffect(() => {
    if (!navigator.getUserMedia) {
      console.log("getUserMedia not supported");
      return;
    }
    navigator.getUserMedia(
      {
        audio: true,
      },
      (stream) => {
        const recordAudio = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          sampleRate: 44100,
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          timeSlice: 4000,
          desiredSampRate: 16000,

          ondataavailable: function (blob) {
            let stream = ss.createStream();
            ss(socket).emit("stream-transcribe", stream, {
              name: "stream.wav",
              size: blob.size,
            });
            ss.createBlobReadStream(blob).pipe(stream);
          },
        });

        setRecorder(recordAudio);
      },
      (error) => {
        console.log("The following error occurred: " + error.name);
      }
    );
  }, [socket]);

  function startRecording() {
    return recorder?.startRecording();
  }

  function stopRecording() {
    return recorder?.stopRecording();
  }

  const value = {
    startRecording,
    stopRecording,
  };

  return (
    <recorderContext.Provider value={value}>
      {recorder && children}
    </recorderContext.Provider>
  );
};
