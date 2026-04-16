"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./lib/firebase";
import SlotCard from "./components/SlotCard";
import Link from "next/link";
import { CiMap, CiUser, CiSquareRemove } from "react-icons/ci";


export default function HomePage() {
  const [slots, setSlots] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "slotsNew"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setSlots(data.sort((a, b) => a.id - b.id));
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData({ uid: user.uid, ...userDoc.data() });
          } else {
            console.log("No user data found");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  const updateSlot = async (id, data) => {
    await updateDoc(doc(db, "slotsNew", String(id)), data);
  };


  return (
    <main className="">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 bg-white p-4 rounded shadow">
          <div className="flex items-center gap-2">
            <img src="./ev_charging_q_logo.png" alt="logo" className="w-[45px]" />
            <div>
              <h1>EV Charging Q</h1>
              <p className="subtitle">Azercell Office Yard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMapOpen((prev) => !prev)}
              className="p-2 rounded bg-gray-200"
            >
              {isMapOpen ? <CiSquareRemove size={20} /> : <CiMap size={20} />}
            </button>
            <Link
              href="/profile"
              className="p-2 rounded bg-gray-900 text-white"
            >
              <CiUser size={20} />
            </Link>
          </div>
        </div>
      </div>

      {isMapOpen && (
        <div className="map-container my-4">
          <img src="/Image.jpg" alt="EV Charging Slots Map" className="map-image" />
        </div>
      )}

      <div className="container grid gap-4">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            updateSlot={updateSlot}
            currentUser={userData}
            allSlots={slots}
          />
        ))}
      </div>

      {/* <div className="text-center mb-6">
        <Link
          href="/User guide for EV charging Q.pdf"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >See User Manual</Link>
      </div> */}
    </main>
  );
}
