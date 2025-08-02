
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointment } from '../context/AppointmentContext';
import AppointmentForm from '../components/AppointmentForm';
import '../styles/BookAppointment.css';

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setError, addAppointment } = useAppointment();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
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
    }
  };

  const handleBookingSubmit = async (appointmentData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (response.ok) {
        addAppointment(data.data);
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to book appointment');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/doctor/${id}`);
  };

  if (!doctor) {
    return <div className="loading">Loading...</div>;
  }

  if (success) {
    return (
      <div className="booking-success">
        <div className="success-container">
          <h2>✅ Appointment Booked Successfully!</h2>
          <p>Your appointment with {doctor.name} has been confirmed.</p>
          <p>You will receive a confirmation email shortly.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment">
      <button className="back-btn" onClick={handleGoBack}>
        ← Back to Profile
      </button>

      <div className="booking-container">
        <div className="doctor-summary">
          <img src={doctor.profile_image} alt={doctor.name} />
          <div>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialization}</p>
          </div>
        </div>

        <AppointmentForm 
          doctor={doctor}
          onSubmit={handleBookingSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default BookAppointment;