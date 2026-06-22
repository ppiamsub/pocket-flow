"use client"
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { TransactionGroup } from "@prisma/client";

export default function Home() {
  const [groups, setGroups] = useState<(TransactionGroup | null)[]>([])
  const [pocket, setPocket] = useState<TransactionGroup | null>()
  const [addSign, setAddSign] = useState<boolean>(true)

  useEffect(() => {
    fetch("/api/transaction-group")
      .then(res => res.json())
      .then(data => {
        const filled = [...data]
        while (filled.length < 3) {
          filled.push(null)  // เติม null แทน
        }
        setGroups(filled)
      })
  }, [])

  async function newPocket(params: React.FormEvent<HTMLFormElement>) {
    params.preventDefault(); //stop reload when submit

    console.log("create")
    const formData = new FormData(params.currentTarget);
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const resNewPocket = await fetch("/api/transaction-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        description: description
      })
    })

    if (resNewPocket.ok) {
      fetch("/api/transaction-group")
        .then(res => res.json())
        .then(data => setGroups(data))
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      {groups.length > 0 ?
        (
          <div className="grid grid-cols-3 gap-1 sm:grid">
            {groups.map((group) => (
              !group ?
                (
                  <div onClick={() => setPocket(undefined)} key={0} className="border text-center p-4 bg-white rounded-lg text-black" >
                    <h2 className="text-[14px] font-bold">New Pocket</h2>
                  </div>
                ) :
                (<div onClick={() => setPocket(group)} key={group?.id} className="border text-center p-4 bg-white rounded-lg text-black">
                  <h2 className="text-[14px] font-bold" >{group?.name}</h2>
                  <h3 className="text-[10px] text-gray-500 pt-2">{group?.description}</h3>
                </div>
                )
            ))}
          </div>
        )
        :
        (<div></div>)
      }
      {pocket ?
        (
          <div className="bg-white rounded-lg mt-2 p-8 text-center text-black">
            <form onSubmit={newPocket} className="flex flex-col gap-3 mb-8">
              <h2>{pocket?.name}</h2>
              <input name="name" placeholder="name" className="rounded-lg border mt-4 p-2"></input>
              <div className="grid grid-cols-2 gap-1" >
                <select onChange={(e) => setAddSign(e.target.value === "true")} name="addSign"
                  className={`rounded-lg border p-2 ${addSign ? "bg-green-800 text-white" : "bg-red-800 text-white"}`}>
                  <option className="bg-green-800 text-white" value="true" > + </option>
                  <option className="bg-red-800 text-white" value="false"> - </option>
                </select>
                <input name="amount" placeholder="amount" type="number" className="rounded-lg border p-2" ></input>
              </div>
              <textarea name="description" placeholder="description...." className="rounded-lg border p-2"></textarea>
              <button type="submit" className="rounded-lg mt-2 p-2 bg-green-800 text-white hover:bg-green-400 hover:text-black">Save</button>
            </form>
          </div>
        )
        : (
          <div className="bg-white rounded-lg mt-2 p-8 text-center text-black">
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