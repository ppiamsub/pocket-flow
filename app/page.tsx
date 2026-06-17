"use client"
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { TransactionGroup } from "@prisma/client";

export default function Home() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("/api/transaction-group")
      .then(res => res.json())
      .then(data => setGroups(data))
  }, []);

  async function newPocket(params: React.FormEvent<HTMLFormElement>) {
    params.preventDefault(); //stop reload when submit

    const formData = new FormData(params.currentTarget);
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    await fetch("/api/transaction-group", {
      method: "POST",
      headers: {
        "Contenet-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        description : description
      })
    })
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      {groups.length > 0 ?
        (
          <div className="grid grid-cols-1 sm:grid">
            {groups.map((group: TransactionGroup) => (
              <div key={group.id} className="border text-center p-4 bg-white rounded-lg text-black">
                <h2 className="font-bold text-xl" >{group.name}</h2>
                <h3 className="text-sm text-gray-500 pt-2">{group.description}</h3>
                <h4 className="text-xs text-gray-500 text-right pt-4">{new Date(group.updatedAt).toLocaleDateString("th-TH")} {new Date(group.updatedAt).toLocaleTimeString("th-TH")}</h4>
              </div>
            ))}
          </div>
        )
        :
        (
          <div className="bg-white rounded-lg p-8 text-center text-black">
            <form onSubmit={newPocket} className="flex flex-col gap-3 mb-8">
              <h2>New Pocket</h2>
              <input name="name" placeholder="name" className="rounded-lg border mt-4 p-2"></input>
              <textarea name="description" placeholder="description...." className="rounded-lg border p-2"></textarea>

              <button type="submit" className="rounded-lg mt-2 p-2 bg-green-800 text-white hover:bg-green-400 hover:text-black">create</button>
            </form>
          </div>
        )
      }
    </div>
  )
}