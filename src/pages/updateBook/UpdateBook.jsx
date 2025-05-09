import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./UpdateBook.css";
import { api } from "../../constants";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: [],
    publicationYear: "",
    coverImage: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }

    const fetchBook = async () => {
      try {
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
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!book.title.trim()) return "Title is required.";
    if (!book.author.trim()) return "Author name is required.";
    if (!book.genre) return "Please select a genre.";
    if (
      !book.publicationYear ||
      book.publicationYear < 1000 ||
      book.publicationYear > new Date().getFullYear()
    )
      return "Enter a valid publication year.";
    if (!book.description.trim()) return "Description is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    if (!user || !user.token) {
      showToast("Unauthorized: No token found", "error");
      return;
    }

    try {
      const response = await fetch(`${api}books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(book),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update book");

      showToast("Book updated successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="update-book-container">
      <h2>Update Book</h2>

      <form className="update-book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          value={book.author}
          onChange={handleChange}
          required
        />

        <select
          name="genre"
          value={book.genre}
          onChange={handleChange}
          required
        >
          <option value="">Select Genre</option>
          <option value="Motivation">Motivation</option>
          <option value="Finance">Finance</option>
          <option value="Motivation">Personal Development</option>
          <option value="Self-Help">Self-Help</option>
          <option value="Productivity">Productivity</option>
          <option value="Spirituality">Spirituality</option>
          <option value="Biography">Biography</option>
          <option value="Chess">Chess</option>
        </select>

        <input
          type="number"
          name="publicationYear"
          value={book.publicationYear}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="coverImage"
          value={book.coverImage}
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateBook;
