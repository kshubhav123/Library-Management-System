import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./AddBook.css";
import { api } from "../../constants";

const AddBook = () => {
  const { user } = useContext(AuthContext);
  console.log(user, "user");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    publicationYear: "",
    coverImage: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

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
    if (!book.coverImage.trim()) return "Cover Image is required.";
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

    console.log(book, "book");
    console.log(user, "book");


    try {
      const response = await fetch(`${api}books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(book),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add book");

      showToast("Book added successfully!", "success");

      setBook({
        title: "",
        author: "",
        genre: "",
        publicationYear: "",
        coverImage: "",
        description: "",
      });

      navigate("/dashboard");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add New Book</h2>

      {error && <p className="error-message">{error}</p>}

      <form className="add-book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter book title"
          value={book.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Enter author name"
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
          <option value="Personal-Development">Personal Development</option>
          <option value="Self-Help">Self-Help</option>
          <option value="Productivity">Productivity</option>
          <option value="Spirituality">Spirituality</option>
          <option value="Biography">Biography</option>
          <option value="Chess">Chess</option>
        </select>

        <input
          type="number"
          name="publicationYear"
          placeholder="Enter year"
          value={book.publicationYear}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="coverImage"
          placeholder="Enter cover image URL"
          value={book.coverImage}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Enter book description"
          value={book.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
