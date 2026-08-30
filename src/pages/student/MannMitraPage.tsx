import React from 'react';
import type { ChatMessage } from '../../types';
import { ChatInterface } from '../../components/mannmitra/ChatInterface';

interface MannMitraPageProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  chatLoading?: boolean;
}

export const MannMitraPage: React.FC<MannMitraPageProps> = ({ messages, onSendMessage, chatLoading }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <ChatInterface messages={messages} onSendMessage={onSendMessage} chatLoading={chatLoading} />
    </div>
  );
};
