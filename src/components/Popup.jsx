import React, { useState } from "react";
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
  FaShower
} from "react-icons/fa";
import { MdOutlineSmokeFree, MdNoDrinks } from "react-icons/md";
// ✅ Import your images here
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";


const Popup = ({ hostel = {}, onClose, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState(null);
const [date, setDate] = useState(null); // start with null
  const [frontAadhar, setFrontAadhar] = useState(null);
  const [backAadhar, setBackAadhar] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const today = new Date();

  // Max booking date: today + 2 months
const maxDate = new Date();
maxDate.setMonth(today.getMonth() + 2);

const [acceptedTerms, setAcceptedTerms] = useState(false); // New state


  // ✅ Use imported images as fallback
  const fallbackImages = [pg1, pg2, pg3, pg4, pg5];
  const images =
    hostel?.images && hostel.images.length > 0 ? hostel.images : fallbackImages;

  const sharing = hostel?.sharing || {};
  const amenities = hostel?.amenities || {};
  const rules = hostel?.rules || ["No Alcohol", "No Smoking"];
  const deposit = hostel?.deposit || 0;

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const totalAmount = selectedOption ? selectedOption.price + deposit : 0;
const isPayEnabled = selectedOption && date && acceptedTerms;

  const prevMainImage = () => {
    setMainImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextMainImage = () => {
    setMainImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
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

            {/* Main Image with Arrows */}
          {/* Main Image */}
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

             {/* Thumbnails */}
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


            {/* Selected Sharing Info */}
            <div className="sharing-info">
              {selectedOption ? (
                <p>
                  <b>Selected Sharing:</b> {selectedOption.sharing} ₹{selectedOption.price}
                </p>
              ) : (
                <p>Select your preferred sharing below</p>
              )}
            </div>

            {/* Sharing Options */}
            <div className="price-options">
              {sharing && Object.entries(sharing).length > 0 ? (
                Object.entries(sharing).map(([sharingType, price], idx) => (
                  <button
                    key={idx}
                    className={`price-btn ${
                      selectedOption?.sharing === sharingType ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedOption({ sharing: sharingType, price })
                    }
                  >
                    {sharingType} ₹{price}
                  </button>
                ))
              ) : (
                <p>No sharing data available</p>
              )}
            </div>

            {/* Amenities */}
            <h3 className="black-text">Furnished</h3>
            <div className="furnished-icons">
              {amenities?.wifi && (
                <span className="black-text"><FaWifi /> Free WiFi</span>
              )}
              {amenities?.Fan && (
                <span className="black-text"><FaFan /> Fan</span>
              )}
              {amenities?.Bed && (
                <span className="black-text"><FaBed /> Bed</span>
              )}
              {amenities?.Washing && (
                <span className="black-text"><FaTv /> Washing</span>
              )}
              {amenities?.Lights && (
                <span className="black-text"><FaLightbulb /> Lights</span>
              )}
              {amenities?.Cupboard && (
                <span className="black-text"><FaDoorClosed /> Cupboard</span>
              )}
              {amenities?.hot_water && (
                <span className="black-text"><FaShower /> Hot Water</span>
              )}
              {amenities?.locker && (
                <span className="black-text"><FaDoorClosed /> Locker</span>
              )}
            </div>

            {/* Rules */}
            <h3 className="black-text">PG Rules</h3>
            <div className="pg-rules">
              {rules.includes("No Alcohol") && (
                <span className="black-text"><MdNoDrinks /> No Alcohol</span>
              )}
              {rules.includes("No Smoking") && (
                <span className="black-text"><MdOutlineSmokeFree /> No Smoking</span>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="popup-right">
            <label className="date-label">Select Move-in Date</label>
                <Calendar
                  onChange={setDate}
                  value={date}
                  minDate={today}      // no previous dates
                  maxDate={maxDate}    // limit to 2 months ahead
                  className="custom-calendar"
                />
            <div className="total-box">
              <h4>Payment Summary</h4>
              <div className="total-line">
                <span>Rent ({selectedOption?.sharing || "N/A"})</span>
                <span>{selectedOption ? `₹${selectedOption.price}` : "₹0"}</span>
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

            {/* Terms & Conditions */}
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />{" "}
              <label htmlFor="terms">
                 I agree to the <a href="/terms" target="_blank">Terms & Conditions</a>
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
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
