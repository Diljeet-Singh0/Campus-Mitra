import React from 'react';
import type { ChatMessage, ChatSession } from '../../types';
import { ChatInterface } from '../../components/mannmitra/ChatInterface';

interface MannMitraPageProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatLoading?: boolean;
  userName?: string;
  chatSessions?: ChatSession[];
  activeSessionId?: string;
  onCreateNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string, e?: React.MouseEvent) => void;
}

export const MannMitraPage: React.FC<MannMitraPageProps> = ({
  messages,
  onSendMessage,
  chatLoading,
  userName,
  chatSessions,
  activeSessionId,
  onCreateNewSession,
  onSelectSession,
  onDeleteSession
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <ChatInterface
        messages={messages}
        onSendMessage={onSendMessage}
        chatLoading={chatLoading}
        userName={userName}
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onCreateNewSession={onCreateNewSession}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
      />
    </div>
  );
};
