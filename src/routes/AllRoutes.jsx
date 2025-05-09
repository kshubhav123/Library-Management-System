import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import AddBook from "../pages/addBook/AddBook";
import BookDetails from "../pages/bookDetails/BookDetails";
import { AuthContext } from "../context/AuthContext";
import Signup from "../pages/signup/Signup";
import UpdateBook from "../pages/updateBook/UpdateBook";

const ProtectedRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  console.log(user, "protected");

  return user && user.role === "admin" ? element : <Navigate to="/login" />;
};

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/update-book/:id" element={<UpdateBook />} />

      <Route
        path="/add-book"
        element={<ProtectedRoute element={<AddBook />} />}
      />
    </Routes>
  );
};

export default AllRoutes;
