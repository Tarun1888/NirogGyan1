import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DoctorCard.css';

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/doctor/${doctor.id}`);
  };

  const handleBookAppointment = () => {
    navigate(`/book/${doctor.id}`);
  };

  return (
    <div className="doctor-card">
      <div className="doctor-image">
        <img src={doctor.profile_image} alt={doctor.name} />
        <div className={`status-badge ${doctor.availability_status}`}>
          {doctor.availability_status === 'available' ? 'Available' : 'Busy'}
        </div>
      </div>
      
      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialization">{doctor.specialization}</p>
        
        <div className="doctor-details">
          <div className="detail-item">
            <span className="label">Experience:</span>
            <span className="value">{doctor.experience_years} years</span>
          </div>
          <div className="detail-item">
            <span className="label">Rating:</span>
            <span className="value">
              {doctor.rating} ⭐
            </span>
          </div>
        </div>
        
        <div className="doctor-actions">
          <button 
            className="btn-secondary" 
            onClick={handleViewProfile}
          >
            View Profile
          </button>
          <button 
            className="btn-primary" 
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

export default DoctorCard;