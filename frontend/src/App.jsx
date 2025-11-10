import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import ChatInterface from './components/ChatInterface'
import LandingPage from './components/LandingPage'
import Footer from './components/Footer'

function App() {
  const [language, setLanguage] = useState('en')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage language={language} setLanguage={setLanguage} />} />
      </Routes>
    </Router>
  )
}

// Home Page Component
function HomePage() {
  const navigate = useNavigate()

  const handleStartChat = () => {
    navigate('/chat')
  }

  return <LandingPage onStartChat={handleStartChat} />
}

// Chat Page Component
function ChatPage({ language, setLanguage }) {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-earth-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content with Header */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <ChatInterface 
            language={language} 
            setLanguage={setLanguage}
            onBackToHome={handleBackToHome} 
          />
        </main>
      </div>
    </div>
  )
}

export default App
