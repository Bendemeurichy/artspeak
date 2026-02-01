"use client";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Slider,
  Alert,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { PlayArrow, Pause, SkipPrevious, SkipNext } from "@mui/icons-material";

interface AudioPlayerProps {
  word: string;
  img: string;
  path: string;
}

export default function AudioPlayer({ word, img, path }: AudioPlayerProps) {
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
    // Force full preload to avoid Firefox range request issues
    audio.preload = "auto";
    audio.src = path;
    audioRef.current = audio;

    const setAudioData = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsLoading(false);
      }
    };

    const setAudioTime = () => {
      if (isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Reset position for replay
      audio.currentTime = 0;
      setCurrentTime(0);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      // Double-check duration is available
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      const errorDetails = target.error
        ? `Code: ${target.error.code}`
        : "Unknown error";
      console.error("Audio error:", errorDetails, "Path:", path);
      setError(`Failed to load audio file. ${errorDetails}`);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);

    audio.load();

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);

      // Clean up
      audio.pause();
      audio.src = "";
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [path, isMounted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // If audio has ended, reload it for Firefox 206 range request issue
        if (audio.ended) {
          audio.currentTime = 0;
          // Force reload to reset Firefox's range request cache
          audio.load();
          // Wait for audio to be ready
          await new Promise<void>((resolve) => {
            const onCanPlay = () => {
              audio.removeEventListener("canplay", onCanPlay);
              resolve();
            };
            audio.addEventListener("canplay", onCanPlay);
          });
        }

        await audio.play();
      }
    } catch (err: any) {
      console.error("Error playing audio:", err);
      setError(`Failed to play audio: ${err.message || "Unknown error"}`);
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
    if (!isFinite(time) || isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isMounted) {
    return (
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "90vw",
          height: "80vh",
          maxWidth: "90vw",
          maxHeight: "80vh",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            height: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "background.paper",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            backgroundColor: "primary.main",
          }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {word}
            </Typography>
          </CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              px: 2,
              pb: 1,
            }}
          >
            <CircularProgress sx={{ color: "background.paper" }} size={32} />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "90vw",
        height: "80vh",
        maxWidth: "90vw",
        maxHeight: "80vh",
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          height: "70%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${img})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: "primary.main",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {word}
          </Typography>
        </CardContent>

        {error && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 2,
            pb: 1,
          }}
        >
          <Box sx={{ flex: 1, mx: 2, width: "70%" }}>
            <Slider
              sx={{ color: "text.primary" }}
              value={currentTime}
              max={duration && isFinite(duration) ? duration : 100}
              onChange={handleSliderChange}
              aria-label="Time"
              disabled={
                isLoading || !!error || !duration || !isFinite(duration)
              }
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
