import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #eee",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div className="container py-2">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
          style={{ color: "#111827" }}
        >
          <span
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7c3aed, #111827)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
            }}
          >
            B
          </span>
          BOOKSTORE
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto gap-lg-2 mt-3 mt-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link px-3 py-2 rounded-pill"
                to="/"
                style={{ color: "#111827" }}
              >
                Home
              </Link>
            </li>

            {token && (
              <li className="nav-item">
                <Link
                  className="nav-link px-3 py-2 rounded-pill"
                  to="/profile"
                  style={{ color: "#111827" }}
                >
                  Profile
                </Link>
              </li>
            )}

            {role === "admin" && (
              <li className="nav-item">
                <Link
                  className="nav-link px-3 py-2 rounded-pill"
                  to="/admin"
                  style={{ color: "#111827" }}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex gap-2 mt-3 mt-lg-0">
            {!token ? (
              <>
                <Link
                  className="btn btn-outline-dark rounded-pill px-4"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-dark rounded-pill px-4"
                  to="/signup"
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                className="btn btn-danger rounded-pill px-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;