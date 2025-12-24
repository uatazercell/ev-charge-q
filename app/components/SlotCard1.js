"use client";

import { useState } from "react";

export default function SlotCard({ slot, updateSlot }) {
    const [name, setName] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reservation, setReservation] = useState("");
    const [error, setError] = useState("");

    const handleOccupy = () => {
        if (!name.trim() || !endTime) {
            setError("Name and end time are required");
            return;
        }

        setError("");
        updateSlot(slot.id, {
            occupied: true,
            user: name,
            endTime
        });

        setName("");
        setEndTime("");
    };

    return (
        <div className="card">
            <div className="card-header">
                <strong>Slot {slot.id}</strong>
                <span className={`badge ${slot.occupied ? "red" : "green"}`}>
                    {slot.occupied ? "Occupied" : "Free"}
                </span>
            </div>

            <div className="details">
                {slot.occupied && (
                    <>
                        <p className="flex gap-1">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.51555 7C3.55827 8.4301 3 10.1499 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3V6M12 12L8 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Until: {slot.endTime}
                        </p>
                        {slot.user &&
                            <p className="flex gap-1">
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="6" r="4" stroke="#1C274C" strokeWidth="1.5" />
                                    <path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                {slot.user}
                            </p>}
                    </>
                )}

                {slot.reservation && (
                    <p className="reservation flex gap-1">
                        <svg fill="#000000" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001">
                            <g>
                                <g>
                                    <path d="M511.747,374.302l-39.385-242.905c-1.547-9.535-9.779-16.542-19.439-16.542H59.078c-9.658,0-17.892,7.007-19.439,16.542
			L0.254,374.302c-0.924,5.699,0.7,11.515,4.441,15.913c3.742,4.398,9.224,6.93,14.998,6.93h472.615
			c5.773,0,11.256-2.534,14.998-6.93C511.048,385.818,512.672,380.001,511.747,374.302z M42.835,357.762l16.341-100.784
			l16.341,100.784H42.835z M115.416,357.761v0.001L82.417,154.241h353.75l32.999,203.52H115.416z"/>
                                </g>
                            </g>
                            <g>
                                <g>
                                    <path d="M393.847,236.309H157.539c-10.875,0-19.692,8.817-19.692,19.692c0,10.875,8.817,19.692,19.692,19.692h236.308
			c10.875,0,19.692-8.817,19.692-19.692C413.539,245.126,404.722,236.309,393.847,236.309z"/>
                                </g>
                            </g>
                        </svg>
                        Reserved by {slot.reservation}
                    </p>
                )}
            </div>

            <div className="actions">
                {!slot.occupied && (
                    <>
                        <input
                            placeholder="Name *"
                            value={name}
                            required
                            onChange={e => setName(e.target.value)}
                        />

                        <input
                            type="time"
                            placeholder="choose time"
                            value={endTime}
                            required
                            onChange={e => setEndTime(e.target.value)}
                        />

                        {error && (
                            <span style={{ color: "#dc2626", fontSize: "12px" }}>
                                {error}
                            </span>
                        )}

                        <button
                            disabled={!name.trim() || !endTime}
                            onClick={handleOccupy}
                        >
                            Occupy Slot
                        </button>
                    </>
                )}

                {slot.occupied && (
                    <>
                        {!slot.reservation && (
                            <>
                                <input
                                    placeholder="Reserve name"
                                    onChange={e => setReservation(e.target.value)}
                                />
                                <button
                                    className="secondary"
                                    onClick={() =>
                                        updateSlot(slot.id, { reservation })
                                    }
                                >
                                    Reserve Slot
                                </button>
                            </>
                        )}

                        <button
                            className="danger"
                            onClick={() =>
                                updateSlot(slot.id, {
                                    occupied: false,
                                    user: "",
                                    endTime: "",
                                    reservation: ""
                                })
                            }
                        >
                            Mark as Free
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
