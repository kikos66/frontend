import React, { useEffect, useState } from "react";
import AxiosHelper from "../../api/axios_helper";
import useAuth from "../../hooks/useAuth";

export default function ManageUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      const res = await AxiosHelper.get("/admin/users");
      setUsers(res.data);
    })();
  }, []);

  const changeRole = async (userId, role) => {
    await AxiosHelper.post(`/admin/users/${userId}/role?role=${role}`);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };
  
  const deleteUser = async (userId) => {
    if (!confirm("Delete user?")) return;
    await AxiosHelper.delete(`/admin/users/${userId}`);
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const filteredUsers = users
  .filter(u => u.id !== currentUser.id)
  .filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-3">Manage Users</h1>
        <div className="mb-3">
            <input
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field w-full border p-2 rounded"
            />
        </div>
      <div className="space-y-3">
        {filteredUsers.map(u => (
          <div key={u.id} className="flex items-center justify-between p-2 border rounded">
            <div>
                <div className="font-medium">{u.username} ({u.email})</div>
                <div className="muted-text">Role: {u.role}</div>
            </div>
            <div className="flex items-center gap-2">
              <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}>
                <option value="ROLE_USER">USER</option>
                <option value="ROLE_MODERATOR">MODERATOR</option>
                <option value="ROLE_ADMIN">ADMIN</option>
            </select>
              <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}