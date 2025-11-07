'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '../components/ChatInterface'
import LoginModal from '../components/LoginModal'

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Check if user is already logged in as admin
    const adminStatus = localStorage.getItem('isAdmin')
    if (adminStatus === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const handleLogin = (username: string, password: string) => {
    // Simple admin authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true)
      localStorage.setItem('isAdmin', 'true')
      setShowLogin(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
  }

  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Admin Mode
            </span>
          )}
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Admin Login
            </button>
          )}
        </div>
      </header>
      <ChatInterface isAdmin={isAdmin} />
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  )
}




