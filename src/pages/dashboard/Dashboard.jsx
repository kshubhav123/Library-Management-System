import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";
import { api } from "../../constants";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    year: "",
    search: "",
  });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let query = new URLSearchParams();
      if (filters.genre) query.append("genre", filters.genre);
      if (filters.author) query.append("author", filters.author);
      if (filters.year) query.append("publicationYear", filters.year);
      if (filters.search) query.append("search", filters.search);

      const response = await fetch(`${api}book?${query.toString()}`);
      const data = await response.json();
      console.log(data.data,"book");
      
      if (data.status === "success") setBooks(data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  return (
    <div className="dashboard-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Title"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Genre"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Author"
          value={filters.author}
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Filter by Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
      </div>
      {loading && (
        <div className="loadingBox">
          <div className="loader"></div>
        </div>
      )}
      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="book-card"
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="book-image"
              />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Genre:</strong> {book.genre.join(", ")}
                </p>
                <p>
                  <strong>Year:</strong> {book.publicationYear}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-books">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
