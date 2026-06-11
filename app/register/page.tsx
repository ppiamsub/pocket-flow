"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {

    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: formData.get("name"),
                username: formData.get("username"),
                password: formData.get("password"),
                target: formData.get("target"),
            })
        })

        if (res.ok) {
            setShowModal(true);
        }
    }

    function handleLogin() {
        router.push("/login")
    }
    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
            <h1 className="text-xl font-bold mb-6" >Register</h1>

            <form onSubmit={handleRegister} className="flex flex-col w-full gap-3">
                <input name="name" placeholder="name" className="border rounded-lg px-4 py-2 w-full" ></input>
                <input name="username" placeholder="username" className="border rounded-lg px-4 py-2 w-full" ></input>
                <input name="password" type="password" placeholder="password" className="border rounded-lg px-4 py-2 w-full"></input>
                <select name="target" className="border rounded-lg px-4 py-2 w-full">
                    <option className="text-black" value="">select answer</option>
                    <option className="text-black" value="67">67</option>
                    <option className="text-black" value="007">007</option>
                </select>
                <button type="submit" className="bg-green-600 text-white rounded-lg py-2 ">register</button>
            </form>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 text-center">
                        <h2 className="text-green-600 text-lg font-bold mb-2" >Success</h2>
                        <p className="text-gray-600 mb-4">please login for enter to fun.</p>
                        <button onClick={handleLogin} className="bg-blue-500 text-white rounded-lg px-6 py-2">Login</button>
                    </div>
                </div>
            )}
        </div>
    );
}