import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaHeart,
  FaStar,
  FaBed,
  FaUtensils,
  FaBroom,
  FaShower,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaWifi,
} from "react-icons/fa";
import api from "../api";
import pg1 from "../assets/pg1.jpg";
import hyderabadBg from "../assets/hyderabad.png";
import chennaiBg from "../assets/chennai.png";
import bangaloreBg from "../assets/bangalore.png";

function Home() {
  const navigate = useNavigate();
  const pgRefs = useRef([]);
  const [arrowVisibility, setArrowVisibility] = useState([]);
  const [loadingCities, setLoadingCities] = useState({
    Hyderabad: true,
    Chennai: true,
    Bangalore: true,
    Mumbai : true,
  });

  const [cities, setCities] = useState([
    { name: "Hostel's in Hyderabad", bg: hyderabadBg, link: "/hyderabad", pgList: [] },
    { name: "Hostel's in Chennai", bg: chennaiBg, link: "/chennai", pgList: [] },
    { name: "Hostel's in Bangalore", bg: bangaloreBg, link: "/bangalore", pgList: [] },
  ]);

  useEffect(() => {
    const CACHE_KEY = "citiesData";
    const CACHE_TIME_KEY = "citiesDataTimestamp";
    const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedData && cachedTime && now - cachedTime < CACHE_DURATION) {
      setCities(JSON.parse(cachedData));
      setLoadingCities({ Hyderabad: false, Chennai: false, Bangalore: false });
      return;
    }

    const fetchCityHostels = async (endpoint, cityName) => {
      try {
        const res = await api.get(endpoint);
        const hostels = res.data || [];

        setCities((prevCities) => {
          const updated = prevCities.map((city) => {
            if (!city.name.includes(cityName)) return city;

            const pgList = hostels.map((h) => {
              let amenities = {};
              try {
                amenities =
                  typeof h.amenities === "string" ? JSON.parse(h.amenities) : h.amenities || {};
              } catch {
                amenities = {};
              }

              let genderIcon = "👨🏻‍💼 Men's PG";
              const genderText = (h.pg_type || "").toLowerCase();
              if (genderText.includes("women")) genderIcon = "💁🏻‍♀️ Women's PG";
              else if (genderText.includes("co")) genderIcon = "👫 Co-Living";

              return {
                id: h.hostel_id,
                img: pg1,
                name: h.hostel_name || "Unnamed Hostel",
                location: `📍 ${h.area || city.name.split(" ")[3]}`,
                gender: genderIcon,
                price: h.price ? `₹${h.price}` : "₹—",
                rating: h.rating || 4.5,
                amenities,
              };
            });

            return { ...city, pgList };
          });

          localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
          return updated;
        });
      } catch (err) {
        console.error(`Error fetching ${cityName} hostels:`, err);
      } finally {
        // hide loader for this city
        setLoadingCities((prev) => ({ ...prev, [cityName]: false }));
      }
    };

    // Fetch each city separately (non-blocking)
    fetchCityHostels("/hostel/hydhostels", "Hyderabad");
    fetchCityHostels("/hostel/chehostels", "Chennai");
    fetchCityHostels("/hostel/benhostels", "Bangalore");
  }, []);

  const [currentBg, setCurrentBg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % cities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cities.length]);

  const updateArrowVisibility = (cityIndex) => {
    const container = pgRefs.current[cityIndex];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setArrowVisibility((prev) => {
        const newVis = [...prev];
        newVis[cityIndex] = {
          left: scrollLeft > 0,
          right: scrollLeft + clientWidth < scrollWidth - 1,
        };
        return newVis;
      });
    }
  };

  const scrollPG = (cityIndex, direction) => {
    const container = pgRefs.current[cityIndex];
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
      setTimeout(() => updateArrowVisibility(cityIndex), 300);
    }
  };

  useEffect(() => {
    cities.forEach((_, index) => updateArrowVisibility(index));
  }, [cities]);

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero" style={{ backgroundImage: `url(${cities[currentBg].bg})` }}>
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">Because finding a PG shouldn't feel like a struggle.</p>
        </div>
      </div>

      {/* PG Sections */}
      {cities.map((city, index) => (
        <div key={index} className="city-section">
          <div className="city-header">
            <h2>{city.name}</h2>
            <button className="know-more-btn" onClick={() => navigate(city.link)}>
              View More Hostels
            </button>
          </div>

          {/* Loader */}
          {loadingCities[city.name.split(" ")[2]] ? (
            <div className="loading">Loading {city.name.split(" ")[2]} Hostels...</div>
          ) : (
            <div className="pg-container">
              <button
                className={`arrow left ${arrowVisibility[index]?.left ? "show" : "hide"}`}
                onClick={() => scrollPG(index, "prev")}
              >
                <FaChevronLeft />
              </button>

              <button
                className={`arrow right ${arrowVisibility[index]?.right ? "show" : "hide"}`}
                onClick={() => scrollPG(index, "next")}
              >
                <FaChevronRight />
              </button>

              <div
                className="pg-scroll"
                ref={(el) => (pgRefs.current[index] = el)}
                onScroll={() => updateArrowVisibility(index)}
              >
                <div className="pg-track">
                  {city.pgList.map((pg) => (
                    <div
                      key={pg.id}
                      className="pg-card"
                      onClick={() => navigate(`/hostel/${pg.id}`)}
                    >
                      <div className="pg-image">
                        <img src={pg.img} alt={pg.name} />
                        <FaHeart className="wishlist" />
                        <FaCheckCircle className="verified-badge" title="Verified PG" />
                      </div>
                      <div className="pg-info">
                        <h3>{pg.name}</h3>
                        <p>{pg.location}</p>
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
