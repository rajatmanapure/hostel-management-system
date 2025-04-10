import React, { useState, useEffect, useRef } from "react";
import "./Slider.css"; // Ensure this file exists
import img1 from "../images/img1.jpg"; // Corrected path
import img2 from "../images/img2.jpg"; // Corrected path

const images = [img1, img2];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const startSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  useEffect(() => {
    startSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="slider-container">
      <div className="slider">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="main-image active"
        />
      </div>
    </div>
  );
};

export default Slider;
