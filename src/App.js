import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppointmentProvider } from './context/AppointmentContext';
import Home from './pages/Home';
import DoctorProfile from './pages/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import './App.css';

function App() {
  return (
    <AppointmentProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/book/:id" element={<BookAppointment />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AppointmentProvider>
  );
}

export default App;