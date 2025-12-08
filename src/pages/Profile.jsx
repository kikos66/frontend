import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserAPI from '../api/user_api';
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

function Profile() {
  const { isAuthenticated } = useAuth(); 
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
        await UserAPI.editUserData(formData);
        navigate("/user");
        } catch (e) {
        setError("Invalid form data.");
        }
    };

    if (loading) return <div className="text-center mt-8">Loading profile...</div>;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <form>
                <h1 className="text-3xl font-bold mb-6 text-green-600">
                    {userIdToFetch ? `Profile for User ID: ${userIdToFetch}` : 'Your Profile'}
                </h1>
                <p className="text-lg">
                    <strong>Email:</strong> {user.email}
                </p>
                {!userIdToFetch && (
                <>
                    {/*Input field*/}
                    <input onChange={handleChange} value={formData.email}
                        id="email" type="email" name="email" placeholder="Update email" required
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />

                    {/*Button*/}
                    <button type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition">
                        Edit Profile
                    </button>
                </>
                )}
            </form>
        </div>
    );
    
}

export default Profile;