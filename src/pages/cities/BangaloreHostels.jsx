import React, { useState } from "react";
import "./CityHostels.css";

import pg1 from "../../assets/pg1.jpg";
import pg2 from "../../assets/pg2.jpg";
import pg3 from "../../assets/pg3.jpg";
import pg4 from "../../assets/pg4.jpg";

import bangaloreBg from "../../assets/bangalore.png";

import {
  FaHeart,
  FaStar,
  FaBed,
  FaUtensils,
  FaBroom,
  FaShower,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function BangaloreHostels() {
  const navigate = useNavigate();

  // Unified filters state
  const [filters, setFilters] = useState({
    area: "All",
    gender: "All",
  });

  const pgList = [
    { id: 1, img: pg1, name: "TechNest PG", location: "Indiranagar", gender: "Male", price: "₹75,000", rating: 4.8 },
    { id: 2, img: pg2, name: "Silicon PG", location: "Whitefield", gender: "Female", price: "₹72,500", rating: 4.6 },
    { id: 3, img: pg3, name: "Garden PG", location: "Koramangala", gender: "Male", price: "₹68,000", rating: 4.5 },
    { id: 4, img: pg4, name: "Cloud PG", location: "Whitefield", gender: "Female", price: "₹70,000", rating: 4.7 },
    { id: 5, img: pg1, name: "ParkView PG", location: "Indiranagar", gender: "Female", price: "₹74,000", rating: 4.6 },
    { id: 6, img: pg2, name: "Prime PG", location: "Koramangala", gender: "Male", price: "₹73,000", rating: 4.5 },
    { id: 7, img: pg3, name: "Luxe PG", location: "Whitefield", gender: "Male", price: "₹77,000", rating: 4.8 },
    { id: 8, img: pg4, name: "Urban PG", location: "Indiranagar", gender: "Female", price: "₹79,000", rating: 4.7 },
  ];

  // Dynamically generate options for each filter
  const filterOptions = {
    area: ["All", ...new Set(pgList.map(pg => pg.location))],
    gender: ["All", "Male", "Female"],
  };

  // Filter PGs dynamically based on all filters
  const filteredPGs = pgList.filter(pg =>
    Object.entries(filters).every(([key, value]) =>
      value === "All" || (key === "area" ? pg.location : pg[key]) === value
    )
  );

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  return (
    <div className="city-page">
      <Header />

      <div className="city-hero" style={{ backgroundImage: `url(${bangaloreBg})` }}>
        <div className="city-overlay">
          <h1>Hostel's in Bangalore</h1>
          <p>Find modern and affordable PGs in Bangalore for students and professionals.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="area-gender-filter">
        {Object.keys(filterOptions).map((filterKey, idx) => (
          <div key={idx} className="filter-item">
            <label>{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}:</label>
            <select
              value={filters[filterKey]}
              onChange={e => handleFilterChange(filterKey, e.target.value)}
            >
              {filterOptions[filterKey].map((option, id) => (
                <option key={id} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* PG Grid */}
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

export default BangaloreHostels;
