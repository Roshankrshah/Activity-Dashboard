import React from 'react';
import logo from '../assets/company-logo.png';
import '../App.css';

function Header() {
  return (
    <header className="navbar">
      <img src={logo} className="navbar-logo" alt="Company Logo" />
      <h1 className="navbar-heading">User Activity Dashboard</h1>
    </header>
  );
}

export default Header;
