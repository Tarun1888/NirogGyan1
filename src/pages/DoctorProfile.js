
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointment } from '../context/AppointmentContext';
import '../styles/DoctorProfile.css';

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLoading, setError } = useAppointment();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLocalLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    setLocalLoading(true);
    try {
      const response = await fetch(`/api/doctors/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setDoctor(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch doctor');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate(`/book/${id}`);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return <div className="error">Doctor not found</div>;
  }

  return (
    <div className="doctor-profile">
      <button className="back-btn" onClick={handleGoBack}>
        ← Back to Home
      </button>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image">
            <img src={doctor.profile_image} alt={doctor.name} />
            <div className={`status-badge ${doctor.availability_status}`}>
              {doctor.availability_status === 'available' ? 'Available' : 'Busy'}
            </div>
          </div>
          
          <div className="profile-info">
            <h1>{doctor.name}</h1>
            <h2>{doctor.specialization}</h2>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{doctor.experience_years}</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-value">{doctor.rating} ⭐</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <strong>Email:</strong> {doctor.email}
            </div>
            <div className="contact-item">
              <strong>Phone:</strong> {doctor.phone}
            </div>
          </div>

          <div className="availability-info">
            <h3>Availability</h3>
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="btn-primary book-btn"
            onClick={handleBookAppointment}
            disabled={doctor.availability_status !== 'available'}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;