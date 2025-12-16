import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Added useNavigate
import axios from 'axios'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const navigate = useNavigate() // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // 2. Send the data to the correct URL
      const res = await axios.post('http://localhost:8000/api/auth/login', formData, {
        withCredentials: true
      })    
      console.log('Login Success:', res.data)
      alert('Login Successful! 🚀')
      
      // 3. Redirect to Home
      navigate('/') 

    } catch (err) {
      // 4. Handle Error
      console.error(err)
      alert(err.response?.data?.message || 'Login failed! Check your credentials.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 3. Changed Input Label and Name to 'email' */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login