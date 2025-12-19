import React from 'react';
import { LandingPage } from '@/components/LandingPage';
import { RoomView } from '@/components/RoomView';
import { useRoom } from '@/hooks/useRoom';
import { Toaster } from '@/components/ui/toaster';

const Index: React.FC = () => {
  const {
    room,
    currentUser,
    messages,
    videoState,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    updateVideoState,
    setVideoUrl,
  } = useRoom();

  const handleCreateRoom = (username: string, videoUrl: string) => {
    createRoom(username, videoUrl);
  };

  const handleJoinRoom = (roomCode: string, username: string) => {
    joinRoom(roomCode, username);
  };

  if (room && currentUser) {
    return (
      <>
        <RoomView
          room={room}
          currentUser={currentUser}
          messages={messages}
          videoState={videoState}
          onSendMessage={sendMessage}
          onVideoStateChange={updateVideoState}
          onLeaveRoom={leaveRoom}
          onVideoUrlChange={setVideoUrl}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <LandingPage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      <Toaster />
    </>
  );
};

export default Index;
