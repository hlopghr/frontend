import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Popup.css";
import {
  FaWifi,
  FaFan,
  FaBed,
  FaTv,
  FaLightbulb,
  FaDoorClosed,
  FaChevronLeft,
  FaChevronRight,
  FaShower,
} from "react-icons/fa";
import { MdOutlineSmokeFree, MdNoDrinks } from "react-icons/md";
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

const Popup = ({ hostel = {}, onClose, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [date, setDate] = useState(null); // Calendar starts empty
  const [numDays, setNumDays] = useState(""); // Input starts blank
  const [frontAadhar, setFrontAadhar] = useState(null);
  const [backAadhar, setBackAadhar] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [priceType, setPriceType] = useState("monthly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const fallbackImages = [pg1, pg2, pg3, pg4, pg5];
  const images =
    hostel?.images && hostel.images.length > 0 ? hostel.images : fallbackImages;

  const sharing = hostel?.sharing || {};
  const amenities = hostel?.amenities || {};
  const rules = hostel?.rules || ["No Alcohol", "No Smoking"];
  const deposit = hostel?.deposit || 0;

  const getDisplayedPrice = (price) => {
    if (priceType === "daily") return Math.round(price / 30);
    return price;
  };

  useEffect(() => {
    if (selectedOption && selectedOption.originalPrice) {
      setSelectedOption((prev) => ({
        ...prev,
        price: getDisplayedPrice(prev.originalPrice),
      }));
    }
  }, [priceType]);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const baseRent = selectedOption ? selectedOption.price : 0;
  const rentAmount =
    priceType === "daily"
      ? baseRent * (numDays ? parseInt(numDays, 10) : 0)
      : baseRent;
  const totalAmount = rentAmount + deposit;

  const isPayEnabled =
    selectedOption &&
    date &&
    acceptedTerms &&
    (priceType === "monthly" || (numDays && parseInt(numDays, 10) > 0));

  const prevMainImage = () => {
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextMainImage = () => {
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Clamp number of days input between 1 and 60 if user types
  const handleNumDaysChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setNumDays(""); // Allow blank input
      return;
    }
    value = parseInt(value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > 60) value = 60;
    setNumDays(value);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          ✖
        </button>
        <h2 className="popup-title">Book Your PG</h2>

        <div className="popup-body">
          {/* LEFT SIDE */}
          <div className="popup-left">
            <h3 className="pg-title">{hostel.hostel_name}</h3>
            <p className="pg-sub">{hostel.address}</p>

            {/* Image Carousel */}
            <div className="pg-image-wrapper">
              <button className="main-arrow left" onClick={prevMainImage}>
                <FaChevronLeft />
              </button>
              <div className="pg-image">
                <img src={images[mainImageIndex]} alt="PG" />
              </div>
              <button className="main-arrow right" onClick={nextMainImage}>
                <FaChevronRight />
              </button>
            </div>

            <div className="image-thumbs-wrapper">
              <div className="image-thumbs">
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

            {/* Price Type Toggle */}
            <div className="price-type-toggle">
              <span
                className={`pill-option ${priceType === "daily" ? "active" : ""}`}
                onClick={() => setPriceType("daily")}
              >
                Day Wise
              </span>
              <span
                className={`pill-option ${priceType === "monthly" ? "active" : ""}`}
                onClick={() => setPriceType("monthly")}
              >
                Monthly Wise
              </span>
            </div>

            <div className="sharing-info">
              {selectedOption ? (
                <p>
                  <b>Selected Sharing:</b> {selectedOption.sharing} ₹
                  {selectedOption.price} (
                  {priceType === "daily" ? "Per Day" : "Per Month"})
                </p>
              ) : (
                <p>Select your preferred sharing below</p>
              )}
            </div>

            {/* Price Options */}
            <div className="price-options">
              {sharing && Object.entries(sharing).length > 0 ? (
                Object.entries(sharing).map(([sharingType, price], idx) => {
                  const displayedPrice = getDisplayedPrice(price);
                  return (
                    <button
                      key={idx}
                      className={`price-btn ${
                        selectedOption?.sharing === sharingType ? "active" : ""
                      }`}
                      onClick={() =>
                        setSelectedOption({
                          sharing: sharingType,
                          price: displayedPrice,
                          originalPrice: price,
                        })
                      }
                    >
                      {sharingType} ₹{displayedPrice}
                    </button>
                  );
                })
              ) : (
                <p>No sharing data available</p>
              )}
            </div>

            {/* Amenities */}
            <h3 className="black-text">Furnished</h3>
            <div className="furnished-icons">
              {amenities?.wifi && <span><FaWifi /> WiFi</span>}
              {amenities?.Fan && <span><FaFan /> Fan</span>}
              {amenities?.Bed && <span><FaBed /> Bed</span>}
              {amenities?.Washing && <span><FaTv /> Washing</span>}
              {amenities?.Lights && <span><FaLightbulb /> Lights</span>}
              {amenities?.Cupboard && <span><FaDoorClosed /> Cupboard</span>}
              {amenities?.hot_water && <span><FaShower /> Hot Water</span>}
              {amenities?.locker && <span><FaDoorClosed /> Locker</span>}
            </div>

            {/* Rules */}
            <h3 className="black-text">PG Rules</h3>
            <div className="pg-rules">
              {rules.includes("No Alcohol") && <span><MdNoDrinks /> No Alcohol</span>}
              {rules.includes("No Smoking") && <span><MdOutlineSmokeFree /> No Smoking</span>}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="popup-right">
            <label className="date-label">Select Move-in Date</label>
            <Calendar
              onChange={(value) => setDate(value)} // Only update date when user selects
              value={date}
              minDate={today}
              maxDate={maxDate}
              className="custom-calendar"
            />

            <div className="days-input">
              <label>
                {priceType === "daily" ? "Duration of Stay(Days)" : "Duration of Stay(Months)"}
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={numDays}
                onChange={handleNumDaysChange}
                placeholder="Enter"
                className="editable-number"
              />
            </div>

            {/* Payment Summary */}
            <div className="total-box">
              <h4>Payment Summary</h4>
              <div className="total-line">
                <span>
                  Rent ({selectedOption?.sharing || "N/A"}) (
                  {priceType === "daily"
                    ? `${numDays || 0} Days`
                    : `${numDays || 0} Months`}
                  )
                </span>
                <span>{selectedOption ? `₹${rentAmount}` : "₹0"}</span>
              </div>
              <div className="total-line">
                <span>Deposit</span>
                <span>₹{deposit}</span>
              </div>
              <div className="total-line grand">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Aadhaar Upload */}
            <div className="aadhar-section">
              <label className="upload-box">
                {frontAadhar ? (
                  <img src={frontAadhar} alt="Front Aadhaar" />
                ) : (
                  <span>
                    📄 Front Aadhaar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFrontAadhar)}
                    />
                  </span>
                )}
              </label>

              <label className="upload-box">
                {backAadhar ? (
                  <img src={backAadhar} alt="Back Aadhaar" />
                ) : (
                  <span>
                    📄 Back Aadhaar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setBackAadhar)}
                    />
                  </span>
                )}
              </label>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noreferrer">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              className="pay-btn"
              disabled={!isPayEnabled}
              style={{
                opacity: isPayEnabled ? 1 : 0.6,
                cursor: isPayEnabled ? "pointer" : "not-allowed",
              }}
              onClick={onContinue}
            >
              Proceed to Pay →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
