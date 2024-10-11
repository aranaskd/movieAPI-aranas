import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <div className="container-fluid">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* Admin dashboard route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
