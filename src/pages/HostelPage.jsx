// File: src/pages/HostelPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./HostelPage.css";
import {FaWifi, FaFan, FaBed, FaTv,FaLightbulb, FaDoorClosed, FaChevronLeft, FaChevronRight,FaStar,FaShower} from "react-icons/fa";
import { MdOutlineSmokeFree, MdNoDrinks } from "react-icons/md";
import Popup from "../components/Popup";
import api from "../api"; // Axios instance

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

const HostelPage = () => {
  const { hostelId } = useParams(); // hostel ID from route
  const [hostelData, setHostelData] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
 

  // Fetch hostel data
  useEffect(() => {
    const fetchHostel = async () => {
      console.log("Fetching hostel with ID:", hostelId);
      try {
        const res = await api.get(`/hostel/${hostelId}`);
        setHostelData(res.data.data); // backend returns { ok: true, data: {...} }
      } catch (err) {
        console.error("Error fetching hostel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostel();
  }, [hostelId]);

   // Fetch reviews dynamically
  useEffect(() => {
  const fetchReviews = async () => {
    if (!hostelId) return;
    try {
      const res = await api.get(`/reviews/${hostelId}`);
      if (res.data.ok) {
          setHostelData(prev => ({
            ...prev,
            reviews: res.data.data.reviews,
            avgRating: res.data.data.avgRating,
            totalReviews: res.data.data.totalReviews
          }));
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };
    fetchReviews();
  }, [hostelId]);


      // Fetch food menu dynamically
    useEffect(() => {
      const fetchFoodMenu = async () => {
        if (!hostelId) return;

        try {
          const res = await api.get(`/food_menu/${hostelId}`);
          if (res.data.ok) {
            const { breakfast, lunch, dinner } = res.data.data;

            // Transform backend response to array of days
            const days = Object.keys(breakfast || {}).map((day) => ({
              day,
              breakfast: breakfast[day] || "-",
              lunch: lunch[day] || "-",
              dinner: dinner[day] || "-",
            }));

            setFoodMenu(days);
          } else {
            setFoodMenu([]);
          }
        } catch (err) {
          console.error("Error fetching food menu:", err);
          setFoodMenu([]);
        } finally {
          setMenuLoading(false);
        }
      };

      fetchFoodMenu();
    }, [hostelId]);

  // Auto-scroll reviews
  useEffect(() => {
    if (!hostelData?.reviews?.length) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) =>
        prev === hostelData.reviews.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [hostelData]);

  // Images carousel
  const images = hostelData?.images?.length
    ? hostelData.images
    : [pg1, pg2, pg3, pg4, pg5];

  const prevImage = () => {
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleContinue = () => {
    setIsPopupOpen(false);
    setShowPayment(true);
  };
 const handleBookNow = () => {
    const userToken = localStorage.getItem("hlopgToken");
    const ownerToken = localStorage.getItem("hlopgOwner");

    if (ownerToken) {
      alert("You are Logged in as a Hostel owner so  cannot book a PG.");
      return; 
    }

    if (userToken) {
      // logged in as user → show popup
      setIsPopupOpen(true);
    } else {
      // not logged in → redirect to student login
      navigate("/StudentLogin", { state: { from: location.pathname } });
    }
  };
  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      {!showPayment ? (
        <>
          <div className="hostel-main">
            {/* Left: Image Carousel */}
            <div className="hostel-images">
              <div className="main-img">
                <button className="arrow-left" onClick={prevImage}>
                  <FaChevronLeft />
                </button>
                <img src={images[mainImageIndex]} alt="Room" />
                <button className="arrow-right" onClick={nextImage}>
                  <FaChevronRight />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="thumbnail-container">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    className={mainImageIndex === idx ? "active-thumb" : ""}
                    onClick={() => setMainImageIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="hostel-details">
              <h2 className="black-text">{hostelData.hostel_name}</h2>
              <p className="black-text">{hostelData.address}</p>
              <p className="black-text">
                <b>Type of Living:</b> {hostelData.pg_type}'s PG
              </p>

              {/* Pricing */}
              <div className="stats">
                {Object.entries(hostelData.sharing || {}).map(([sharing, price], idx) => (
                  <div key={idx} className="stat-container">
                    <span className="stat-btn black-text">
                      {sharing} 👤 ₹{price}
                    </span>
                  </div>
                ))}
              </div>

                  {/* Furnished */}
                  <h3 className="black-text">Furnished</h3>
                  <div className="furnished-icons">
                    {hostelData.amenities?.wifi &&  <span className="black-text"><FaWifi /> Free WiFi</span>}
                    {hostelData.amenities?.Fan &&  <span className="black-text"><FaFan /> Fan</span>}
                    {hostelData.amenities?.Bed &&  <span className="black-text"><FaBed /> Bed</span>}
                    {hostelData.amenities?.Washing &&  <span className="black-text"><FaTv /> Washing</span>}
                    {hostelData.amenities?.Lights &&  <span className="black-text"><FaLightbulb /> Lights</span>}
                    {hostelData.amenities?.Cupboard &&  <span className="black-text"><FaDoorClosed /> Cupboard</span>} 
                    {hostelData.amenities?.hot_water &&  <span className="black-text"><FaShower /> Hot Water</span>} 
                    {hostelData.amenities?.locker &&  <span className="black-text"><FaDoorClosed /> Locker</span>} 
                  </div>

              {/* Rules */}
              <h3 className="black-text">PG Rules</h3>
              <div className="pg-rules">
                {/* {hostelData.rules?.includes("No Alcohol") && <span className="black-text"><MdNoDrinks /> No Alcohol</span>}
                {hostelData.rules?.includes("No Smoking") && <span className="black-text"><MdOutlineSmokeFree /> No Smoking</span>} */} 
                {/* //dynamic rules from backend */}
                <span className="black-text"><MdNoDrinks /> No Alcohol</span>
                <span className="black-text"><MdOutlineSmokeFree /> No Smoking</span>
              </div>

              {/* Reviews */}
                  <div className="reviews-section">
                    <h2 className="black-text">PG Reviews</h2>
                    <div className="rating">
                      <span>Over all Rating : {hostelData.rating || "N/A"} </span>
                      <FaStar color="#FFD700" />
                    </div>

                    {hostelData.reviews && hostelData.reviews.length > 0 ? (
                      hostelData.reviews.map((review, idx) => (
                        <div
                          key={idx}
                          className={`review-card ${currentReviewIndex === idx ? "active" : ""}`}
                        >
                          {/* <p className="black-text">
                            ⭐ {review.rating || "No rating"} / 5
                          </p> */}
                          <p className="black-text">
                           ⭐ {review.rating || "No rating"}   {review.review_text || "No review text provided."}
                          </p>
                          {/* <small className="black-text">
                            Posted on {new Date(review.created_at).toLocaleDateString()}
                          </small> */}
                        </div>
                      ))
                    ) : (
                      <p className="black-text">No reviews available yet.</p>
                    )}
                  </div>


            </div>
          </div>

     {/* Food Menu */}
<div className="food-menu">
  <h2 className="black-text">Food Menu</h2>
  {menuLoading ? (
    <p>Loading food menu...</p>
  ) : foodMenu.length ? (
    <table>
      <thead>
        <tr>
          <th>DAY</th>
          <th>BREAKFAST</th>
          <th>LUNCH</th>
          <th>DINNER</th>
        </tr>
      </thead>
      <tbody>
        {foodMenu.map((day, idx) => (
          <tr key={idx}>
            <td>{day.day}</td>
            <td>{day.breakfast || "-"}</td>
            <td>{day.lunch || "-"}</td>
            <td>{day.dinner || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No food menu available.</p>
  )}
</div>

          {/* Book Now */}
          <div className="book-now">
            <button className="black-text" onClick={handleBookNow}>
              Book Now
            </button>
          </div>

          {isPopupOpen && (
            <Popup
              hostel={hostelData}
              onClose={() => setIsPopupOpen(false)}
              onContinue={handleContinue}
            />
          )}
        </>
      ) : (
        /* Payment Screen */
        <div className="payment-screen">
          <h2>Complete Payment</h2>
          <div className="payment-content">
            <div className="pg-details">
              <img src={images[mainImageIndex]} alt="PG" />
              <h3>{hostelData.name}</h3>
              <p>{hostelData.location}</p>
              <div className="payment-stats">
                <p>Please complete the booking in the popup first.</p>
              </div>
            </div>
            <div className="payment-summary">
              <button className="continue-btn">Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelPage;
