import { prisma } from "./lib/prisma"

async function addTransaction(form: FormData) {
  "use server"

  await prisma.transaction.create({
    data: {
      title: form.get("title") as string,
      amount: Number(form.get("amount")),
      type: form.get("type") as string,
    }
  })
}

async function deleteTransaction(form: FormData) {
  "use server"

  await prisma.transaction.delete({
    where: { id: Number(form.get("id")) }
  })
}

export default async function Home() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { CreatedAt: "desc" }
  })

  const income = transactions.filter((x) => x.type === "income")
    .reduce((sum, x) => sum + x.amount, 0)

  const expense = transactions.filter((x) => x.type == "expense")
    .reduce((sum, x) => x.amount, 0)

  const balance = income + expense

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4" >This is a home page.</h2>

      <form action={addTransaction} className="flex flex-col gap-3 mb-8">
        <input name="title" placeholder="card name" required className="bolder rounded-lg px-4 py-2"></input>
        <input name="amount" type="number" placeholder="amount" className="bolder rounded-lg px-4 py-2" ></input>
        <select name="type" className="bolder rounded-lg px-4 py-2">
          <option value="income">paid</option>
          <option value="expense">use</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-60 hover:text-black" >save</button>
      </form>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-grey-100 rounded-lg p-4 text-center" >
          <p>Remain</p> <p> {balance} </p>
        </div>
        <div className="bg-grey-100 rounded-lg p-4 text-center" >
          <p>Income</p> <p> {income} </p>
        </div>
        <div className="bg-grey-100 rounded-lg p-4 text-center" >
          <p>Expense</p> <p> {expense} </p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      {transactions.map((x) => (
        <div key={x.id} className="flex justify-between border rounded-lg px-4 py-3">
          <span>{x.title}</span>
          <span className={x.type === "income" ? "text-green-600" : "text-red-400"} >
            {x.type === "income" ? "-" : "+"} {x.amount}
          </span>
          <span>{x.CreatedAt.toLocaleDateString()}</span>
          <form action={deleteTransaction}>
            <input type="hidden" name="id" value={x.id}></input>
            <button type="submit" className="text-green-50 hover:text-red-400">delete</button>
          </form>
        </div>
      ))}
    </div>
  )
}