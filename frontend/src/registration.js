import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "./backgroundanimation.json";
import "./Registration.css";
import axios from "axios";
//import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";//
//import { initializeApp } from "firebase/app";//

//const firebaseConfig = {
 // apiKey: "AIzaSyB6v8nAfSVXw2SCNI2HU5hp5mBGMU98-nY",
  //authDomain: "asthma-prediction.firebaseapp.com",
  //projectId: "asthma-prediction",
  //storageBucket: "asthma-prediction.firebasestorage.app",
  //messagingSenderId: "771654625072",
  //appId: "1:771654625072:web:bcd641ce004d1877d8caf5",
//};

//initializeApp(firebaseConfig);
//const auth = getAuth();

const Register = () => {
  const [user, setUser] = useState({ name: "", mobile: "" });
  const [otp, setOtp] = useState("");
  //const [serverOtp, setServerOtp] = useState("");
  //const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
// 📌 Send OTP via Twilio API
const sendOtp = async () => {
  console.log("Sending OTP to:", user.mobile);
  if (user.mobile.length === 10) {
    try {
      const response = await axios.post("https://node-backend-asthma-severity-prediction.onrender.com/api/send-otp", { 
        mobile: `+91${user.mobile.trim()}` 
      });
      console.log(response.data);
      if (response.data.success) {
        setIsOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      alert("Error sending OTP. Check console.");
      console.error("Send OTP Error:", error);
    }
  } else {
    alert("Enter a valid 10-digit mobile number.");
  }
};

const verifyOtp = async (e) => {
  e.preventDefault();
  if (!otp) {
    alert("Please enter the OTP.");
    return;
  }

  try {
    const response = await axios.post("https://node-backend-asthma-severity-prediction.onrender.com/api/verify-otp", { 
      mobile: `+91${user.mobile.trim()}`,
      otp: otp.trim()
    });

    if (response.data.success) {
      alert("OTP verified successfully!");
      localStorage.setItem("isRegistered", "true");
      window.dispatchEvent(new Event("storage"));  // 🔥 Force UI to update
      navigate("/predict");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  } catch (error) {
    alert("Error verifying OTP. Please try again.");
    console.error("Verify OTP Error:", error);
  }
};



  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Sign Up</h2>
        <form onSubmit={verifyOtp}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="tel" name="mobile" placeholder="Mobile Number" maxLength="10" onChange={handleChange} required />
          <div id="recaptcha-container"></div>
          {!isOtpSent ? (
            <button type="button" onClick={sendOtp}>Send OTP</button>
          ) : (
            <>
              <input type="text" name="otp" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
              <button type="submit">Verify & Sign Up</button>
            </>
          )}
        </form>
      </div>
      <div className="animation-container">
        <Lottie animationData={animationData} className="background-animation" />
      </div>
    </div>
  );
};

export default Register;
