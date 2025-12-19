import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, Participant } from '@/types/room';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatPanelProps {
  messages: Message[];
  participants: Participant[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  participants,
  currentUserId,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Live Chat</h3>
          <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {participants.length} online
          </span>
        </div>
      </div>

      {/* Participants */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-1.5 text-xs bg-secondary px-2 py-1 rounded-full"
            >
              <div className={`w-2 h-2 rounded-full ${participant.isHost ? 'bg-primary' : 'bg-accent'}`} />
              <span className="text-foreground">{participant.username}</span>
              {participant.isHost && (
                <span className="text-primary text-[10px] font-medium">HOST</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No messages yet. Start the conversation! 🎬
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.userId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${isOwn ? 'text-primary' : 'text-accent'}`}>
                      {message.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
