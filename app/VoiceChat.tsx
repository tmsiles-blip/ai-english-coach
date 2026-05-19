"use client";

import { useRef, useState } from "react";

export default function VoiceChat() {

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [recording, setRecording] = useState(false);
  const [accent, setAccent] = useState("American");

  const [audioUrl, setAudioUrl] = useState("");

  const [aiMessage, setAiMessage] = useState("");
  const [evaluation, setEvaluation] = useState("");

  async function startRecording() {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {

      const audioBlob = new Blob(audioChunks, {
        type: "audio/webm",
      });

      const formData = new FormData();

      formData.append("audio", audioBlob);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      const chatResponse = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  message: data.text,
  accent,
}),
});

const aiData = await chatResponse.json();

console.log("AI DATA:", aiData);

const fullResponse = aiData.response;

console.log(fullResponse);

const parts = fullResponse.split(/evaluation:/i);

console.log("CONVERSATION:", parts[0]);
console.log("EVALUATION:", parts[1]);

setAiMessage(parts[0].trim());

if (parts[1]) {
  setEvaluation(parts[1].trim());
}


const voiceResponse = await fetch("/api/voice", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  text: parts[0].trim().slice(0, 180),
  accent,
}),
});

const arrayBuffer = await voiceResponse.arrayBuffer();

const voiceBlob = new Blob(
  [arrayBuffer],
  { type: "audio/mpeg" }
);

const generatedAudioUrl = URL.createObjectURL(voiceBlob);

setAudioUrl(generatedAudioUrl);

    };

    mediaRecorder.start();

    setRecording(true);
  }

  function stopRecording() {

    mediaRecorderRef.current?.stop();

    setRecording(false);
  }

  return (
  <div className="flex flex-col gap-4">

    <select
      value={accent}
      onChange={(e) => setAccent(e.target.value)}
      className="p-3 border rounded"
    >
      <option>American</option>
      <option>British</option>
      <option>Indian</option>
      <option>European</option>
    </select>

    <button
      onClick={recording ? stopRecording : startRecording}
      className="bg-blue-500 text-white p-4 rounded"
    >
      {recording ? "Stop Recording" : "Start Recording"}
    </button>

    <div className="text-lg">
      {recording ? "Recording..." : "Ready"}
    </div>

    {aiMessage && (
      <div className="bg-gray-100 p-4 rounded text-black">

        <div className="font-bold mb-2">
          AI Coach
        </div>

        <div>
          {aiMessage}
        </div>

      </div>
    )}

    {evaluation && (
      <div className="bg-blue-100 p-4 rounded text-black">

        <div className="font-bold mb-2">
          Evaluation
        </div>

        <pre className="whitespace-pre-wrap">
          {evaluation}
        </pre>

      </div>
    )}

    {audioUrl && (
      <audio
        controls
        autoPlay
        src={audioUrl}
      />
    )}

  </div>
);
}