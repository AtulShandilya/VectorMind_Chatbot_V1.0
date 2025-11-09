'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSendMessage: (text: string, file?: File, mode?: 'query' | 'input' | 'data', operation?: 'get' | 'delete' | 'similarity') => void
  isAdmin: boolean
  selectedQuery?: string
  onQuerySelected?: () => void
}

export default function ChatInput({ onSendMessage, isAdmin, selectedQuery, onQuerySelected }: ChatInputProps) {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'query' | 'input' | 'data'>('input')
  const [operation, setOperation] = useState<'get' | 'delete' | 'similarity'>('get')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (selectedQuery) {
      setText(selectedQuery)
      setMode('query')
      textareaRef.current?.focus()
      onQuerySelected?.()
    }
  }, [selectedQuery, onQuerySelected])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() || selectedFile) {
      const currentMode = isAdmin ? mode : 'query'
      const currentOperation = (currentMode === 'data') ? operation : undefined
      onSendMessage(text, selectedFile || undefined, currentMode, currentOperation)
      setText('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {isAdmin && (
        <>
          <div className="flex gap-2 mb-3 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('query')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'query'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Query
            </button>
            <button
              type="button"
              onClick={() => setMode('input')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'input'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Input
            </button>
            <button
              type="button"
              onClick={() => setMode('data')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'data'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Data
            </button>
          </div>
          {mode === 'data' && (
            <div className="flex gap-2 mb-3 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setOperation('get')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  operation === 'get'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Get
              </button>
              <button
                type="button"
                onClick={() => setOperation('delete')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  operation === 'delete'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setOperation('similarity')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  operation === 'similarity'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Similarity
              </button>
            </div>
          )}
        </>
      )}
      
      {selectedFile && (
        <div className="mb-2 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <span className="text-sm text-gray-700 flex-1 truncate">
            📎 {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '200px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        
        <label
          htmlFor="file-input"
          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </label>
        
        <button
          type="submit"
          disabled={!text.trim() && !selectedFile}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}

