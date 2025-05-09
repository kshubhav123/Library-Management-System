import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./BookDetails.css";
import { api } from "../../constants";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log(`${api}books/${id}`, "url");
        const response = await fetch(`${api}books/${id}`);
        if (!response.ok) throw new Error("Failed to fetch book details");

        const data = await response.json();
        setBook(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleUpdate = () => navigate(`/update-book/${id}`);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="book-details-container">
      <h2 className="book-title">{book.title}</h2>
      <img className="book-cover" src={book.coverImage} alt={book.title} />

      <table className="book-details-table">
        <tbody>
          <tr>
            <th>Author</th>
            <td>{book.author}</td>
          </tr>
          <tr>
            <th>Genre</th>
            <td>{book.genre.join(", ")}</td>
          </tr>
          <tr>
            <th>Published</th>
            <td>{book.publicationYear}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{book.description}</td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default BookDetails;
