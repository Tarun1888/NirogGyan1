import React, { useEffect } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import SearchBar from '../components/SearchBar';
import '../styles/Home.css';

function Home() {
  const {
    doctors,
    loading,
    error,
    searchQuery,
    setLoading,
    setError,
    setDoctors,
    setSearchQuery
  } = useAppointment();

  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (search = '') => {
    setLoading(true);
    try {
      const url = search
        ? `/api/doctors?search=${encodeURIComponent(search)}`
        : '/api/doctors';

      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        setDoctors(data.data);
      } else {
        if (res.status === 401 || res.status === 403) {
          navigate('/login');
        } else {
          throw new Error(data.error || 'Failed to fetch doctors');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchDoctors(query);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-content">
          <div>
            <h1>HealthCare Appointment Booking</h1>
            <p>Find and book appointments with qualified healthcare professionals</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="search-section">
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="doctors-section">
        <h2>Available Doctors</h2>
        {doctors.length === 0 ? (
          <div className="no-results">
            {searchQuery ? `No doctors found for "${searchQuery}"` : 'No doctors available'}
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
