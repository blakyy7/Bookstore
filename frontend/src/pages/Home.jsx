import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Home() {
  const [books, setBooks] = useState([]);
  const [covers, setCovers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await API.get("/books");
        setBooks(data);
      } catch (err) {
        setError("Failed to load books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const placeholder = "https://placehold.co/300x420?text=No+Cover";

    const imageExists = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });

    const fetchCoverForBook = async (book) => {
      if (book.title.toLowerCase() === "white nights") {
        return "https://cdn.penguin.co.in/wp-content/uploads/2025/03/9780143474968.jpg";
      }

      const isbnUrl = book.isbn
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
        : null;

      if (isbnUrl && (await imageExists(isbnUrl))) {
        return isbnUrl;
      }

      try {
        const searchRes = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(
            book.title
          )}`
        );
        const searchData = await searchRes.json();

        if (searchData?.docs?.length > 0 && searchData.docs[0].cover_i) {
          return `https://covers.openlibrary.org/b/id/${searchData.docs[0].cover_i}-L.jpg`;
        }
      } catch (err) {
        console.error("Cover lookup failed:", err);
      }

      return placeholder;
    };

    const loadCovers = async () => {
      const entries = await Promise.all(
        books.map(async (book) => {
          const coverUrl = await fetchCoverForBook(book);
          return [book._id, coverUrl];
        })
      );

      setCovers(Object.fromEntries(entries));
    };

    if (books.length > 0) {
      loadCovers();
    }
  }, [books]);

  const filteredBooks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return books;

    return books.filter((book) => {
      return (
        book.title?.toLowerCase().includes(q) ||
        book.author?.toLowerCase().includes(q) ||
        book.genre?.toLowerCase().includes(q) ||
        String(book.publicationYear).includes(q) ||
        book.isbn?.toLowerCase().includes(q) ||
        book.uniqueId?.toLowerCase().includes(q)
      );
    });
  }, [books, searchTerm]);
  if (loading) return <h4>Loading books...</h4>;

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div
  className="rounded-4 p-4 p-md-5 mb-4"
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/writers-banner.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: "1px solid #eee",
  }}
>
        <div className="row align-items-center g-4">
          <div className="col-md-7">
            <span
  className="badge rounded-pill mb-3 px-3 py-2"
  style={{
    backgroundColor: "rgba(124,58,237,0.9)",
    color: "white",
  }}
>
              Book Rental Library
            </span>

            <h1
  className="fw-bold mb-3"
  style={{
    color: "white",
    fontSize: "4rem",
  }}
>
              Discover, Rent, and Read Your Next Favorite Book
            </h1>
          </div>

          <div className="col-md-5">
            <div
              className="p-4 rounded-4 shadow-sm bg-white"
              style={{ border: "1px solid #ffffff" }}
            >
              <h5 className="mb-3" style={{ color: "#111827" }}>
                Search Books
              </h5>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by title, author, genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <p className="mt-3 mb-0 text-muted small">
                Try searching for 1984, White Nights, Finance, or Thriller.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0" style={{ color: "#111827" }}>
          Newest Books
        </h2>
        <span className="text-muted">{filteredBooks.length} books found</span>
      </div>

      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="row g-4">
          {filteredBooks.slice(0, 20).map((book) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={book._id}>
              <div
                className="card h-100 border-0 shadow-sm overflow-hidden"
                style={{
                  borderRadius: "20px",
                  background: "#fff",
                }}
              >
                <img
                  src={
                    covers[book._id] ||
                    "https://placehold.co/300x420?text=Loading..."
                  }
                  alt={book.title}
                  className="card-img-top"
                  style={{
                    height: "280px",
                    objectFit: "cover",
                    objectPosition:
                      book.title.toLowerCase() === "white nights"
                        ? "center 35px"
                        : "center center",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/300x420?text=No+Cover";
                  }}
                />

                <div className="card-body d-flex flex-column p-3">
                  <div className="mb-2">
                    <span className="badge rounded-pill bg-light text-dark border">
                      {book.genre}
                    </span>
                  </div>

                  <h5 className="card-title mb-2" style={{ color: "#111827" }}>
                    {book.title}
                  </h5>

                  <p className="card-text text-muted mb-2">
                    {book.author}
                    <br />
                    {book.publicationYear}
                  </p>

                  <p className="mb-3">
                    {book.availabilityStatus ? (
                      <span className="badge bg-success">Available</span>
                    ) : (
                      <span className="badge bg-danger">Rented</span>
                    )}
                  </p>

                  <div className="mt-auto">
                    <button
  className="btn btn-dark btn-sm w-100"
  style={{ borderRadius: "12px" }}
  onClick={() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    window.location.href = `/books/${book._id}`;
  }}
>
  View Details
</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
            )}

      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white shadow p-4"
            style={{
              width: "420px",
              maxWidth: "90%",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <h3 className="mb-3">🔒 Login Required</h3>

            <p className="text-muted">
              Please login or create an account to view book details.
            </p>

            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowLoginModal(false)}
              >
                Close
              </button>

              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </button>

              <button
                className="btn btn-success"
                onClick={() => (window.location.href = "/signup")}
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;