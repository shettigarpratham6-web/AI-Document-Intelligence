"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const signup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", user.user.uid), {
        email,
        createdAt: new Date()
      })

      router.push("/dashboard")
    } catch (error) {
      alert("Signup failed: " + error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-80">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Signup
        </h1>

        <input
          className="border border-gray-300 rounded p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white p-2 w-full rounded hover:bg-gray-800 transition"
          onClick={signup}
        >
          Signup
        </button>

        <button
          className="text-sm text-blue-600 mt-4 w-full text-center hover:underline"
          onClick={() => router.push("/")}
        >
          Login
        </button>
      </div>
    </div>
  )
}
