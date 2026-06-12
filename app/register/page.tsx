"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("");

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name")?.toString().trim();
        const username = formData.get("username")?.toString().trim();
        const password = formData.get("password")?.toString().trim();
        const target = formData.get("target")?.toString().trim();

        //validate
        if (!name || !username || !password || !target) {
            setError("please fill in all required fields")
            return;
        }
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                username: username,
                password: password,
                target: target,
            })
        })

        if (res.ok) {
            setShowModal(true);
        } else {
            const data = await res.json()
            setError(data.error);
        }
    }

    function handleLogin() {
        router.push("/login")
    }
    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
            <h1 className="text-xl font-bold mb-6" >Register</h1>

            <form onSubmit={handleRegister} className="flex flex-col w-full gap-3">
                <input name="name" placeholder="name" className="border rounded-lg px-4 py-2 w-full" required ></input>
                <input name="username" placeholder="username" className="border rounded-lg px-4 py-2 w-full" required ></input>
                <input name="password" type="password" placeholder="password" className="border rounded-lg px-4 py-2 w-full" required></input>
                <select name="target" className="border rounded-lg px-4 py-2 w-full required" >
                    <option className="text-black" value="">select answer</option>
                    <option className="text-black" value="67">67</option>
                    <option className="text-black" value="007">007</option>
                </select>
                <button type="submit" className="bg-green-600 text-white rounded-lg py-2 ">register</button>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
            </form>

            <p className="text-center text-sm text-gray-400 pt-2">
                have account?{" "}
                <a href="/login" className="text-blue-400 hover:underline">
                    Login
                </a>
            </p>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 text-center">
                        <h2 className="text-green-600 text-lg font-bold mb-2" >Success</h2>
                        <p className="text-gray-600 mb-4">please login for fun.</p>
                        <button onClick={handleLogin} className="bg-blue-500 text-white rounded-lg px-6 py-2">Login</button>
                    </div>
                </div>
            )}
        </div>
    );
}