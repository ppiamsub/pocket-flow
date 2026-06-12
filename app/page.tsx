import { auth } from "@/auth"
import { prisma } from "./lib/prisma"

export default async function Home() {
  const session = await auth();
  
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4" >This is a home page.</h2>

      <form className="flex flex-col gap-3 mb-8">
        <input name="title" placeholder="card name" required className="bolder rounded-lg px-4 py-2"></input>
        <input name="amount" type="number" placeholder="amount" className="bolder rounded-lg px-4 py-2" ></input>
        <select name="type" className="bolder rounded-lg px-4 py-2">
          <option value="income">paid</option>
          <option value="expense">use</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-60 hover:text-black" >save</button>
      </form>
    </div>
  )
}