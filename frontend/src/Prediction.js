import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loadingAnimation from "./loadingAnimation.json";
import Lottie from "lottie-react";
import "./App.css";

const Prediction = () => {
    const [formData, setFormData] = useState({
        pm25: "",
        pm10: "",
        temperature: "",
        humidity: "",
        phone: "",
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        // Show loading animation when entering page
        setTimeout(() => {
            setLoading(false); // Hide loading after 3 seconds
        }, 3000);
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        // **Simulated Prediction (Replace with actual API call)**
        const severityLevels = ["Safe", "Moderate", "High"];
        const randomIndex = Math.floor(Math.random() * severityLevels.length);
        const predictedSeverity = severityLevels[randomIndex];
        setPrediction(predictedSeverity);

        // **Send SMS Notification**
        sendSMSNotification(formData.phone, predictedSeverity);
    };
    const sendSMSNotification = async (phone, severity) => {
        try {
            const response = await axios.post("https://node-backend-asthma-severity-prediction.onrender.com/send-sms", {
                phone,
                message: `Your predicted asthma severity is: ${severity}. Please take necessary precautions.`,
            });
            console.log(response.data);
            alert("SMS sent successfully!");
        } catch (error) {
            console.error("Failed to send SMS:", error);
            alert("Failed to send SMS. Please try again.");
        }
    };
    // Function to handle logout
    const handleLogout = () => {

        navigate("/"); // Redirect user to signup page
    };

    return (
        <div className="prediction-wrapper">
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
            {/* Show Loading Animation when entering the page */}
            {loading ? (
                <div className="loading-screen">
                    <Lottie animationData={loadingAnimation} className="loading-animation" />
                    <h3>Loading Prediction Page...</h3>
                </div>
            ) : (
                <div className="prediction-container">

                    <h2>Asthma Severity Prediction</h2>
                    <form className="prediction-form" onSubmit={handleSubmit}>
                        <input
                            type="number"
                            name="pm25"
                            step="0.000000000000001"
                            placeholder="PM2.5 Level"
                            value={formData.pm25}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="pm10"
                            step="0.000000000000001"
                            placeholder="PM10 Level"
                            value={formData.pm10}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="temperature"
                            step="0.000000000000001"
                            placeholder="Temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="humidity"
                            step="0.000000000000001"
                            placeholder="Humidity (%)"
                            value={formData.humidity}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter Phone Number (+91XXXXXXXXXX)"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="^\+91[0-9]{10}$"  // Ensures valid Indian phone number
                            required
                        />
                        <button type="submit">Predict & Send SMS</button>
                    </form>
                    {prediction && (
                        <div className="prediction-result">
                            <h3>Predicted Severity: <span>{prediction}</span></h3>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default Prediction;
