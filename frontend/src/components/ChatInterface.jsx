import React, { useState, useRef, useEffect } from 'react'
import { FaMicrophone, FaStop, FaPaperPlane, FaImage, FaVolumeUp, FaArrowLeft, FaGlobe, FaPause, FaPlay, FaCloudSun, FaLocationArrow } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const ChatInterface = ({ language, setLanguage, onBackToHome }) => {
  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem('agrobot_chat_messages')
      return savedMessages ? JSON.parse(savedMessages) : []
    } catch (error) {
      console.error('Error loading messages from localStorage:', error)
      return []
    }
  })
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [playingAudioId, setPlayingAudioId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [weatherContext, setWeatherContext] = useState(null)
  const [isFetchingWeather, setIsFetchingWeather] = useState(false)
  
  const messagesEndRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const fileInputRef = useRef(null)
  const currentAudioRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('agrobot_chat_messages', JSON.stringify(messages))
    } catch (error) {
      console.error('Error saving messages to localStorage:', error)
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add message to chat
  const addMessage = (content, type, sender = 'user') => {
    const newMessage = {
      id: Date.now(),
      content,
      type, // 'text', 'voice', 'image'
      sender, // 'user' or 'bot'
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }

  // Handle text input send
  const handleTextSend = async () => {
    if (!inputText.trim() || isProcessing) return

    const userMessage = inputText.trim()
    setInputText('')
    addMessage(userMessage, 'text', 'user')
    setIsProcessing(true)
    setError('')

    try {
      // Get AI response
      const payload = { message: userMessage }
      if (weatherContext?.context) {
        payload.weatherContext = weatherContext.context
      }

      const chatRes = await axios.post('/api/chat', payload)
      const aiResponse = chatRes.data.response

      // Get TTS and translated text
      const ttsRes = await axios.post('/api/tts', {
        text: aiResponse,
        language: language
      })

      const translatedText = ttsRes.data.translated_text || aiResponse
      const audioBase64 = ttsRes.data.audio
      const format = ttsRes.data.format || 'mp3'
      const audioUrl = audioBase64 ? `data:audio/${format};base64,${audioBase64}` : null

      // Add bot message with audio but NO auto-play for text input
      addMessage({ text: translatedText, audio: audioUrl, autoPlay: false }, 'text', 'bot')
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      let options = { mimeType: 'audio/webm' }
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus' }
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current.mimeType
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        await processVoice(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setError('')
    } catch (err) {
      setError('Microphone access denied.')
      console.error('Recording error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processVoice = async (audioBlob) => {
    setIsProcessing(true)
    setError('')

    try {
      // Transcribe
      const formData = new FormData()
      const filename = audioBlob.type.includes('webm') ? 'recording.webm' : 'recording.wav'
      formData.append('audio', audioBlob, filename)
      formData.append('language', language)

      const transcribeRes = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const transcription = transcribeRes.data.text
      if (!transcription) {
        setError('Could not transcribe audio.')
        setIsProcessing(false)
        return
      }

      // Show transcription in chat as user message
      addMessage(transcription, 'voice', 'user')

      // Get AI response
      const payload = { message: transcription }
      if (weatherContext?.context) {
        payload.weatherContext = weatherContext.context
      }

      const chatRes = await axios.post('/api/chat', payload)
      const aiResponse = chatRes.data.response

      // Get TTS
      const ttsRes = await axios.post('/api/tts', {
        text: aiResponse,
        language: language
      })

      const translatedText = ttsRes.data.translated_text || aiResponse
        const audioBase64 = ttsRes.data.audio
        const format = ttsRes.data.format || 'mp3'
        const audioUrl = audioBase64 ? `data:audio/${format};base64,${audioBase64}` : null

      // Add bot message with audio
      const messageId = addMessage({ text: translatedText, audio: audioUrl, autoPlay: true }, 'voice', 'bot')
      
      // Auto-play audio for voice input
      playAudio(audioUrl, messageId)
    } catch (err) {
      setError('Voice processing failed.')
      console.error('Error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    addMessage({ image: imageUrl }, 'image', 'user')
    setIsProcessing(true)
    setError('')

    try {
      // Analyze image
      const formData = new FormData()
      formData.append('image', file)

      const analyzeRes = await axios.post('/api/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const result = analyzeRes.data.analysis

      // Get TTS
      const ttsRes = await axios.post('/api/tts', {
        text: result,
        language: language
      })

      const translatedText = ttsRes.data.translated_text || result
        const audioBase64 = ttsRes.data.audio
        const format = ttsRes.data.format || 'mp3'
        const audioUrl = audioBase64 ? `data:audio/${format};base64,${audioBase64}` : null

      addMessage({ text: translatedText, audio: audioUrl }, 'image', 'bot')
    } catch (err) {
      setError('Image analysis failed.')
      console.error('Error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const playAudio = (audioUrl, messageId) => {
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
      setPlayingAudioId(null)
      setIsPaused(false)
    }

    // If no audio URL, fall back to browser SpeechSynthesis
    if (!audioUrl) {
      const msg = messages.find(m => m.id === messageId)
      const textToSpeak = msg?.content?.text || msg?.content || ''
      if (textToSpeak) {
        try {
          window.speechSynthesis.cancel()
          const utter = new SpeechSynthesisUtterance(textToSpeak)
          utter.lang = language || 'en'
          window.speechSynthesis.speak(utter)
          setPlayingAudioId(messageId)
        } catch (err) {
          console.error('SpeechSynthesis failed:', err)
        }
      }
      return
    }

    // Create and play new audio
    const audio = new Audio(audioUrl)
    currentAudioRef.current = audio
    setPlayingAudioId(messageId)
    setIsPaused(false)
    
    // Clear reference when audio finishes
    audio.onended = () => {
      currentAudioRef.current = null
      setPlayingAudioId(null)
      setIsPaused(false)
    }
    
    // Clear reference if audio fails and fallback to SpeechSynthesis
    audio.onerror = () => {
      console.error('Audio failed to load/play, falling back to SpeechSynthesis')
      currentAudioRef.current = null
      setPlayingAudioId(null)
      setIsPaused(false)
      // Fallback: speak the text via browser TTS
      const msg = messages.find(m => m.id === messageId)
      const textToSpeak = msg?.content?.text || msg?.content || ''
      if (textToSpeak) {
        try {
          window.speechSynthesis.cancel()
          const utter = new SpeechSynthesisUtterance(textToSpeak)
          utter.lang = language || 'en'
          window.speechSynthesis.speak(utter)
          setPlayingAudioId(messageId)
        } catch (err) {
          console.error('SpeechSynthesis fallback failed:', err)
        }
      }
    }
    
    audio.play().catch(err => {
      console.error('Audio playback failed:', err)
      currentAudioRef.current = null
      setPlayingAudioId(null)
      setIsPaused(false)
    })
  }

  const pauseAudio = () => {
    if (currentAudioRef.current && !currentAudioRef.current.paused) {
      currentAudioRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeAudio = () => {
    if (currentAudioRef.current && currentAudioRef.current.paused) {
      currentAudioRef.current.play()
      setIsPaused(false)
    }
  }

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
      setPlayingAudioId(null)
      setIsPaused(false)
    }
  }

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      setMessages([])
      localStorage.removeItem('agrobot_chat_messages')
      stopAudio()
    }
  }

  const buildWeatherMessage = (data) => {
    if (!data?.details) return ''
    const { details, context } = data
    return `Weather synced for ${details.location}: ${details.temperature}°C, humidity ${details.humidity}%, wind ${details.wind_speed} km/h.\n${context}`
  }

  const handleWeatherFetch = () => {
    if (isFetchingWeather) return
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      return
    }

    setIsFetchingWeather(true)
    setError('')

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { latitude, longitude } = coords
        const res = await axios.get('/api/weather', {
          params: { lat: latitude, lon: longitude }
        })
        setWeatherContext(res.data)
        addMessage({ text: buildWeatherMessage(res.data) }, 'text', 'bot')
      } catch (err) {
        console.error('Weather fetch failed:', err)
        setError('Failed to fetch local weather. Please try again.')
      } finally {
        setIsFetchingWeather(false)
      }
    }, (geoError) => {
      console.error('Geolocation error:', geoError)
      setError('Location permission denied. Cannot fetch weather context.')
      setIsFetchingWeather(false)
    }, {
      enableHighAccuracy: true,
      timeout: 8000
    })
  }

  const clearWeatherContext = () => {
    setWeatherContext(null)
    addMessage({ text: 'Weather context removed. Responses will use general guidance.' }, 'text', 'bot')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-5xl mx-auto">
      {/* Back Button Header */}
      <div className="bg-white rounded-t-3xl shadow-sm border-b border-gray-100 px-6 py-3 flex items-center space-x-4">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
        >
          <FaArrowLeft className="text-lg" />
          <span>Back to Home</span>
        </button>
        <div className="flex-1"></div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 font-medium"
          >
            Clear Chat
          </button>
        )}
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-gray-600">AgroBot Online</span>
        </div>
      </div>

      {/* Weather Snapshot */}
      {weatherContext && (
        <div className="mx-6 mt-4 bg-white border border-primary-100 rounded-2xl shadow-sm p-4 flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FaCloudSun className="text-primary-500 text-2xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">Local field snapshot</p>
              <button
                onClick={clearWeatherContext}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {weatherContext.details?.location} • {weatherContext.details?.temperature}°C • Humidity {weatherContext.details?.humidity}% • Wind {weatherContext.details?.wind_speed} km/h
            </p>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{weatherContext.context}</p>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-primary-50/30 to-white">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <h3 className="text-2xl font-bold mb-2">Start a conversation</h3>
            <p>Type a message, record voice, or upload an image</p>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-4 ${
                msg.sender === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              {/* User Messages */}
              {msg.sender === 'user' && msg.type === 'text' && (
                <p>{msg.content}</p>
              )}
              {msg.sender === 'user' && msg.type === 'voice' && (
                <p>{msg.content}</p>
              )}
              {msg.sender === 'user' && msg.type === 'image' && (
                <img src={msg.content.image} alt="Uploaded" className="rounded-lg max-w-full" />
              )}

              {/* Bot Messages */}
              {msg.sender === 'bot' && (
                <>
                  {msg.content.transcription && (
                    <p className="text-sm text-gray-600 mb-2 italic">
                      You said: "{msg.content.transcription}"
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{msg.content.text}</p>
                  {msg.content.audio && (
                    <div className="mt-3 flex items-center space-x-2">
                      {playingAudioId === msg.id ? (
                        <>
                          {isPaused ? (
                            <button
                              onClick={resumeAudio}
                              className="flex items-center space-x-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                            >
                              <FaPlay size={14} />
                              <span className="text-sm">Resume</span>
                            </button>
                          ) : (
                            <button
                              onClick={pauseAudio}
                              className="flex items-center space-x-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                            >
                              <FaPause size={14} />
                              <span className="text-sm">Pause</span>
                            </button>
                          )}
                          <button
                            onClick={stopAudio}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaStop size={14} />
                            <span className="text-sm">Stop</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => playAudio(msg.content.audio, msg.id)}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                        >
                          <FaVolumeUp size={14} />
                          <span className="text-sm">Play audio</span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ))}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-center text-red-500 text-sm">{error}</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-gray-100 p-4 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all cursor-pointer font-medium text-gray-700 text-sm"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="hi">🇮🇳 हिं</option>
              <option value="te">🇮🇳 తె</option>
            </select>
            <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>

          {/* Weather Button */}
          <button
            onClick={handleWeatherFetch}
            disabled={isProcessing || isFetchingWeather}
            className={`p-3 rounded-xl flex items-center space-x-2 ${
              isFetchingWeather
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-all`}
          >
            <FaLocationArrow size={16} />
            <span className="text-xs font-semibold">
              {isFetchingWeather ? 'Syncing...' : 'Local weather'}
            </span>
          </button>

          {/* Voice Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
          </button>

          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          >
            <FaImage size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSend()}
            placeholder="Ask about farming, crops, pests..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
          />

          {/* Send Button */}
          <button
            onClick={handleTextSend}
            disabled={isProcessing || !inputText.trim()}
            className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
