"use client";

import { useState, useEffect } from "react";

export default function SlotCard({ slot, updateSlot }) {
    const [name, setName] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reservation, setReservation] = useState("");
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [editEndTime, setEditEndTime] = useState("");

    useEffect(() => {
        try {
            const u = localStorage.getItem("evUser");
            if (u) setCurrentUser(u);
        } catch (e) {
            // ignore
        }
    }, []);

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

        try {
            localStorage.setItem("evUser", name);
            setCurrentUser(name);
        } catch (e) {
            // ignore
        }

        setName("");
        setEndTime("");
    };

    return (
        <div className="card">
            <div className="card-header">
                <strong>Slot {slot.id} {slot.id == 2 ? "EU" : slot.id == 4 ? "US" : "CN"}</strong>
                <span className={`badge ${slot.occupied ? "red" : "green"}`}>
                    {slot.occupied ? "Busy" : "Free"}
                </span>
            </div>

            <div className="details">
                {slot.occupied && (
                    <>
                        <div className="flex gap-1 items-center">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.51555 7C3.55827 8.4301 3 10.1499 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3V6M12 12L8 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <p>Until: {slot.endTime}</p>

                            {slot.user && currentUser && slot.user.trim() === currentUser.trim() && (
                                <p
                                    className="!ml-2"
                                    onClick={() => {
                                        setEditEndTime(slot.endTime || "");
                                        setIsEditingTime(true);
                                    }}
                                >
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </p>
                            )}

                            {isEditingTime && (
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                        type="time"
                                        value={editEndTime}
                                        onChange={e => setEditEndTime(e.target.value)}
                                    />
                                    <button
                                        className="primary px-3"
                                        onClick={() => {
                                            const t = editEndTime && editEndTime.trim();
                                            if (!t) return;
                                            updateSlot(slot.id, { endTime: t });
                                            setIsEditingTime(false);
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="secondary px-3"
                                        onClick={() => setIsEditingTime(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
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
                            Start Charging
                        </button>
                    </>
                )}

                {slot.occupied && (
                    <>
                        {!slot.reservation && (
                            <>
                                <input
                                    placeholder="Reserve name"
                                    value={reservation}
                                    onChange={e => setReservation(e.target.value)}
                                />
                                <button
                                    className="secondary"
                                    onClick={() => {
                                        const r = reservation && reservation.trim();
                                        if (!r) return;
                                        try {
                                            localStorage.setItem("evUser", r);
                                            setCurrentUser(r);
                                        } catch (e) {
                                            // ignore
                                        }
                                        updateSlot(slot.id, { reservation: r });
                                        setReservation("");
                                    }}
                                >
                                    Reserve Slot
                                </button>
                            </>
                        )}

                        {slot.reservation && currentUser && slot.reservation.trim() === currentUser.trim() && (
                            <button
                                className="secondary"
                                onClick={() =>
                                    updateSlot(slot.id, { reservation: "" })
                                }
                            >
                                Unreserve
                            </button>
                        )}

                        {slot.user && currentUser && slot.user.trim() === currentUser.trim() && (
                            <>
                                <button
                                    className="danger"
                                    onClick={() => {
                                        if (slot.reservation && slot.reservation.trim()) {
                                            updateSlot(slot.id, {
                                                occupied: true,
                                                user: slot.reservation,
                                                endTime: "",
                                                reservation: ""
                                            })
                                        } else {
                                            updateSlot(slot.id, {
                                                occupied: false,
                                                user: "",
                                                endTime: "",
                                                reservation: ""
                                            })
                                        }
                                    }}
                                >
                                    Mark as Free
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
