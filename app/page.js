"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error) {
      alert("Login failed: " + error.message)
    }
  }

  return (
    <>
     <div className="bg-white h-12">
        <h1 className="text-blue-800 font-extrabold text-4xl ml-96 font-serif">AI Personal Document Intelligence</h1>
     </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    
      <div className="bg-white shadow-lg rounded-lg p-8 w-80">
          
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Login
        </h1>

        <input
          className="border border-gray-300 rounded p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white p-2 w-full rounded hover:bg-gray-800 transition"
          onClick={login}
        >
          Login
        </button>

        <p className="text-sm text-center mt-4 text-black">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
    </>
  )
}
