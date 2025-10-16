import React from "react";
import "./Footer.css";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import logo from "../assets/logo.png"; // use your actual logo path

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ---------- Left Section ---------- */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="Hlo PG Logo" />
            <h2>Hlo PG</h2>
          </div>
          <p>
            HLOPG helps you find well-maintained and comfortable PG hostels with ease. 
            We provide verified options to ensure a safe and hassle-free stay.
          </p>
        </div>

        {/* ---------- Middle Sections ---------- */}
        <div className="footer-links">
          <div>
            <h4>Top Cities</h4>
            <ul>
              <li><a href="/city/hyderabad">Hyderabad</a></li>
              <li><a href="/city/delhi">Delhi</a></li>
              <li><a href="/city/chennai">Chennai</a></li>
            </ul>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/rules">Rules</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="/tnc">T&amp;C</a></li>
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* ---------- Right Section ---------- */}
        <div className="footer-right">
          <div className="store-buttons">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn"
            >
              <FaGooglePlay /> Get it on <strong>Google Play</strong>
            </a>
            <a
              href="https://www.apple.com/in/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn"
            >
              <FaApple /> Download on the <strong>App Store</strong>
            </a>
          </div>
          <p className="store-text">
            For better experience, download the Hlopg app now
          </p>
        </div>
      </div>

      {/* ---------- Bottom Bar ---------- */}
      <div className="footer-bottom">
        <p>Copyright © 2025, hlopg.in. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
