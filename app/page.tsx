"use client"
import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import { TransactionGroup } from "@prisma/client";
import { fail } from "assert";

export default function Home() {
  const [groups, setGroups] = useState<(TransactionGroup | null)[]>([])
  const [pocket, setPocket] = useState<TransactionGroup | null>()
  const [tranType, setTranType] = useState<boolean>(true)
  const [showResCreateTransModal, setShowResCreateTransModal] = useState<boolean>(false);
  const [resultCreateTrans, setResultCreateTrans] = useState<boolean>(false);
  const [msgCreateTrans, setMsgCreateTrans] = useState<string>("");

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

  async function createTransaction(params: React.FormEvent<HTMLFormElement>) {
    params.preventDefault();

    const formTransaction = new FormData(params.currentTarget);
    const groupId = formTransaction.get("groupId") ?? 0;
    const amount = formTransaction.get("amount") ?? 0;
    const name = formTransaction.get("name")?.toString();
    const note = formTransaction.get("note")?.toString();

    const resCreatTransaction = await fetch("/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transactionGroupId: groupId,
        name: name,
        amount: amount,
        note: note
      })
    })

    if (resCreatTransaction.ok) {
      setShowResCreateTransModal(true)
      setResultCreateTrans(true)
      setMsgCreateTrans("")
    } else {
      setShowResCreateTransModal(true)
      setResultCreateTrans(false)
      setMsgCreateTrans(resCreatTransaction.statusText)
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
            <form onSubmit={createTransaction} className="flex flex-col gap-3 mb-8">
              <h2>{pocket?.name}</h2>
              <input name="groupId" value={pocket?.id} hidden className="rounded-lg border mt-4 p-2"></input>
              <input name="name" placeholder="name" className="rounded-lg border mt-4 p-2"></input>
              <div className="grid grid-cols-2 gap-1" >
                <select onChange={(e) => setTranType(e.target.value === "true")} name="addSign"
                  className={`rounded-lg border p-2 ${tranType ? "bg-green-800 text-white" : "bg-red-800 text-white"}`}>
                  <option className="bg-green-800 text-white" value="true" > + </option>
                  <option className="bg-red-800 text-white" value="false"> - </option>
                </select>
                <input name="amount" placeholder="amount" type="number" className="rounded-lg border p-2" ></input>
              </div>
              <textarea name="note" placeholder="note...." className="rounded-lg border p-2"></textarea>
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

      {showResCreateTransModal ?
        (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center">
              <h2 className={`${resultCreateTrans ? " text-green-600 " : "text-red-600"} text-lg font-bold mb-2`} >{resultCreateTrans ? "Success" : "Fail"}</h2>
              <p className="text-gray-600 mb-4">{msgCreateTrans}</p>
              <button onClick={() => setShowResCreateTransModal(false)} className="bg-blue-500 text-white rounded-lg px-6 py-2">Close</button>
            </div>
          </div>
        )
        : (<div></div>)
      }
    </div >
  )
}