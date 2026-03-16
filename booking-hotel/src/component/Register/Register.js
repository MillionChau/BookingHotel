import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { API_BASE_URL } from "../../config/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập tên đầy đủ";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Tên đầy đủ phải có ít nhất 3 ký tự";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập password";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Mật khẩu ≥6 ký tự, bao gồm chữ hoa, chữ thường và số";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Register successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setErrors({ api: data.message || "Register failed" });
      }
    } catch (error) {
      setErrors({ api: "Network error. Please try again later." });
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
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && (
              <p className="error-message">{errors.fullName}</p>
            )}

            <div className="input-group">
              <i className="bi bi-envelope-fill"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}

            <div className="input-group">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            <div className="input-group">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}

            {errors.api && <p className="error-message">{errors.api}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" className="register-button">
              REGISTER
            </button>

            <div className="register-links">
              <Link to="/login">
                Already have an Account? Login{" "}
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
