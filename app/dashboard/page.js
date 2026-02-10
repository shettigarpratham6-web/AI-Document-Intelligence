"use client";

import { useEffect, useState, useRef } from "react";

import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { extractTextFromImage } from "../../lib/ocr";
import { extractExpiryFromText } from "../../lib/expiry";

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");


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

  
  useEffect(() => {
    const savedImage = localStorage.getItem("docImage");
    const savedExpiry = localStorage.getItem("expiryDate");

    if (savedImage) setImage(savedImage);
    if (savedExpiry) setExpiryDate(savedExpiry);
  }, []);

  
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
       
        const text = await extractTextFromImage(base64);
        console.log("OCR TEXT:", text);

        
        const expiry = extractExpiryFromText(text);

        setExpiryDate(expiry);
        localStorage.setItem("expiryDate", expiry);

        
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            email: auth.currentUser.email,
            expiryDate: expiry,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        alert("Failed to process image");
      }
    };

    reader.readAsDataURL(file);
  };

 
  const removeDocument = async () => {
    localStorage.removeItem("docImage");
    localStorage.removeItem("expiryDate");

    setImage(null);
    setExpiryDate("");
    setReminderTime("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

   
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        expiryDate: "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

 
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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <button
            className="text-sm text-red-600 hover:underline"
            onClick={() => signOut(auth)}
          >
            Logout
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-700">
          <span className="font-semibold">Email:</span> {userEmail}
        </p>

        <hr className="my-5" />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          className="block w-full text-sm text-gray-700
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:bg-black file:text-white
                     hover:file:bg-gray-800 cursor-pointer"
        />

        {image && (
          <img
            src={image}
            className="mt-4 w-60 rounded-md border shadow-sm"
            alt="Uploaded"
          />
        )}

        {image && (
          <button
            className="mt-2 text-sm text-red-600 hover:underline"
            onClick={removeDocument}
          >
            Remove Document
          </button>
        )}

        {expiryDate && (
          <p className="mt-4 text-gray-800">
            <span className="font-semibold">Expiry Date:</span>{" "}
            {expiryDate}
          </p>
        )}

        {expiryDate && (
          <>
            <input
              type="datetime-local"
              className="border border-gray-300 rounded p-2 mt-4 w-full focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
              onChange={(e) => setReminderTime(e.target.value)}
            />
            <button
              className="bg-black text-white p-2 w-full mt-3 rounded hover:bg-gray-800 transition"
              onClick={setReminder}
            >
              Set Reminder
            </button>
          </>
        )}
      </div>
    </div>
  );
}
