import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../constants";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${api}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data,"data");
      

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data);
      showToast(`${data.fullname}`, "success");
      navigate("/dashboard");
    } catch (error) {
      showToast(`${error.message}`, "error");
      setErrors({ apiError: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccount = () => {
    setFormData({ email: "admin@gmail.com", password: "Admin@1234" });
  };
  const handleUserAccount = () => {
    setFormData({ email: "user@gmail.com", password: "User@1234" });
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      {loading && (
        <div className="loadingBox">
          <div className="loader"></div>
        </div>
      )}
      {errors.apiError && <p className="error-message">{errors.apiError}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="login-input"
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label htmlFor="password">Password</label>
        <div className="password-field">
          <input
            className="login-input password-input"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <span className="error">{errors.password}</span>}

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="login-sample__credentials">
        <h3>Sample Credentials</h3>
        <div className="login-sample__buttons">
          <button onClick={handleAdminAccount}>Admin Account</button>
          <button onClick={handleUserAccount}>User Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
