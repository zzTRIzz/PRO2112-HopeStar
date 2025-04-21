import React from "react";
import { Card, CardBody, Avatar } from "@heroui/react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"}`}>
      {message.isBot && (
        <Avatar
          src="https://img.heroui.chat/image/ai?w=40&h=40&u=bot"
          className="w-8 h-8"
        />
      )}
      <Card className={`max-w-[80%] ${message.isBot ? "bg-default-50" : "bg-primary-500"}`}>
        <CardBody className={`p-3 text-sm ${message.isBot ? "text-default-700" : "text-white"}`}>
          {message.content}
        </CardBody>
      </Card>
      {!message.isBot && (
        <Avatar
          src="https://img.heroui.chat/image/avatar?w=40&h=40&u=user"
          className="w-8 h-8"
        />
      )}
    </div>
  );
}