export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface Participant {
  id: string;
  username: string;
  isHost: boolean;
  joinedAt: Date;
}

export interface Room {
  id: string;
  code: string;
  videoUrl: string;
  hostId: string;
  createdAt: Date;
  participants: Participant[];
  isPlaying: boolean;
  currentTime: number;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  lastUpdated: Date;
}
