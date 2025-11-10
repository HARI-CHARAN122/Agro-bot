import React from 'react'
import { GiPlantWatering } from 'react-icons/gi'
import { motion } from 'framer-motion'

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b-2 border-primary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg">
              <GiPlantWatering className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                AgroBot
              </h1>
              <p className="text-sm text-gray-600 font-medium">Your AI Farming Assistant</p>
            </div>
          </motion.div>

        </div>
      </div>
    </header>
  )
}

export default Header
