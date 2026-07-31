import React, { useState } from 'react';
import axios from 'axios';

export default function SupportForm({ requestType, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Laravel API Endpoint එක (ඔයාගේ localhost port එකට අනුව වෙනස් කරන්න)
            const response = await axios.post('http://127.0.0.1:8000/api/support-tickets', {
                user_email: email,
                request_type: requestType,
                message: message
            });

            if (response.data.success) {
                alert(`Success! Your request for ${requestType} has been sent.`);
                setEmail('');
                setMessage('');
                if (onClose) onClose(); // Form එක close කරන්න
            }
        } catch (error) {
            console.error("Error submitting form", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3">
            <div className="mb-3">
                <label className="form-label">
                    {requestType === 'Password Reset' ? 'Registered Email' : 'Official/Personal Email'}
                </label>
                <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="name@example.com"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">
                    {requestType === 'Password Reset' ? 'Reason for Reset' : 'Job Role & Details'}
                </label>
                <textarea 
                    className="form-control" 
                    rows="3" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                    placeholder={requestType === 'Password Reset' ? "Why do you need an override?" : "Your Name & Role..."}
                ></textarea>
            </div>
            <button 
                type="submit" 
                className={`btn w-100 ${requestType === 'Password Reset' ? 'btn-primary' : 'btn-success'}`}
                disabled={loading}
            >
                {loading ? 'Submitting...' : `Submit ${requestType} Request`}
            </button>
        </form>
    );
}