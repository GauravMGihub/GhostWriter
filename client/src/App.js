import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", linkedin: "", github: "", portfolio: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/profile").then((res) => {
      if (res.data) setFormData(prev => ({ ...prev, ...res.data }));
    }).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await axios.put("http://localhost:5000/api/profile", formData);
      setStatus("✅ Saved Successfully!");
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      setStatus("❌ Error Saving");
    }
  };

  return (
    <div className="container">
      <h1>👻 GhostWriter Dashboard</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} /></div>
          <div className="form-group"><label>Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} /></div>
          <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
          <div className="form-group"><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} /></div>
          <h3>Links</h3>
          <div className="form-group"><label>LinkedIn</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} /></div>
          <div className="form-group"><label>GitHub</label><input type="text" name="github" value={formData.github} onChange={handleChange} /></div>
          <button type="submit" className="save-btn">Save Profile</button>
          {status && <p className="status-msg">{status}</p>}
        </form>
      </div>
    </div>
  );
}
export default App;