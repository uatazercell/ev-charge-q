"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

const publicPaths = ["/login", "/signup"];

export default function AuthProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (publicPaths.includes(pathname)) {
          router.replace("/");
        }
      } else {
        if (!publicPaths.includes(pathname)) {
          router.replace("/login");
        }
      }
      setChecking(false);
    });

    return unsubscribe;
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-lg font-semibold">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
