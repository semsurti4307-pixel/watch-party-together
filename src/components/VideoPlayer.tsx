import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { VideoState } from '@/types/room';

interface VideoPlayerProps {
  videoUrl: string;
  videoState: VideoState;
  onStateChange: (state: Partial<VideoState>) => void;
  isHost: boolean;
}

// Extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const isYouTubeUrl = (url: string): boolean => {
  return getYouTubeVideoId(url) !== null;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoState,
  onStateChange,
  isHost,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  const isYouTube = isYouTubeUrl(videoUrl);
  const youtubeId = isYouTube ? getYouTubeVideoId(videoUrl) : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isYouTube]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    if (videoState.isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [videoState.isPlaying, isYouTube]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      if (videoState.isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const togglePlay = () => {
    if (isYouTube) return; // YouTube controls its own playback
    onStateChange({ isPlaying: !videoState.isPlaying });
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
    onStateChange({ currentTime: value[0] });
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video || isYouTube) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // YouTube embed
  if (isYouTube && youtubeId) {
    return (
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden"
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title="YouTube video player"
        />
        
        {/* YouTube overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/80 bg-destructive/80 px-2 py-1 rounded flex items-center gap-1">
              <Play className="w-3 h-3" /> YouTube Video
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-foreground hover:bg-secondary/50 pointer-events-auto"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Regular video player
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => videoState.isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${
          showControls || !videoState.isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={togglePlay}
      >
        <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer">
          {videoState.isPlaying ? (
            <Pause className="w-10 h-10 text-primary-foreground" />
          ) : (
            <Play className="w-10 h-10 text-primary-foreground ml-1" />
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="text-foreground hover:bg-secondary/50">
              {videoState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => skip(-10)} className="text-foreground hover:bg-secondary/50">
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => skip(10)} className="text-foreground hover:bg-secondary/50">
              <SkipForward className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-foreground hover:bg-secondary/50">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>

            <span className="text-sm text-foreground/80 ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isHost && (
              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                Host controls sync
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-foreground hover:bg-secondary/50">
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
