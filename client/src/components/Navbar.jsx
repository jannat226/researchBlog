import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        background: "#fafafa",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 22, color: "#2d3748" }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          📝 Blog Platform
        </Link>
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <NavLink to="/" label="Home" />
        <NavLink to="/blogs" label="Blogs" />
        <NavLink to="/login" label="Login" />
        <NavLink to="/register" label="Register" />
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    style={{
      textDecoration: "none",
      color: "#333",
      fontWeight: 500,
      padding: "4px 10px",
      borderRadius: 4,
      transition: "background 0.2s, color 0.2s",
    }}
    onMouseOver={(e) => (e.target.style.background = "#e2e8f0")}
    onMouseOut={(e) => (e.target.style.background = "")}
  >
    {label}
  </Link>
);

export default Navbar;
