import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchBook = async () => {
    try {
      const { data } = await API.get(`/books/${id}`);
      setBook(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const { data } = await API.get(`/social/like/${id}`);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/social/comment/${id}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchLikeCount();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    try {
      await API.post(`/social/like/${id}`);
      fetchLikeCount();
      setMessage("Updated like");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to like");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setMessage("Comment cannot be empty");
      return;
    }

    try {
      await API.post(`/social/comment/${id}`, {
        text: commentText,
      });

      setCommentText("");
      fetchComments();
      setMessage("Comment added successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to comment");
    }
  };

  const handleRentRequest = async () => {
    try {
      await API.post(`/rentals/request/${id}`);
      setMessage("Rental request sent successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send request");
    }
  };

  if (!book) return <h4>Loading...</h4>;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div
          className="card border-0 shadow-lg overflow-hidden"
          style={{ borderRadius: "24px" }}
        >
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={`https://placehold.co/600x900/111827/ffffff?text=${encodeURIComponent(
                  book.title
                )}`}
                alt={book.title}
                className="img-fluid h-100 w-100"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="col-md-8">
              <div className="card-body p-4 p-md-5">
                <span className="badge bg-light text-dark border mb-3">
                  {book.genre}
                </span>

                <h2 className="mb-3" style={{ color: "#111827" }}>
                  {book.title}
                </h2>

                <p className="text-muted mb-2">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="text-muted mb-2">
                  <strong>Publication Year:</strong> {book.publicationYear}
                </p>
                <p className="text-muted mb-2">
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p className="mb-3">
                  <strong>Status:</strong>{" "}
                  {book.availabilityStatus ? (
                    <span className="badge bg-success">Available</span>
                  ) : (
                    <span className="badge bg-danger">Rented</span>
                  )}
                </p>

                <p className="mb-4">
                  <strong>Likes:</strong> {likeCount}
                </p>

                {message && <div className="alert alert-info">{message}</div>}

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {token && (
                    <>
                      <button
                        className="btn btn-outline-danger rounded-pill px-4"
                        onClick={handleLike}
                      >
                        Like / Unlike
                      </button>

                      <button
                        className="btn btn-dark rounded-pill px-4"
                        onClick={handleRentRequest}
                      >
                        Request Rent
                      </button>
                    </>
                  )}
                </div>

                <hr className="my-4" />

                <h4 className="mb-3" style={{ color: "#111827" }}>
                  Comments
                </h4>

                {token ? (
                  <form onSubmit={handleComment} className="mb-4">
                    <textarea
                      className="form-control mb-3"
                      rows="3"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{ borderRadius: "14px" }}
                    />
                    <button type="submit" className="btn btn-dark rounded-pill px-4">
                      Add Comment
                    </button>
                  </form>
                ) : (
                  <p className="text-muted">Please login to comment.</p>
                )}

                <div>
                  {comments.length === 0 ? (
                    <p className="text-muted">No comments yet.</p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border rounded-4 p-3 mb-3"
                        style={{ background: "#fafafa" }}
                      >
                        <p className="mb-1">
                          <strong>{comment.user?.name}</strong>
                        </p>
                        <p className="mb-1">{comment.text}</p>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;