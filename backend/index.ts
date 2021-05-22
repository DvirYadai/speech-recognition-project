import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Stream } from "stream";
import speech from "@google-cloud/speech";
require("dotenv").config();
const ss = require("socket.io-stream");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const keyFilename = "./google-api-keys.json";
const client = new speech.SpeechClient({
  projectID: process.env.PROJECT_ID,
  keyFilename,
});

io.on("connection", (socket: Socket) => {
  console.log(socket.id + " connected");
  ss(socket).on("stream-transcribe", function (stream: Stream, data: {}) {
    // const filename = path.basename(data.name);
    // const filename = user.name + "_" + Date.now();
    // stream.pipe(fs.createWriteStream(filename));
    transcribeAudioStream(stream, function (results: string) {
      console.log(results);
      socket.emit("results", results);
    });
  });
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

async function transcribeAudioStream(audio: Stream, cb: Function) {
  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "iw-IL",
    },
    audio: {
      content: audio,
    },
  };
  const recognizeStream = client
    // @ts-ignore
    .streamingRecognize(request)
    .on("data", function (data: any) {
      cb(data.results[0].alternatives[0].transcript);
    })
    .on("error", (e: any) => {
      console.log(e);
    })
    .on("end", () => {
      console.log("on end");
    });

  audio.pipe(recognizeStream);
  audio.on("end", function () {
    console.log("audio end");
    //fileWriter.end();
  });
}

httpServer.listen(3001, () => {
  console.log("server listening in port 3001");
});
