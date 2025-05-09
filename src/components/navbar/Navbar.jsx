import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" className="navbar-logo" />
          <span className="nav-shortname">LMS</span>
          <span className="nav-fullname"> Library Management System</span>
        </Link>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user?.role === "admin" && (
            <>
              {location.pathname !== "/add-book" && (
                <li>
                  <Link to="/add-book">Add Book</Link>
                </li>
              )}
            </>
          )}
          <>
            {location.pathname !== "/dashboard" && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
          </>

          {!user ? (
            <>
              {location.pathname === "/signup" ? (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              ) : location.pathname === "/login" ? (
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              ) : null}
            </>
          ) : (
            <>
              <li className="user-info">
                <span className="online-dot"></span> {user.fullname}
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
