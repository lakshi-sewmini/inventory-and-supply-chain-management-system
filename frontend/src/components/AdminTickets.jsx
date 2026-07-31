import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tempPassword, setTempPassword] = useState(''); // අලුතින් හැදුණු password එක පෙන්වන්න

    // Data ටික fetch කරගන්නා function එක
    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token'); // JWT token එකක් පාවිච්චි කරනවා නම්
            const response = await axios.get('http://127.0.0.1:8000/api/support-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Request එක Approve කිරීමේ Logic එක
    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to APPROVE this request?")) return;
        
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/support-tickets/${id}/approve`);
            if (response.data.success) {
                alert(response.data.message);
                if (response.data.temporary_password) {
                    setTempPassword(response.data.temporary_password); // Password එක screen එකේ පෙන්වීමට
                }
                fetchTickets(); // Table එක refresh කිරීම
            }
        } catch (error) {
            alert("Error approving request.");
        }
    };

    // Request එක Reject කිරීමේ Logic එක
    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to REJECT this request?")) return;

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/support-tickets/${id}/reject`);
            if (response.data.success) {
                alert("Request rejected successfully.");
                fetchTickets(); // Table එක refresh කිරීම
            }
        } catch (error) {
            alert("Error rejecting request.");
        }
    };

    if (loading) return <div className="p-6 text-center text-slate-600">Loading requests...</div>;

    return (
        <div className="p-6 bg-[#f8fafc] min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Support & Account Provisioning</h2>
                        <p className="text-xs text-slate-500">Review and manage user password resets and new account requests</p>
                    </div>
                </div>

                {/* 🔑 අලුතින් හැදුණු password එක පෙන්වන Alert එක */}
                {tempPassword && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-semibold">
                        🎉 Account Approved! Temporary Password: <span className="bg-white px-2 py-1 rounded border font-mono text-rose-600 select-all">{tempPassword}</span>
                        <p className="text-xs text-emerald-600 font-normal mt-1">Please copy and share this password safely with the user.</p>
                        <button onClick={() => setTempPassword('')} className="text-xs text-slate-400 underline mt-2 block">Dismiss</button>
                    </div>
                )}

                {/* Requests Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                <th className="p-4">Type</th>
                                <th className="p-4">User Email</th>
                                <th className="p-4">Message / Reason</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-800">
                                            {ticket.request_type === 'Password Reset' ? '🔑 Password Reset' : '👤 New Account'}
                                        </td>
                                        <td className="p-4 font-medium">{ticket.user_email}</td>
                                        <td className="p-4 max-w-xs truncate" title={ticket.message}>{ticket.message}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                ticket.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                ticket.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {ticket.status === 'Pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleApprove(ticket.id)}
                                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(ticket.id)}
                                                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">No requests found at the moment.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}