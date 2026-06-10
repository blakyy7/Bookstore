import React, { useEffect, useState } from "react";
import API from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [rentedCount, setRentedCount] = useState(0);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    age: "",
    email: "",
    education: "",
    contactDetails: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/users/me");
        const countRes = await API.get("/users/me/rented-count");
        const rentalsRes = await API.get("/rentals/my");

        setUser(userRes.data);
        setRentedCount(countRes.data.rentedBooksCount);
        setRentalRequests(rentalsRes.data);

        setFormData({
          name: userRes.data.name || "",
          place: userRes.data.place || "",
          age: userRes.data.age || "",
          email: userRes.data.email || "",
          education: userRes.data.education || "",
          contactDetails: userRes.data.contactDetails || "",
          phoneNumber: userRes.data.phoneNumber || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await API.put("/users/me", {
        ...formData,
        age: Number(formData.age),
      });

      setUser(data);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  if (!user) return <h4>Loading profile...</h4>;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div
          className="card border-0 shadow-lg p-4 mb-4"
          style={{ borderRadius: "24px" }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h2 className="mb-2" style={{ color: "#111827" }}>
                My Profile
              </h2>
              <p className="text-muted mb-0">
                Update your details and check your rental history
              </p>
            </div>

            <div
              className="mt-3 mt-md-0 px-4 py-3 rounded-4"
              style={{ background: "#f3f4f6" }}
            >
              <strong>Books Rented:</strong> {rentedCount}
            </div>
          </div>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                className="form-control form-control-lg"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Place</label>
              <input
                className="form-control form-control-lg"
                name="place"
                value={formData.place}
                onChange={handleChange}
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
                onChange={handleChange}
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
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Contact Details</label>
              <input
                className="form-control form-control-lg"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
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
                style={{ borderRadius: "14px" }}
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-dark rounded-pill px-4 py-3"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        <div
          className="card border-0 shadow-lg p-4"
          style={{ borderRadius: "24px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0" style={{ color: "#111827" }}>
              My Rental Requests
            </h4>
          </div>

          {rentalRequests.length === 0 ? (
            <p className="text-muted mb-0">No rental requests yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalRequests.map((rental) => (
                    <tr key={rental._id}>
                      <td>{rental.book?.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            rental.status === "approved"
                              ? "bg-success"
                              : rental.status === "pending"
                              ? "bg-warning text-dark"
                              : rental.status === "returned"
                              ? "bg-secondary"
                              : "bg-danger"
                          }`}
                        >
                          {rental.status}
                        </span>
                      </td>
                      <td>{new Date(rental.createdAt).toLocaleDateString()}</td>
                      <td>
                        {rental.dueDate
                          ? new Date(rental.dueDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;