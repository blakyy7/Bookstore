import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <div className="col-md-5">
        <div
          className="card border-0 shadow-lg p-4"
          style={{
            borderRadius: "24px",
            background: "white",
          }}
        >
          <div className="text-center mb-4">
            <h2 className="mb-2" style={{ color: "#111827" }}>
              Welcome Back
            </h2>
            <p className="text-muted mb-0">Login to continue your book journey</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
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

            <div className="mb-4">
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

            <button
              type="submit"
              className="btn btn-dark w-100 py-3"
              style={{ borderRadius: "14px" }}
            >
              Login
            </button>
          </form>

          <p className="mt-4 mb-0 text-center">
            No account yet? <Link to="/signup">Signup here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;