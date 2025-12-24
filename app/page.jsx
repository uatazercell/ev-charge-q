"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import SlotCard from "./components/SlotCard1";

export default function HomePage() {
  const [slots, setSlots] = useState([]);

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
      <h1>EV Charging Queue</h1>
      <p className="subtitle">Office Yard</p>

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
