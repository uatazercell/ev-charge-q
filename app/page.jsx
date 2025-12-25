"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import SlotCard from "./components/SlotCard1";

export default function HomePage() {
  const [slots, setSlots] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "slots"), snapshot => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setSlots(data.sort((a, b) => a.id - b.id));
    });

    return () => unsub();
  }, []);

  const updateSlot = async (id, data) => {
    await updateDoc(doc(db, "slots", String(id)), data);
  };

  return (
    <main className="container">
      <div className="flex items-center justify-between">
        <div>
          <h1>EV Charging Queue</h1>
          <p className="subtitle">Azercell Office Yard</p>
        </div>
        <button
          onClick={() => setIsMapOpen(prev => !prev)}
          className="px-4 py-2 !bg-blue-400 !text-white rounded"
        >
          Slots map</button>
      </div>

      {isMapOpen && (
        <div className="map-container my-4">
          <img src="/Image.jpg" alt="EV Charging Slots Map" className="map-image" />
        </div>
      )}

      {slots.map(slot => (
        <SlotCard
          key={slot.id}
          slot={slot}
          updateSlot={updateSlot}
        />
      ))}
    </main>
  );
}
