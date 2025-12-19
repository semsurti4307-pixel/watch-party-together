import React, { useState } from 'react';
import { Copy, Check, Link2, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ChatPanel } from '@/components/ChatPanel';
import { Room, Participant, Message, VideoState } from '@/types/room';
import { toast } from '@/hooks/use-toast';

interface RoomViewProps {
  room: Room;
  currentUser: Participant;
  messages: Message[];
  videoState: VideoState;
  onSendMessage: (content: string) => void;
  onVideoStateChange: (state: Partial<VideoState>) => void;
  onLeaveRoom: () => void;
  onVideoUrlChange: (url: string) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  currentUser,
  messages,
  videoState,
  onSendMessage,
  onVideoStateChange,
  onLeaveRoom,
  onVideoUrlChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState(room.videoUrl);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    toast({
      title: "Room code copied!",
      description: "Share this code with friends to invite them.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVideoUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVideoUrl.trim()) {
      onVideoUrlChange(newVideoUrl.trim());
      setShowSettings(false);
      toast({
        title: "Video updated!",
        description: "The video URL has been changed.",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-display font-bold gradient-text">Watch Party</h1>
            
            {/* Room Code */}
            <button
              onClick={copyRoomCode}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-muted-foreground">Room:</span>
              <span className="font-mono font-bold text-foreground tracking-wider">{room.code}</span>
              {copied ? (
                <Check className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.isHost && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-foreground"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onLeaveRoom}
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && currentUser.isHost && (
          <div className="max-w-7xl mx-auto mt-4">
            <form onSubmit={handleVideoUrlSubmit} className="glass-card p-4 rounded-xl">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Change Video URL
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="YouTube link or direct video URL"
                  className="flex-1"
                />
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 h-[calc(100vh-160px)]">
        {/* Video Section */}
        <div className="flex flex-col">
          <VideoPlayer
            videoUrl={room.videoUrl}
            videoState={videoState}
            onStateChange={onVideoStateChange}
            isHost={currentUser.isHost}
          />
          
          {/* Video Info */}
          <div className="mt-4 glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-foreground">
                  {currentUser.isHost ? "You're hosting" : "Watching together"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {room.participants.length} {room.participants.length === 1 ? 'person' : 'people'} in this room
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {room.participants.slice(0, 4).map((p, i) => (
                    <div
                      key={p.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-card text-xs font-bold text-primary-foreground"
                      style={{ zIndex: 4 - i }}
                    >
                      {p.username.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {room.participants.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border-2 border-card text-xs font-medium text-muted-foreground">
                      +{room.participants.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <ChatPanel
          messages={messages}
          participants={room.participants}
          currentUserId={currentUser.id}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
};
