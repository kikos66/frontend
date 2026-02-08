import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserAPI from '../api/user_api';
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import AxiosHelper from '../api/axios_helper';
import ReviewAPI from '../api/review_api';
import ReviewList from '../Components/ReviewList';
import ReviewForm from '../Components/ReviewForm';

function Profile() {
    const {isAuthenticated, updateUser, fetchCurrentUser, logout, currentUser} = useAuth(); 
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const { id } = useParams(); 
    const userIdToFetch = id || null;
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [myListings, setMyListings] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 });
    const isOwnProfile = !userIdToFetch || Number(userIdToFetch) === currentUser?.id;
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    }
    
    const uploadAvatar = async () => {

        if (!avatarFile) {
            console.warn("No avatar selected");
            return;
        }

        const fd = new FormData();
        fd.append('avatar', avatarFile);

        try {
            const res = await AxiosHelper.post('/users/me/avatar', fd);
            const newFilename = res.data?.filename;
            if (newFilename) {
                setUser(prev => ({
                    ...prev,
                    profilePicture: newFilename
                }));
            }

            setAvatarFile(null);
            await fetchCurrentUser();
        } catch (e) {
            console.error("Upload failed:", e);
        }
    };

    

    useEffect(() => {
        const fetchListings = async () => {
            const url = isOwnProfile
            ? "/products/mine"
            : `/products/user/${userIdToFetch}`;

            const res = await AxiosHelper.get(url);
            setMyListings(res.data);
        };

        fetchListings();
    }, [isOwnProfile, userIdToFetch]);
    
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await UserAPI.getUserData(userIdToFetch); 
                setUser(data);

                const [r, s] = await Promise.allSettled([
                ReviewAPI.fetchReviews(data.id),
                ReviewAPI.fetchRating(data.id)
                ]);

                if (r.status === 'fulfilled') setReviews(r.value);
                if (s.status === 'fulfilled') setRatingSummary(s.value || { average: 0, count: 0 });
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
        email: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onReviewPosted = async (savedReview) => {
        try {
        const [r, s] = await Promise.all([
            ReviewAPI.fetchReviews(user.id),
            ReviewAPI.fetchRating(user.id)
        ]);
        setReviews(r);
        setRatingSummary(s);
        } catch (e) {
        console.error("Failed to refresh reviews", e);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setError("");

        if (!user) {
            setError("User not loaded yet.");
            return;
        }

        try {
            const res = await UserAPI.editUserData(formData);
            if(res.status === 201 || res.status === 200) {
                localStorage.setItem("accessToken", res.data.accessToken);
                updateUser(res.data.user); 
                await fetchCurrentUser();
                setUser(res.data.user); 
                setFormData({ email: '', username: '', password: '' });
            }
        } catch (e) {
            console.error("Profile edit failed:", e);
            setError(e.response?.data?.message || "Invalid form data or failed to update profile.");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await UserAPI.deleteUser();
            if(res.status == "201") {
                logout();
            }
        } catch (e) {
            console.error("Profile delete failed:", e);
            setError("Invalid form data or failed to delete profile.");
        }
    }

    const hasChanges = Boolean(
        (formData.email && formData.email !== user?.email) ||
        (formData.username && formData.username !== user?.username) ||
        (formData.password && formData.password.length > 0)
    );


    if (loading) return <div className="text-center mt-8">Loading profile...</div>;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <div className="card rounded-lg p-6 max-w-3xl mx-auto">
            <div className="mt-4">
                <label className="label">Profile picture</label>
                <div className="flex items-center gap-3">
                    <img
                    src={user?.profilePicture
                        ? `/images/profiles/${user.profilePicture}?t=${Date.now()}`
                        : '/placeholder.png'}
                    alt="avatar"
                    className="w-16 h-16 object-cover rounded-full"
                    />

                    {isOwnProfile && (
                    <div>
                        <input className="link-muted" type="file" accept="image/*" onChange={handleAvatarChange} />
                        <button
                        type="button"
                        onClick={uploadAvatar}
                        className="my-button mt-2"
                        >
                        Upload avatar
                        </button>
                    </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <h1 className="text-3xl font-bold mb-6 text-green-600">
                    {userIdToFetch ? `Profile for ${user.username}` : 'Your Profile'}
                </h1>
                <div className="text-right">
                    <div className="muted-text">Rating</div>
                    <div className="font-bold">{ratingSummary.average.toFixed(2)} ★
                        <span className="muted-text">({ratingSummary.count})</span>
                    </div>
                </div>
            </div>
            <div className="text-lg space-y-1">
                <div>
                    <strong>Email:</strong> {user?.email}
                </div>
                <div>
                    <strong>Username:</strong> {user?.username}
                </div>
            </div>
            {isOwnProfile && (
                <form onSubmit={handleEdit} className="mt-4">
                    <label className="label">Change email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="New email"
                        className="input w-full"
                    />

                    <label className="label mt-2">Change username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="New username"
                        className="input w-full"
                    />

                    <label className="label mt-2">Change password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="New password"
                        className="input w-full"
                    />

                    <button type="submit" className="my-button mt-2" disabled={!hasChanges}>
                        Save changes
                    </button>
                </form>
            )}

            {!isOwnProfile && (
                <div className="mt-4">
                <h3 className="font-semibold mb-2">Leave a review</h3>
                <ReviewForm targetUserId={user.id} onPosted={onReviewPosted}
                    initial={reviews.find(r => r.author?.id === currentUser?.id)} />
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <div className="mt-3">
                <ReviewList reviews={reviews} />
                </div>
            </div>

            <h2 className="text-xl font-semibold mt-6">
                {isOwnProfile ? 'My Listings' : `${user.username}'s Listings`}
            </h2>

            <div className="grid-3 mt-3">
                {myListings.map(p => (
                    <div
                        key={p.id}
                        className="card-compact cursor-pointer hover:shadow"
                        onClick={() => navigate(`/products/${p.id}`)}
                    >
                    <img
                        src={
                            p.images?.length
                            ? `/images/products/${p.images[0].filename}`
                            : "/placeholder_image.png"
                        }
                        className="h-32 w-full object-cover rounded"
                    />
                    <div className="font-medium mt-1">{p.name}</div>
                    </div>
                ))}
            </div>

            {isOwnProfile && (
                <div className="mt-6 border-t pt-4">
                    <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                    Delete Profile
                    </button>
                </div>
            )}
        </div>
    );
    
}

export default Profile;