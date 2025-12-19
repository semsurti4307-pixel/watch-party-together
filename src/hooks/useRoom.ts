import { useState, useCallback } from 'react';
import { Room, Participant, Message, VideoState } from '@/types/room';

const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const useRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    lastUpdated: new Date(),
  });

  const createRoom = useCallback((username: string, videoUrl: string) => {
    const userId = generateId();
    const roomCode = generateRoomCode();
    
    const host: Participant = {
      id: userId,
      username,
      isHost: true,
      joinedAt: new Date(),
    };

    const newRoom: Room = {
      id: generateId(),
      code: roomCode,
      videoUrl,
      hostId: userId,
      createdAt: new Date(),
      participants: [host],
      isPlaying: false,
      currentTime: 0,
    };

    setRoom(newRoom);
    setCurrentUser(host);
    setMessages([]);
    
    return newRoom;
  }, []);

  const joinRoom = useCallback((roomCode: string, username: string) => {
    // In a real app, this would fetch from database
    // For demo, we'll simulate joining
    const userId = generateId();
    
    const participant: Participant = {
      id: userId,
      username,
      isHost: false,
      joinedAt: new Date(),
    };

    if (room && room.code === roomCode) {
      setRoom(prev => prev ? {
        ...prev,
        participants: [...prev.participants, participant],
      } : null);
      setCurrentUser(participant);
      return true;
    }
    
    // Create a mock room for demo purposes
    const mockRoom: Room = {
      id: generateId(),
      code: roomCode,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      hostId: 'host-123',
      createdAt: new Date(),
      participants: [
        { id: 'host-123', username: 'Host', isHost: true, joinedAt: new Date() },
        participant,
      ],
      isPlaying: false,
      currentTime: 0,
    };
    
    setRoom(mockRoom);
    setCurrentUser(participant);
    return true;
  }, [room]);

  const leaveRoom = useCallback(() => {
    setRoom(null);
    setCurrentUser(null);
    setMessages([]);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!currentUser) return;
    
    const message: Message = {
      id: generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
  }, [currentUser]);

  const updateVideoState = useCallback((state: Partial<VideoState>) => {
    setVideoState(prev => ({
      ...prev,
      ...state,
      lastUpdated: new Date(),
    }));
  }, []);

  const setVideoUrl = useCallback((url: string) => {
    setRoom(prev => prev ? { ...prev, videoUrl: url } : null);
  }, []);

  return {
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
  };
};
