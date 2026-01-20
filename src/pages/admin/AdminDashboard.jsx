import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="card max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/users" className="p-4 border rounded hover:shadow">Manage Users</Link>
        <Link to="/admin/listings" className="p-4 border rounded hover:shadow">Manage Listings</Link>
      </div>
    </div>
  );
}