import React from 'react'

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium">
          Generating your AI design...
        </p>
      </div>
    </div>
  )
}

export default Loading
