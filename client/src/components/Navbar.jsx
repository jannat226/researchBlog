// client/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import {
  PenTool,
  BookOpen,
  Home,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <BookOpen size={28} />
          <span>ResearchBlog</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-menu">
        <NavLink to="/" icon={Home} active={isActive("/")}>Home</NavLink>
        <NavLink to="/blogs" icon={BookOpen} active={isActive("/blogs")}>Blogs</NavLink>

          {user ? (
            <>
              <NavLink to="/create" icon={PenTool} active={isActive("/create")}>
                Write
              </NavLink>
              <div className="navbar-user">
                <div className="user-info">
                  <User size={20} />
                  <span>{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
            <NavLink to="/login" icon={LogIn} active={isActive("/login")}>Login</NavLink>
            <NavLink to="/register" icon={UserPlus} active={isActive("/register")} className="btn btn-primary btn-sm">
                to="/register"
                icon={UserPlus}
                active={isActive("/register")}
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <MobileNavLink
              to="/"
              icon={Home}
              active={isActive("/")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              to="/blogs"
              icon={BookOpen}
              active={isActive("/blogs")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </MobileNavLink>

            {user ? (
              <>
                <MobileNavLink
                  to="/create"
                  icon={PenTool}
                  active={isActive("/create")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Write
                </MobileNavLink>
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    <User size={20} />
                    <span>{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm w-full"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink
                  to="/login"
                  icon={LogIn}
                  active={isActive("/login")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </MobileNavLink>
                <Link
                  to="/register"
                  className="btn btn-primary w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </>
    {/* Styles moved to App.css */}
          .navbar-container {
            padding: 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

// NavLink component for desktop
const NavLink = ({ to, icon: Icon, children, active, className = "" }) => (
  <Link to={to} className={`nav-link ${active ? "active" : ""} ${className}`}>
    <Icon size={18} />
    <span>{children}</span>
    <style jsx>{`
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        text-decoration: none;
        color: #718096;
        font-weight: 500;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .nav-link:hover,
      .nav-link.active {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
      }

      .nav-link.active {
        font-weight: 600;
      }
    {/* Styles moved to App.css */}
        transition: all 0.3s ease;
      }

      .mobile-nav-link:hover,
      .mobile-nav-link.active {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }

      .mobile-nav-link.active {
        font-weight: 600;
      }
    `}</style>
  </Link>
);

export default Navbar;
