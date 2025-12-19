import React, { useState } from 'react';
import { Play, Users, MessageCircle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LandingPageProps {
  onCreateRoom: (username: string, videoUrl: string) => void;
  onJoinRoom: (roomCode: string, username: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState<'landing' | 'create' | 'join'>('landing');
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onCreateRoom(username.trim(), videoUrl.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4');
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomCode.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase(), username.trim());
    }
  };

  if (mode === 'landing') {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Title */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-amber-400 mb-6 glow-effect">
                <Play className="w-10 h-10 text-primary-foreground ml-1" />
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
                <span className="gradient-text">Watch Party</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Watch videos together with friends in perfect sync. 
                Real-time playback, live chat, and endless fun.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button
                variant="gradient"
                size="xl"
                onClick={() => setMode('create')}
                className="group"
              >
                Create a Room
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => setMode('join')}
              >
                Join with Code
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Instant Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Play, pause, and seek together. Everyone stays in sync automatically.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  React and discuss in real-time while watching together.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Easy Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Share a simple code and start watching in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>Built with React & Real-time Sync</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl animate-fade-in">
          <button
            onClick={() => setMode('landing')}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-amber-400 mb-4">
              <Play className="w-7 h-7 text-primary-foreground ml-0.5" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {mode === 'create' ? 'Create a Room' : 'Join a Room'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {mode === 'create'
                ? 'Start a watch party and invite friends'
                : 'Enter the room code to join'}
            </p>
          </div>

          <form onSubmit={mode === 'create' ? handleCreate : handleJoin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Your Name
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {mode === 'join' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Room Code
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="font-mono tracking-widest text-center text-lg"
                  required
                />
              </div>
            )}

            {mode === 'create' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Video URL <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube link or direct video URL"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Supports YouTube links, MP4 files, and direct video URLs
                </p>
              </div>
            )}

            <Button type="submit" variant="gradient" size="lg" className="w-full mt-6">
              {mode === 'create' ? 'Create Room' : 'Join Room'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'create' ? 'join' : 'create')}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'create' ? 'Have a code? Join a room' : 'No code? Create a room'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
