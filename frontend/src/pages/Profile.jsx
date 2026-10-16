import { useEffect, useState } from "react";
import {
    getProfile,
    updateProfile,
} from "../services/profileService";
import "./Profile.css";

function Profile() {

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const data = await getProfile();

            setProfile(data.data || data);
        } catch (err) {
            setError("Unable to load profile.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            await updateProfile({
                phone: profile.phone,
                location: profile.location,
                bio: profile.bio,
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            setError("Unable to update profile.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="page profile-page">

            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>
                        Manage your CareerAI profile information.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            <div className="profile-card">

                <form onSubmit={handleSubmit}>

                    <label>Username</label>

                    <input
                        type="text"
                        value={profile.username}
                        disabled
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        value={profile.email}
                        disabled
                    />

                    <label>Phone</label>

                    <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                    />

                    <label>Location</label>

                    <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                    />

                    <label>Bio</label>

                    <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows="5"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Profile;