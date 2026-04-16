"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        surname,
        vehiclePlateNumber,
        mobileNumber,
        email,
        createdAt: new Date(),
      });

      router.push("/");
    } catch (err) {
      setError(err.message || "Unable to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container max-w-lg mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Sign up</h1>
        <p className="mt-2 text-sm text-slate-500">Create a new account to access the charging queue.</p>
      </div>

      <form className="space-y-4 px-6 w-full" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium">Name*</span>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Surname*</span>
          <input
            required
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Vehicle Plate Number*</span>
          <input
            required
            type="text"
            placeholder="00XX000"
            value={vehiclePlateNumber}
            onChange={(e) => setVehiclePlateNumber(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Mobile Number</span>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email*</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link href="/login" className="text-blue-600 underline">Log in</Link>
      </p>
    </main>
  );
}
