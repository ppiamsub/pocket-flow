import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

async function Login(formData: FormData) {
    "use server"
    try {
        await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirectTo: "/",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            redirect("/login?error=invalid")
        }
        throw error
    }
}
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {

    const params = await searchParams;
    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
            <h1 className="text-xl font-bold mb-6" >Login</h1>

            <form action={Login} className="flex flex-col gap-3">
                <input name="username" placeholder="Username" className="border rounded-lg px-4 py-2"></input>
                <input name="password" type="password" placeholder="Password" className="border rounded-lg px-4 py-2"></input>
                <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 font-semibold">Login</button>
            </form>
            {params.error && (
                <p className="text-red-500 text-sm text-center mb-4 py-2">
                    username or password invalid.
                </p>
            )}
            <a href="/register" className="block text-center py-2 text-blue-400 hover:underline"> register? </a>
        </div>
    )
}