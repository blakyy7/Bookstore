import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    age: "",
    email: "",
    education: "",
    contactDetails: "",
    phoneNumber: "",
    password: "",
    termsAccepted: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/signup", {
        ...formData,
        age: Number(formData.age),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <div className="col-md-8">
        <div
          className="card border-0 shadow-lg p-4"
          style={{
            borderRadius: "24px",
            background: "white",
          }}
        >
          <div className="text-center mb-4">
            <h2 className="mb-2" style={{ color: "#111827" }}>
              Create Account
            </h2>
            <p className="text-muted mb-0">Join the bookstore library system</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
  className="form-control form-control-lg"
  name="name"
  value={formData.name}
  onChange={(e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
  }}
  required
  style={{ borderRadius: "14px" }}
/>
            </div>

            <div className="col-md-6">
              <label className="form-label">Place</label>
              <input
  className="form-control form-control-lg"
  name="place"
  value={formData.place}
  onChange={(e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setFormData((prev) => ({
      ...prev,
      place: value,
    }));
  }}
  required
  style={{ borderRadius: "14px" }}
/>
            </div>

            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control form-control-lg"
                name="age"
                value={formData.age}
                onChange={(e) => {
  if (/^[A-Za-z\s]*$/.test(e.target.value)) {
    handleChange(e);
  }
}}
                required
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Education</label>
              <input
                className="form-control form-control-lg"
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <textarea
  className="form-control form-control-lg"
  name="contactDetails"
  value={formData.contactDetails}
  onChange={handleChange}
  placeholder="House Name, Street, City, State"
  required
  rows="3"
  style={{ borderRadius: "14px" }}
/>
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control form-control-lg"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label">
                  I agree that if the book is not returned or is damaged, fine will be charged.
                </label>
              </div>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-dark w-100 py-3"
                style={{ borderRadius: "14px" }}
              >
                Signup
              </button>
            </div>
          </form>

          <p className="mt-4 mb-0 text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;