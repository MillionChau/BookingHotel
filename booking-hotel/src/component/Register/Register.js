import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; 

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5360/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Register successful! Redirecting to login...');
        // đợi một chút rồi chuyển hướng sang login
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Register failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="register-body">
      <div className="register-container">
        <div className="register-illustration">
          <Link to="/" className="illustration-circle-link">
            <div className="illustration-circle">
              <i className="bi bi-building"></i>
            </div>
          </Link>
        </div>
        <div className="register-form-section">
          <form onSubmit={handleSubmit} noValidate>
            <h2>Create Account</h2>

            <div className="input-group">
              <i className="bi bi-person-fill"></i>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="bi bi-envelope-fill"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" className="register-button">REGISTER</button>

            <div className="register-links">
              <Link to="/login">
                Already have an Account? Login <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
