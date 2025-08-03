
import React, { useState } from 'react';
import '../styles/AppointmentForm.css';

function AppointmentForm({ doctor, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    appointment_date: '',
    appointment_time: ''
  });
  const [errors, setErrors] = useState({});


  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }

    if (!formData.patient_email.trim()) {
      newErrors.patient_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.patient_email)) {
      newErrors.patient_email = 'Email is invalid';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Appointment date is required';
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Appointment time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        doctor_id: doctor.id
      });
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book Appointment with {doctor.name}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patient_name">Patient Name *</label>
          <input
            type="text"
            id="patient_name"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            className={errors.patient_name ? 'error' : ''}
          />
          {errors.patient_name && <span className="error-message">{errors.patient_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="patient_email">Email Address *</label>
          <input
            type="email"
            id="patient_email"
            name="patient_email"
            value={formData.patient_email}
            onChange={handleChange}
            className={errors.patient_email ? 'error' : ''}
          />
          {errors.patient_email && <span className="error-message">{errors.patient_email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="appointment_date">Appointment Date *</label>
          <input
            type="date"
            id="appointment_date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            min={today}
            className={errors.appointment_date ? 'error' : ''}
          />
          {errors.appointment_date && <span className="error-message">{errors.appointment_date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="appointment_time">Appointment Time *</label>
          <select
            id="appointment_time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            className={errors.appointment_time ? 'error' : ''}
          >
            <option value="">Select a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.appointment_time && <span className="error-message">{errors.appointment_time}</span>}
        </div>

        <button 
          type="submit" 
          className="btn-primary submit-btn"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;
