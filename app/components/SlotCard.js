"use client";

import { useState } from "react";
import { FaUser, FaUserFriends, FaEnvelope, FaCar, FaEdit, FaPhoneAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";


export default function SlotCard({ slot, updateSlot, currentUser, allSlots }) {
    const [error, setError] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [editEndTime, setEditEndTime] = useState("");

    const userId = currentUser?.uid;
    const userName = `${currentUser?.name} ${currentUser?.surname}` || "";
    const hasOtherSlot = allSlots.some((s) => s.id !== slot.id && (s.userId === userId || s.reservationId === userId));
    const isCurrentOccupant = slot.userId === userId;
    const isCurrentReserver = slot.reservationId === userId;
    const selectedEndTime = endTime.trim() || slot.endTime || "";

    const handleReserve = () => {
        setError("");
        if (!userId) {
            setError("You must be logged in to reserve a slot.");
            return;
        }

        if (slot.reservationId) {
            setError("This slot is already reserved.");
            return;
        }

        if (hasOtherSlot && !isCurrentReserver) {
            setError("You already have another occupied or reserved slot.");
            return;
        }

        updateSlot(slot.id, {
            reservation: userName,
            reservationId: userId,
            reservationEmail: currentUser?.email || "",
            reservationPlate: currentUser?.vehiclePlateNumber || "",
        });
        setEndTime("");
    };

    const handleOccupy = () => {
        setError("");
        if (!userId) {
            setError("You must be logged in to occupy a slot.");
            return;
        }

        if (hasOtherSlot && !isCurrentOccupant) {
            setError("You already have another occupied or reserved slot.");
            return;
        }

        if (!selectedEndTime) {
            setError("Please enter the end time before starting charging.");
            return;
        }

        updateSlot(slot.id, {
            occupied: true,
            endTime: selectedEndTime,
            user: userName,
            email: currentUser?.email || "",
            userId,
            vehiclePlate: currentUser?.vehiclePlateNumber || "",
            mobileNumber: currentUser?.mobileNumber || "",
            reservation: "",
            reservationId: "",
            reservationEmail: "",
            reservationPlate: "",
            reservationMobileNumber: "",
        });
        setEndTime("");
    };

    const handleCancelReservation = () => {
        setError("");
        updateSlot(slot.id, {
            reservation: "",
            reservationId: "",
            reservationEmail: "",
            reservationPlate: "",
            reservationMobileNumber: "",
        });
    };

    const handleStopCharging = () => {
        setError("");
        if (slot.reservationId) {
            // Transfer reservation to occupation
            updateSlot(slot.id, {
                occupied: true,
                endTime: "",
                user: slot.reservation,
                email: slot.reservationEmail,
                userId: slot.reservationId,
                vehiclePlate: slot.reservationPlate,
                mobileNumber: slot.reservationMobileNumber,
                reservation: "",
                reservationId: "",
                reservationEmail: "",
                reservationPlate: "",
                reservationMobileNumber: "",
            });
        } else {
            updateSlot(slot.id, {
                occupied: false,
                endTime: "",
                user: "",
                email: "",
                userId: "",
                vehiclePlate: "",
                mobileNumber: "",
                reservation: "",
                reservationId: "",
                reservationEmail: "",
                reservationPlate: "",
                reservationMobileNumber: "",
            });
        }
    };

    return (
        <div className="card shadow">
            <div className="card-header">
                <strong>Slot {slot.id} {slot.id == 2 ? "EU" : slot.id == 4 ? "US" : "CN"}</strong>
                <span className={`badge ${slot.occupied ? "red" : "green"}`}>
                    {slot.occupied ? "Busy" : "Free"}
                </span>
            </div>

            <div className="details">
                {slot.occupied && (
                    <>
                        <div className="flex gap-2 items-center">
                            <IoTime />
                            <p>Until: {slot.endTime || "--:--"}</p>
                        </div>

                        {slot.user && (
                            <div className="flex flex-col gap-1">
                                <p className="flex flex-wrap items-center gap-2 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    <FaUser />
                                    {slot.user}
                                </p>
                                <p className="flex flex-wrap items-center gap-2 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                                    <FaPhoneAlt />
                                    {slot.mobileNumber ? slot.mobileNumber : "No mobile"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaEnvelope />
                                    <a className="text-slate-600 underline italic" href={`mailto:${slot.email}`} target="_blank" rel="noopener noreferrer">
                                        {slot.email}
                                    </a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaCar />
                                    {slot.vehiclePlate}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {slot.reservationId && slot.occupied && (
                    <div className="reservation flex flex-col gap-1">
                        <p className="flex items-center gap-1">
                            <FaUserFriends />
                            Reserved by {slot.reservation}
                        </p>
                    </div>
                )}

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                {isEditingTime && (
                    <div className="mt-3 flex items-center gap-3">
                        <input
                            type="time"
                            value={editEndTime}
                            onChange={(e) => setEditEndTime(e.target.value)}
                            className="rounded border px-3 py-2"
                        />
                        <button
                            className="rounded border border-green-300 text-green-500 rounded px-3 py-2"
                            onClick={() => {
                                const t = editEndTime && editEndTime.trim();
                                if (!t) return;
                                updateSlot(slot.id, { endTime: t });
                                setIsEditingTime(false);
                            }}
                        >
                            Save
                        </button>
                        <button className="rounded border border-red-300 text-red-500 rounded px-3 py-2" onClick={() => setIsEditingTime(false)}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="actions">
                {!slot.occupied && (
                    <>
                        <input
                            type="time"
                            placeholder="Until time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="block w-full rounded border px-3 py-2"
                        />

                        <button
                            className="w-full rounded bg-[#68C151] px-4 py-2 text-white disabled:bg-gray-400"
                            onClick={handleOccupy}
                            disabled={hasOtherSlot}
                        >
                            Start Charging
                        </button>

                        {/* {hasOtherSlot && !isCurrentReserver && (
                            <p className="text-sm text-red-600 mt-2">
                                You already have another active or reserved slot.
                            </p>
                        )} */}
                    </>
                )}

                {slot.occupied && !slot.reservationId && !isCurrentOccupant && (
                    <>
                        <button
                            className="w-full mt-3 bg-yellow-500 px-4 py-2 rounded text-white disabled:bg-gray-400"
                            onClick={handleReserve}
                            disabled={hasOtherSlot}
                        >
                            Reserve Slot
                        </button>
                        {/* {hasOtherSlot && (
                            <p className="text-sm text-red-600 mt-2">
                                You already have another active or reserved slot.
                            </p>
                        )} */}
                    </>
                )}

                {slot.occupied && slot.reservationId && isCurrentReserver && (
                    <>
                        <button
                            className="w-full rounded px-4 py-2 bg-red-500 text-white"
                            onClick={handleCancelReservation}
                        >
                            Cancel Reservation
                        </button>
                        {/* {hasOtherSlot && (
                            <p className="text-sm text-red-600 mt-2">
                                You already have another active or reserved slot.
                            </p>
                        )} */}
                    </>
                )}

                {slot.occupied && isCurrentOccupant && (
                    <>
                        <button
                            className="w-full flex items-center justify-center gap-1 bg-gray-300 rounded px-4 py-2 mt-3"
                            onClick={() => {
                                setEditEndTime(slot.endTime || "");
                                setIsEditingTime(true);
                            }}
                        >
                            <FaEdit /> Edit time
                        </button>
                        <button
                            className="w-full rounded bg-red-500 px-4 py-2 text-white"
                            onClick={handleStopCharging}
                        >
                            Stop Charging
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}


{/* {isCurrentReserver && (
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={handleOccupy}
                >
                  Start Charging
                </button>
                <button
                  className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700"
                  onClick={handleCancelReservation}
                >
                  Cancel Reservation
                </button>
              </div>
            )} */}

{/* {!isCurrentReserver && (
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={handleOccupy}
                  disabled={hasOtherSlot}
                >
                  Start Charging
                </button>
                <button
                  className="w-full rounded border border-slate-300 px-4 py-2 text-slate-700"
                  onClick={handleReserve}
                  disabled={hasOtherSlot}
                >
                  Reserve Slot
                </button>
              </div>
            )} */}