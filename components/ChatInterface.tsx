'use client'

import { useState, useEffect, useRef } from 'react'
import ChatSidebar from './ChatSidebar'
import MessageList from './MessageList'
import ChatInput from './ChatInput'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  file?: string
  fileName?: string
  displayText?: string // Original text without prefix for display
}

interface ChatInterfaceProps {
  isAdmin: boolean
}

export default function ChatInterface({ isAdmin }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [queryHistory, setQueryHistory] = useState<string[]>([])
  const [selectedQuery, setSelectedQuery] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash-preview-05-20')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const models = [
    'gemini-2.5-flash-preview-05-20',
    'gemma3:12b'
  ]

  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' })
    }, instant ? 0 : 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load query history from localStorage
    const savedHistory = localStorage.getItem('queryHistory')
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory))
    }
    // Load selected model from localStorage
    const savedModel = localStorage.getItem('selectedModel')
    if (savedModel && models.includes(savedModel)) {
      setSelectedModel(savedModel)
    }
  }, [])

  const handleSendMessage = async (text: string, file?: File, mode: 'query' | 'input' | 'data' = 'query', operation?: 'get' | 'delete') => {
    if (!text.trim() && !file) return

    const messageText = text.trim() // Original text without prefix

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      displayText: messageText, // Display original text
      sender: 'user',
      timestamp: new Date(),
      file: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
    }
    setMessages((prev) => [...prev, userMessage])
    scrollToBottom(true) // Scroll immediately when message is sent

    // Add to query history if it's a query (always true for normal users, or when admin selects query mode)
    if (mode === 'query') {
      const newHistory = [text.trim(), ...queryHistory.filter((q) => q !== text.trim())].slice(0, 10)
      setQueryHistory(newHistory)
      localStorage.setItem('queryHistory', JSON.stringify(newHistory))
    }

    // Call API
    try {
      const formData = new FormData()
      formData.append('message', messageText)
      formData.append('select', mode) // Send mode as 'select' key
      formData.append('model', selectedModel)
      if (mode === 'data' && operation) {
        formData.append('operation', operation)
      }
      if (file) {
        formData.append('file', file)
      }

      // Construct API URL using current hostname with port 8000
      const apiUrl = `${window.location.protocol}//${window.location.hostname}:8000/chat1`

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      // Parse response based on message type
      // For 'input' mode, use 'message' key; for 'query' mode, use 'answer' key
      let responseText: string
      if (mode === 'input') {
        responseText = data.message || 'No response received'
      } else {
        responseText = data.answer || 'No response received'
      }
      
      // Clean response text - remove (Chunk...) patterns
      responseText = responseText.replace(/\(Chunk[^)]*\)/g, '').trim()

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      scrollToBottom() // Scroll smoothly when response is received
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Could not send message. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      scrollToBottom() // Scroll smoothly when error is received
    }
  }

  const handleSelectQuery = (query: string) => {
    // Set the query in the input field
    setSelectedQuery(query)
  }

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    localStorage.setItem('selectedModel', model)
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <ChatSidebar
        queryHistory={queryHistory}
        onSelectQuery={handleSelectQuery}
      />
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium"
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <ChatInput
          onSendMessage={handleSendMessage}
          isAdmin={isAdmin}
          selectedQuery={selectedQuery}
          onQuerySelected={() => setSelectedQuery('')}
        />
      </div>
    </div>
  )
}

