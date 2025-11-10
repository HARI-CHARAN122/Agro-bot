import React from 'react'
import { GiPlantWatering, GiWheat, GiWateringCan } from 'react-icons/gi'
import { FaMicrophone, FaImage, FaComments, FaRobot, FaLanguage, FaLeaf } from 'react-icons/fa'
import { motion } from 'framer-motion'

const LandingPage = ({ onStartChat }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-semibold mb-4">
                🌾 AI-Powered Farming Assistant
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Farming
                <span className="block text-primary-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get instant farming advice through voice, text, or images. 
                Speak in your language, get expert solutions powered by AI.
              </p>
              
              {/* CTA Button */}
              <motion.button
                onClick={onStartChat}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-3">
                  <FaComments className="text-2xl" />
                  <span>Start Chatting Now</span>
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </motion.button>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">3+</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">24/7</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">AI</div>
                  <div className="text-sm text-gray-600">Powered</div>
                </div>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                      <FaRobot className="text-white text-2xl" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">AgroBot</div>
                      <div className="text-sm text-green-500 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Online
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <p className="text-gray-700">How do I prevent tomato blight?</p>
                    </div>
                    <div className="bg-primary-500 text-white rounded-2xl p-4">
                      <p>Use copper-based fungicides and ensure proper spacing for air circulation...</p>
                    </div>
                  </div>
                </div>

                {/* Floating Icons */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <GiPlantWatering className="text-white text-3xl" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-14 h-14 bg-earth-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <GiWheat className="text-white text-2xl" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Ways to Get Answers
            </h2>
            <p className="text-xl text-gray-600">
              Choose the method that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Voice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <FaMicrophone className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Voice Mode</h3>
              <p className="text-gray-600 mb-4">
                Speak naturally in your language. Ask questions hands-free while working on your farm.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                  Multi-language support
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                  Audio responses
                </li>
              </ul>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <FaComments className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Text Chat</h3>
              <p className="text-gray-600 mb-4">
                Type your questions and get instant detailed responses. Perfect for quick queries.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                  Fast responses
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                  Easy to reference
                </li>
              </ul>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <FaImage className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Image Analysis</h3>
              <p className="text-gray-600 mb-4">
                Upload photos of crops or pests. Get instant disease identification and treatment advice.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                  Disease detection
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                  Treatment suggestions
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of farmers getting instant AI-powered advice
            </p>
            <motion.button
              onClick={onStartChat}
              className="px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your First Chat →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <div className="container mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <GiPlantWatering className="text-primary-500 text-2xl" />
            <span className="text-white font-bold text-xl">AgroBot</span>
          </div>
          <p className="text-sm">© 2025 AgroBot. Powered by AI for Farmers.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
