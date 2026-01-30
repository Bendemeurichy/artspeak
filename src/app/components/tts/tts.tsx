import { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";

interface TTSProps {
  word: string;
}

export default function TTS({ word }: TTSProps) {
  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Testing one two three");
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  return <button onClick={handleSpeak}>Test TTS</button>;
}
