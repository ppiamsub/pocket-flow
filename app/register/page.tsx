import { redirect } from "next/navigation";
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma";

async function Register(formData: FormData) {
    "use server"
    try {
        await prisma.user.create({
            data: {
                name: formData.get("name") as string,
                username: formData.get("username") as string,
                password: await bcrypt.hash(formData.get("password") as string, 10),
                target : formData.get("target") as string
            }
        })
    } catch (error) {
        redirect("/register=invalid")
    }
}


export default function RegisterPage() {
    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
            <h1 className="text-xl font-bold mb-6" >Register</h1>

            <form action={Register} className="flex flex-col w-full gap-3">
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

        </div>
    );
}