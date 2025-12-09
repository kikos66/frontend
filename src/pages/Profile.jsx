import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserAPI from '../api/user_api';
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

function Profile() {
  const {isAuthenticated, updateUser, fetchCurrentUser, logout} = useAuth(); 
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const { id } = useParams(); 
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userIdToFetch = id || null;

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await UserAPI.getUserData(userIdToFetch); 
                setUser(data);
            } catch (err) {
                setError(`Failed to load profile for ${userIdToFetch || 'current user'}.`);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        
    }, [userIdToFetch]); 

    const [formData, setFormData] = useState({
            email: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await UserAPI.editUserData(formData);
            if(res.status == "201")
            {
                if (res && res.accessToken) {
                    localStorage.setItem("accessToken", res.accessToken);
                }

                updateUser(res.user);
                await fetchCurrentUser();
                setUser(res.user); 
                setFormData({ email: '' });
            }
            
        } catch (e) {
            console.error("Profile edit failed:", e);
            setError("Invalid form data or failed to update profile.");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await UserAPI.deleteUser();
            if(res.status == "201")
                logout();
            
        } catch (e) {
            console.error("Profile delete failed:", e);
            setError("Invalid form data or failed to delete profile.");
        }
    }

    if (loading) return <div className="text-center mt-8">Loading profile...</div>;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-green-600">
                    {userIdToFetch ? `Profile for User ID: ${userIdToFetch}` : 'Your Profile'}
                </h1>
                <p className="text-lg">
                    <strong>Email:</strong> {user.email}
                </p>
                {!userIdToFetch && (
                <div>
                    <form onSubmit={handleEdit}>
                        <input  value={formData.email} onChange={handleChange}
                            id="email" type="email" name="email" placeholder="Update email" required
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        />
                        <button type="submit" 
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition">
                            Edit Profile
                        </button>
                    </form>
                    <form onSubmit={handleDelete}>
                        <button type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition margin-top">
                            Delete
                        </button>
                    </form>
                </div>
                )}
        </div>
    );
    
}

export default Profile;