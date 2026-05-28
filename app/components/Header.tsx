
type HeaderProps = {
    title?: string
}

export default function Header({ title }: HeaderProps) {
    return (
        <header>
            <nav>
                <a href="">Home</a>
                {" | "}
                <a href="/Card">Card</a>
                {" | "}
                <a href="/profile">Profile</a>
            </nav>
            <h1>{title}</h1>
        </header>
    )
}
