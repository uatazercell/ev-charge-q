'use client';
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../lib/firebase";

const emptySlotUpdate = { user: "", occupied: false, endTime: "", reservation: "" };

export default function Admin() {
    const [showUI, setShowUI] = useState(false);

    const handleRemoveOccupant = async (id: number) => {
        await updateDoc(doc(db, "slots", String(id)), emptySlotUpdate);
    };
    const handleRemoveReservator = async (id: number) => {
        await updateDoc(doc(db, "slots", String(id)), { reservation: "" });
    };
    const handleClearSlots = async () => {
        for (let i = 1; i <= 6; i++) {
            await updateDoc(doc(db, "slots", String(i)), emptySlotUpdate);
        }
    };

    return (
        <div className="container mx-auto">
            <h1>Admin Page</h1>
            {!showUI ? (
                <AuthForm onSuccess={() => setShowUI(true)} />
            ) : (
                <div className="flex flex-col gap-4 mt-8">
                    <button
                        onClick={handleClearSlots}
                        className="px-4 py-2 my-4 !bg-red-600 !text-white rounded w-full"
                    >
                        Clear all slots
                    </button>

                    {[1, 2, 3, 4, 5, 6].map((card) => (
                        <div key={card} className="card p-4 shadow">
                            <h2 className="card-header">Slot {card}</h2>
                            <div className="flex justify-center gap-2 mt-4">
                                <button
                                    onClick={() => handleRemoveOccupant(card)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded w-full"
                                >
                                    Remove Occupant
                                </button>
                                <button
                                    onClick={() => handleRemoveReservator(card)}
                                    className="px-4 py-2 bg-green-500 text-white rounded w-full"
                                >
                                    Remove Reservator
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const AuthForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin" && password === "DeleteAll") {
            onSuccess();
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mt-8">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="px-4 py-2 w-full rounded">
                Login
            </button>
        </form>
    );
};