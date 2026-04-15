import React from 'react'

const Card = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        <form className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />

          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Card