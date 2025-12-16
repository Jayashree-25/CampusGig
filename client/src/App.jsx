import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login' // Import the new file

// Placeholder for now
const Home = () => <h1 className="text-2xl p-10">Home Page</h1>
const Register = () => <h1 className="text-2xl p-10">Register Page</h1>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App