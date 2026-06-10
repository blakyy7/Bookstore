import React, { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    uniqueId: "",
    title: "",
    author: "",
    publicationYear: "",
    genre: "",
    isbn: "",
    availabilityStatus: true,
  });

  const [editBookId, setEditBookId] = useState(null);

  const fetchData = async () => {
    try {
      const booksRes = await API.get("/admin/books");
      const usersRes = await API.get("/admin/users");
      const rentalsRes = await API.get("/admin/rentals");

      setBooks(booksRes.data);
      setUsers(usersRes.data);
      setRentals(rentalsRes.data);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "availabilityStatus"
          ? e.target.checked
          : e.target.value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/books", {
        ...formData,
        publicationYear: Number(formData.publicationYear),
      });

      setMessage("Book added successfully");
      setFormData({
        uniqueId: "",
        title: "",
        author: "",
        publicationYear: "",
        genre: "",
        isbn: "",
        availabilityStatus: true,
      });
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add book");
    }
  };

  const handleEditClick = (book) => {
    setEditBookId(book._id);
    setFormData({
      uniqueId: book.uniqueId || "",
      title: book.title || "",
      author: book.author || "",
      publicationYear: book.publicationYear || "",
      genre: book.genre || "",
      isbn: book.isbn || "",
      availabilityStatus: book.availabilityStatus,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.put(`/books/${editBookId}`, {
        ...formData,
        publicationYear: Number(formData.publicationYear),
      });

      setMessage("Book updated successfully");
      setEditBookId(null);
      setFormData({
        uniqueId: "",
        title: "",
        author: "",
        publicationYear: "",
        genre: "",
        isbn: "",
        availabilityStatus: true,
      });
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update book");
    }
  };

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm("Delete this book?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/books/${id}`);
      setMessage("Book deleted successfully");
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete book");
    }
  };

  const handleBlock = async (id) => {
    try {
      await API.patch(`/admin/users/${id}/block`);
      setMessage("User blocked");
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed");
    }
  };

  const handleUnblock = async (id) => {
    try {
      await API.patch(`/admin/users/${id}/unblock`);
      setMessage("User unblocked");
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed");
    }
  };

  const handleRentalStatus = async (id, status) => {
    try {
      await API.put(`/rentals/${id}`, { status });
      setMessage(`Rental marked as ${status}`);
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2" style={{ color: "#111827" }}>
            Admin Dashboard
          </h2>
          <p className="text-muted mb-0">
            Manage books, users, and rental requests
          </p>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div
        className="card border-0 shadow-lg p-4 mb-5"
        style={{ borderRadius: "24px" }}
      >
        <h4 className="mb-4" style={{ color: "#111827" }}>
          {editBookId ? "Edit Book" : "Add Book"}
        </h4>

        <form
          onSubmit={editBookId ? handleUpdateBook : handleAddBook}
          className="row g-3"
        >
          <div className="col-md-6">
            <label className="form-label">Unique ID</label>
            <input
              className="form-control form-control-lg"
              name="uniqueId"
              value={formData.uniqueId}
              onChange={handleChange}
              required
              style={{ borderRadius: "14px" }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control form-control-lg"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ borderRadius: "14px" }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Author</label>
            <input
              className="form-control form-control-lg"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              style={{ borderRadius: "14px" }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Publication Year</label>
            <input
              type="number"
              className="form-control form-control-lg"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              required
              style={{ borderRadius: "14px" }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Genre</label>
            <input
              className="form-control form-control-lg"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              style={{ borderRadius: "14px" }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">ISBN</label>
            <input
              className="form-control form-control-lg"
              name="isbn"
              value={formData.isbn}
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
                name="availabilityStatus"
                checked={formData.availabilityStatus}
                onChange={handleChange}
              />
              <label className="form-check-label">Available</label>
            </div>
          </div>

          <div className="col-12 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-dark rounded-pill px-4 py-2"
            >
              {editBookId ? "Update Book" : "Add Book"}
            </button>

            {editBookId && (
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4 py-2"
                onClick={() => {
                  setEditBookId(null);
                  setFormData({
                    uniqueId: "",
                    title: "",
                    author: "",
                    publicationYear: "",
                    genre: "",
                    isbn: "",
                    availabilityStatus: true,
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div
        className="card border-0 shadow-lg p-4 mb-5"
        style={{ borderRadius: "24px" }}
      >
        <h4 className="mb-3" style={{ color: "#111827" }}>
          All Books
        </h4>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.genre}</td>
                  <td>
                    <span
                      className={`badge ${
                        book.availabilityStatus ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {book.availabilityStatus ? "Available" : "Rented"}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm rounded-pill"
                      onClick={() => handleEditClick(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill"
                      onClick={() => handleDeleteBook(book._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="card border-0 shadow-lg p-4 mb-5"
        style={{ borderRadius: "24px" }}
      >
        <h4 className="mb-3" style={{ color: "#111827" }}>
          Users
        </h4>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Blocked</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isBlocked ? "Yes" : "No"}</td>
                  <td>
                    {user.isBlocked ? (
                      <button
                        className="btn btn-success btn-sm rounded-pill"
                        onClick={() => handleUnblock(user._id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm rounded-pill"
                        onClick={() => handleBlock(user._id)}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="card border-0 shadow-lg p-4"
        style={{ borderRadius: "24px" }}
      >
        <h4 className="mb-3" style={{ color: "#111827" }}>
          Rental Requests
        </h4>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental._id}>
                  <td>{rental.user?.name}</td>
                  <td>{rental.book?.title}</td>
                  <td>{rental.status}</td>
                  <td>
                    {rental.dueDate
                      ? new Date(rental.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-success btn-sm rounded-pill"
                      onClick={() => handleRentalStatus(rental._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-warning btn-sm rounded-pill"
                      onClick={() => handleRentalStatus(rental._id, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-secondary btn-sm rounded-pill"
                      onClick={() => handleRentalStatus(rental._id, "returned")}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;