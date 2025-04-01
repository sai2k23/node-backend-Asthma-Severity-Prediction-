import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./registration";
import Prediction from "./Prediction";
import { useState, useEffect } from "react";
function App() {
  const [isRegistered, setIsRegistered] = useState(localStorage.getItem("isRegistered"));

  useEffect(() => {
    const checkRegistration = () => setIsRegistered(localStorage.getItem("isRegistered"));
    window.addEventListener("storage", checkRegistration);
    return () => window.removeEventListener("storage", checkRegistration);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/predict" element={isRegistered ? <Prediction /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
