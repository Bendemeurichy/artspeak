"use client";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
  Slider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  SkipPrevious,
  SkipNext,
} from "@mui/icons-material";

interface AudioPlayerProps {
  word: string;
  path: string;
}

export default function AudioPlayer({ word, path }: AudioPlayerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = path;
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setError(`Failed to load audio file: ${path}`);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);

    audio.load();

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.pause();
      audio.src = "";
    };
  }, [path, isMounted]);

  const togglePlay = async () => {
    if (!audioRef.current || isLoading) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      setError("Failed to play audio");
      setIsPlaying(false);
    }
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    const time = newValue as number;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return;
    const vol = newValue as number;
    audioRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume > 0 ? volume : 0.5;
      setVolume(volume > 0 ? volume : 0.5);
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isMounted) {
    return (
      <Card sx={{ display: "flex", maxWidth: 600 }}>
        <CardMedia
          sx={{
            width: 151,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "primary.main",
          }}
        >
          <Typography variant="h3" color="primary.contrastText">
            🎵
          </Typography>
        </CardMedia>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {word}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              Audio Pronunciation
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", px: 2, pb: 1 }}>
            <CircularProgress size={32} sx={{ mx: "auto" }} />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ display: "flex", maxWidth: 600 }}>
      <CardMedia
        sx={{
          width: 151,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "primary.main",
        }}
      >
        <Typography variant="h3" color="primary.contrastText">
          🎵
        </Typography>
      </CardMedia>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {word}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            Audio Pronunciation
          </Typography>
        </CardContent>

        {error && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", px: 2, pb: 1 }}>
          <IconButton
            aria-label="previous"
            onClick={skipBackward}
            disabled={isLoading || !!error}
          >
            <SkipPrevious />
          </IconButton>
          <IconButton
            aria-label={isPlaying ? "pause" : "play"}
            onClick={togglePlay}
            disabled={isLoading || !!error}
            sx={{ mx: 1 }}
          >
            {isLoading ? (
              <CircularProgress size={32} />
            ) : isPlaying ? (
              <Pause sx={{ height: 38, width: 38 }} />
            ) : (
              <PlayArrow sx={{ height: 38, width: 38 }} />
            )}
          </IconButton>
          <IconButton
            aria-label="next"
            onClick={skipForward}
            disabled={isLoading || !!error}
          >
            <SkipNext />
          </IconButton>

          <Box sx={{ flex: 1, mx: 2 }}>
            <Slider
              value={currentTime}
              max={duration || 100}
              onChange={handleSliderChange}
              aria-label="Time"
              disabled={isLoading || !!error}
              size="small"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: -1,
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {formatTime(currentTime)}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {formatTime(duration)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <IconButton
              aria-label={isMuted ? "unmute" : "mute"}
              onClick={toggleMute}
              disabled={isLoading || !!error}
              size="small"
            >
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <Slider
              value={isMuted ? 0 : volume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              aria-label="Volume"
              disabled={isLoading || !!error}
              sx={{ width: 80 }}
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
