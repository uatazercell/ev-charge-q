"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface UserData {
  uid: string;
  name: string;
  surname: string;
  vehiclePlateNumber: string;
  mobileNumber: string;
  email: string;
  createdAt?: any;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [clearingSlots, setClearingSlots] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as Omit<UserData, 'uid'>;
            setUserData({ uid: user.uid, ...data });
          } else {
            setError("User data not found.");
          }
        } catch (err) {
          setError("Error loading user data.");
          console.error(err);
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!userData) return;

    try {
      const formData = new FormData(event.currentTarget);
      const updatedData = {
        name: formData.get("name") as string,
        surname: formData.get("surname") as string,
        vehiclePlateNumber: formData.get("vehiclePlateNumber") as string,
        mobileNumber: formData.get("mobileNumber") as string,
        email: formData.get("email") as string,
      };

      await updateDoc(doc(db, "users", userData.uid), updatedData);
      setUserData({ ...userData, ...updatedData });
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut(auth);
    router.push("/login");
  };

  const handleClearSlots = async () => {
    setClearingSlots(true);
    setError("");

    try {
      Array.from({ length: 6 }, (_, i) => i + 1).forEach(async i => {
        await updateDoc(doc(db, "slotsNew", String(i)), {
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
      })
      alert("All slots cleared successfully!");
    } catch (err) {
      setError("Error clearing slots.");
      console.error(err);
    } finally {
      setClearingSlots(false);
    }
  };

  if (loading) {
    return (
      <main className="container max-w-lg mx-auto py-12 px-4">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <div className="container max-w-lg mx-auto py-12 px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="container max-w-lg mx-auto py-12 px-4">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-4 px-4 py-2 rounded flex items-center gap-1"
        >
          <IoArrowBack /> Back
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="mt-2 text-sm text-slate-500">Edit your profile information.</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSave}>
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            required
            type="text"
            name="name"
            defaultValue={userData?.name || ""}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Surname</span>
          <input
            required
            type="text"
            name="surname"
            defaultValue={userData?.surname || ""}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Vehicle Plate Number</span>
          <input
            required
            type="text"
            name="vehiclePlateNumber"
            defaultValue={userData?.vehiclePlateNumber || ""}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Mobile Number</span>
          <input
            required
            type="tel"
            name="mobileNumber"
            defaultValue={userData?.mobileNumber || ""}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            required
            type="email"
            name="email"
            defaultValue={userData?.email || ""}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full mt-4 px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>

      {userData?.uid === "oHlmNz1vUOZIjyZAZQJYAMIsdxJ2" && (
        <button
          type="button"
          onClick={handleClearSlots}
          disabled={clearingSlots}
          className="w-full mt-4 px-4 py-2 rounded bg-red-500 text-white disabled:opacity-50"
        >
          {clearingSlots ? "Clearing..." : "Clear All Slots"}
        </button>
      )}
    </main>
  );
}