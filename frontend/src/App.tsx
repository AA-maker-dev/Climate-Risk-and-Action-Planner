import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RiskAssessment from './pages/RiskAssessment'
import ActionPlan from './pages/ActionPlan'
import CarbonFootprint from './pages/CarbonFootprint'
import Predictions from './pages/Predictions'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assess" element={<RiskAssessment />} />
            <Route path="/actions" element={<ActionPlan />} />
            <Route path="/footprint" element={<CarbonFootprint />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
