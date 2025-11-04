'use client'

import { RefObject } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  file?: string
  fileName?: string
  displayText?: string // Original text without prefix for display
}

interface MessageListProps {
  messages: Message[]
  messagesEndRef: RefObject<HTMLDivElement>
}

export default function MessageList({ messages, messagesEndRef }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Start a conversation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.file && (
              <div className="mb-2">
                <img
                  src={message.file}
                  alt={message.fileName}
                  className="max-w-full rounded-lg mb-2"
                />
                {message.fileName && (
                  <p className="text-xs opacity-80">{message.fileName}</p>
                )}
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">
              {message.displayText !== undefined ? message.displayText : message.text}
            </p>
            <p
              className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

