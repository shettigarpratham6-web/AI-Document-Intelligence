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
            password,
            createdAt: new Date()
        })
        router.push("/dashboard")
    } catch (error) {
        alert("Signup failed: " + error.message)
    }
}

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 w-80">
        <h1 className="text-xl mb-4">Signup</h1>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white p-2 w-full" onClick={signup}>Signup</button>
      </div>
    </div>
  )
}
