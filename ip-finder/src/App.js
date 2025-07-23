// App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "./components/Map";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [ip, setIp] = useState("");
  const [inputIP, setInputIP] = useState("");
  const [location, setLocation] = useState(null);
  const [isp, setIsp] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch initial IP location on load
  useEffect(() => {
    const fetchInitialIP = async () => {
      try {
        const ipRes = await axios.get("https://api.ipify.org?format=json");
        const userIP = ipRes.data.ip;

        const locRes = await axios.get(`https://ipwho.is/${userIP}`);
        const { latitude, longitude, city, region, country, connection } = locRes.data;

        setIp(userIP);
        setLocation({
          lat: latitude,
          lon: longitude,
          city,
          region,
          country,
        });
        setIsp(connection?.isp);
        setHistory([userIP]);
      } catch (error) {
        console.error("Failed to fetch IP info", error);
      }
    };

    fetchInitialIP();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://ipwho.is/${inputIP}`);
      const { latitude, longitude, city, region, country, connection } = res.data;

      setIp(inputIP);
      setLocation({
        lat: latitude,
        lon: longitude,
        city,
        region,
        country,
      });
      setIsp(connection?.isp);
      setHistory((prev) => [...new Set([inputIP, ...prev])]);
    } catch (err) {
      alert("Failed to find IP info");
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="header">
        <h1>🌐 IP Address Finder</h1>
        <label className="toggle">
          <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
          <span>{darkMode ? "🌙 Dark" : "☀️ Light"}</span>
        </label>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Enter IP address"
          value={inputIP}
          onChange={(e) => setInputIP(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="info">
        <h2>What is my IPv4 address?</h2>
        <p className="ip">{ip}</p>
        {location && (
          <>
            <p>
              <strong>Approximate location:</strong> {location.city}, {location.region}, {location.country}
            </p>
            <p>
              <strong>Internet Service Provider (ISP):</strong> {isp}
            </p>
          </>
        )}
        {history.length > 0 && (
          <div className="history">
            <strong>Search History:</strong>
            <ul>
              {history.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="map-container">
        {location && <Map lat={location.lat} lon={location.lon} />}
      </div>
    </div>
  );
}

export default App;