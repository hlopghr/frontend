import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaCheckCircle,
  FaWifi,
  FaShower,
  FaBed,
  FaBroom,
} from "react-icons/fa";
import Header from "../../components/Header";
import api from "../../api";

import pg1 from "../../assets/pg1.jpg";
import pg2 from "../../assets/pg2.jpg";
import pg3 from "../../assets/pg3.jpg";
import pg4 from "../../assets/pg4.jpg";

import hyderabadBg from "../../assets/hyderabad.png";
import chennaiBg from "../../assets/chennai.png";
import bangaloreBg from "../../assets/bangalore.png";
import mumbaiBg from "../../assets/mumbai.png";

import "./CityHostels.css";

const cityImages = {
  hyderabad: hyderabadBg,
  chennai: chennaiBg,
  bangalore: bangaloreBg,
  mumbai: mumbaiBg,
};

const CityHostels = () => {
  const { cityName } = useParams(); // From route: /:cityName
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [filters, setFilters] = useState({ area: "All", gender: "All" });

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        // Map cityName to endpoint (you can adjust endpoints here)
        const endpoints = {
          hyderabad: "/hostel/hydhostels",
          chennai: "/hostel/chehostels",
          bangalore: "/hostel/benhostels",
          mumbai: "/hostel/mumhostels",
        };
        const endpoint = endpoints[cityName.toLowerCase()];
        if (!endpoint) return;

        const res = await api.get(endpoint);
        const data = res.data || [];

        const mappedHostels = data.map((h, index) => {
          let amenities = {};
          try {
            amenities =
              typeof h.amenities === "string"
                ? JSON.parse(h.amenities)
                : h.amenities || {};
          } catch {
            amenities = {};
          }

          let genderIcon = "👨🏻‍💼 Men's PG";
          const genderText = (h.pg_type || "").toLowerCase();
          if (genderText.includes("women")) genderIcon = "💁🏻‍♀️ Women's PG";
          else if (genderText.includes("co")) genderIcon = "👫 Co-Living";

          const images = [pg1, pg2, pg3, pg4];
          const img = images[index % images.length];

          return {
            id: h.hostel_id,
            img,
            name: h.hostel_name,
            area: h.area,
            price: h.price ? `₹${h.price}` : "₹—",
            rating: h.rating || 4.5,
            amenities,
            gender: genderIcon,
          };
        });

        setHostels(mappedHostels);
      } catch (err) {
        console.error(`Error fetching ${cityName} hostels:`, err);
      }
    };

    fetchHostels();
  }, [cityName]);

  const filterOptions = {
    area: ["All", ...new Set(hostels.map((pg) => pg.area))],
    gender: ["All", "Male", "Female"],
  };

  const filteredPGs = hostels.filter((pg) =>
    Object.entries(filters).every(([key, value]) =>
      value === "All"
        ? true
        : key === "area"
        ? pg.area === value
        : pg.gender.includes(value)
    )
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="city-page">
      <Header />

      <div
        className="city-hero"
        style={{ backgroundImage: `url(${cityImages[cityName.toLowerCase()]})` }}
      >
        <div className="city-overlay">
          <h1>Hostels in {cityName.charAt(0).toUpperCase() + cityName.slice(1)}</h1>
          <p>
            Explore the best PGs in {cityName.charAt(0).toUpperCase() + cityName.slice(1)}{" "}
            for a comfortable and convenient stay.
          </p>
        </div>
      </div>

      <div className="area-gender-filter">
        {Object.keys(filterOptions).map((key, idx) => (
          <div key={idx} className="filter-item">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <select
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            >
              {filterOptions[key].map((opt, id) => (
                <option key={id} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="pg-grid">
        {filteredPGs.map((pg) => (
          <div
            key={pg.id}
            className="pg-card"
            onClick={() => navigate(`/hostel/${pg.id}`)}
          >
            <div className="pg-image">
              <img src={pg.img} alt={pg.name} />
              <FaHeart className="wishlist" />
              <FaCheckCircle
                className="verified-badge"
                title="Verified PG"
              />
            </div>
            <div className="pg-info">
              <h3>{pg.name}</h3>
              <p>📍 {pg.area}</p>
              <p className="gender">{pg.gender}</p>
              <div className="rating">
                <FaStar className="star" /> {pg.rating}
              </div>
              <div className="icons">
                {pg.amenities?.wifi && <FaWifi title="Wi-Fi" />}
                {pg.amenities?.hot_water && <FaShower title="Hot Water" />}
                {pg.amenities?.locker && <FaBed title="Locker" />}
                {pg.amenities?.cc_camera && <FaBroom title="CC Camera" />}
              </div>
              <p className="price">
                {pg.price} <span>Per person</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityHostels;
