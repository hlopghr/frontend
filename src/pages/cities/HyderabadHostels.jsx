import React, { useState } from "react";
import "./CityHostels.css";

import pg1 from "../../assets/pg1.jpg";
import pg2 from "../../assets/pg2.jpg";
import pg3 from "../../assets/pg3.jpg";
import pg4 from "../../assets/pg4.jpg";

import hyderabadBg from "../../assets/hyderabad.png";

import {
  FaHeart, FaStar, FaBed, FaUtensils, FaBroom, FaShower, FaCheckCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function HyderabadHostels() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ area: "All", gender: "All" });

  const pgList = [
    { id: 1, img: pg1, name: "Universe PG", location: "Madhapur", gender: "Male", price: "₹88,952", rating: 4.9 },
    { id: 2, img: pg2, name: "Galaxy PG", location: "Madhapur", gender: "Female", price: "₹70,000", rating: 4.7 },
    { id: 3, img: pg3, name: "Starlight PG", location: "Gachibowli", gender: "Male", price: "₹65,500", rating: 4.6 },
    { id: 4, img: pg4, name: "Cosmos PG", location: "Gachibowli", gender: "Female", price: "₹72,300", rating: 4.8 },
    { id: 5, img: pg1, name: "Milkyway PG", location: "Hitech City", gender: "Male", price: "₹75,000", rating: 4.7 },
    { id: 6, img: pg2, name: "Comet PG", location: "Hitech City", gender: "Female", price: "₹80,500", rating: 4.8 },
    { id: 7, img: pg3, name: "Orbit PG", location: "Madhapur", gender: "Male", price: "₹68,000", rating: 4.5 },
    { id: 8, img: pg4, name: "Meteor PG", location: "Gachibowli", gender: "Female", price: "₹74,300", rating: 4.6 },
  ];

  const filterOptions = {
    area: ["All", ...new Set(pgList.map(pg => pg.location))],
    gender: ["All", "Male", "Female"],
  };

  const filteredPGs = pgList.filter(pg =>
    Object.entries(filters).every(([key, value]) =>
      value === "All" || (key === "area" ? pg.location : pg[key]) === value
    )
  );

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  return (
    <div className="city-page">
      <Header />

      <div className="city-hero" style={{ backgroundImage: `url(${hyderabadBg})` }}>
        <div className="city-overlay">
          <h1>Hostel's in Hyderabad</h1>
          <p>Explore the best PGs in Hyderabad for a comfortable and convenient stay.</p>
        </div>
      </div>

      <div className="area-gender-filter">
        {Object.keys(filterOptions).map((key, idx) => (
          <div key={idx} className="filter-item">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <select value={filters[key]} onChange={e => handleFilterChange(key, e.target.value)}>
              {filterOptions[key].map((opt, id) => <option key={id} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="pg-grid">
        {filteredPGs.map(pg => (
          <div key={pg.id} className="pg-card" onClick={() => navigate(`/hostel/${pg.id}`)}>
            <div className="pg-image">
              <img src={pg.img} alt={pg.name} />
              <FaHeart className="wishlist" />
              <FaCheckCircle className="verified-badge" title="Verified PG" />
            </div>
            <div className="pg-info">
              <h3>{pg.name}</h3>
              <p>{pg.location}</p>
              <div className="rating"><FaStar className="star" /> {pg.rating}</div>
              <div className="icons"><FaBed /> <FaUtensils /> <FaBroom /> <FaShower /></div>
              <p className="price">{pg.price} <span>Per person</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HyderabadHostels;
