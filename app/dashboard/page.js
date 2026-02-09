"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { extractTextFromImage } from "../../lib/ocr";
import { extractExpiryFromText } from "../../lib/expiry";

export default function Dashboard() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 🔁 Load saved data
  useEffect(() => {
    const savedImage = localStorage.getItem("docImage");
    const savedExpiry = localStorage.getItem("expiryDate");

    if (savedImage) setImage(savedImage);
    if (savedExpiry) setExpiryDate(savedExpiry);
  }, []);

  // 📤 Upload + OCR + expiry extraction
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result;
      localStorage.setItem("docImage", base64);
      setImage(base64);

      try {
        // 1️⃣ OCR
        const text = await extractTextFromImage(base64);
        console.log("OCR TEXT:", text);

        // 2️⃣ Expiry extraction (NO AI)
        const expiry = extractExpiryFromText(text);

        setExpiryDate(expiry);
        localStorage.setItem("expiryDate", expiry);
      } catch (error) {
        alert("Failed to process image");
      }
    };

    reader.readAsDataURL(file);
  };

  // ⏰ Reminder
  const setReminder = () => {
    if (!reminderTime) {
      alert("Select reminder time");
      return;
    }

    const delay =
      new Date(reminderTime).getTime() - new Date().getTime();

    if (delay <= 0) {
      alert("Reminder time must be in the future");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setTimeout(() => {
          new Notification("Expiry Reminder", {
            body: `Your document expires on ${expiryDate}`,
          });
        }, delay);
      }
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          className="text-sm text-red-600"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      <p className="mt-4">
        <strong>Email:</strong> {userEmail}
      </p>

      <hr className="my-4" />

      <input type="file" accept="image/*" onChange={handleUpload} />

      {image && (
        <img
          src={image}
          className="mt-4 w-60 rounded"
          alt="Uploaded"
        />
      )}

      {expiryDate && (
        <p className="mt-4">
          <strong>Expiry Date:</strong> {expiryDate}
        </p>
      )}

      {expiryDate && (
        <>
          <input
            type="datetime-local"
            className="border p-2 mt-3 w-full"
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <button
            className="bg-black text-white p-2 w-full mt-2"
            onClick={setReminder}
          >
            Set Reminder
          </button>
        </>
      )}
    </div>
  );
}
