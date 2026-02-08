"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useRouter } from "next/navigation"

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
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 w-80">
        <h1 className="text-xl mb-4">Login</h1>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white p-2 w-full" onClick={login}>Login</button>
      </div>
    </div>
  )
}
