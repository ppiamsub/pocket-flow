import Link from "next/link"

type HeaderProps = {
    title?: string
}

export default function Header({ title }: HeaderProps) {
    return (
        <header>
            <h1>{title}</h1>
            <nav>
                <Link href="/">Home</Link>
                {" | "}
                <Link href="/about">History</Link>
                {" | "}
                <Link href="/about">Dashboard</Link>
            </nav>
        </header>
    )
}
