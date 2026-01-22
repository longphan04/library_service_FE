import { Outlet } from 'react-router-dom'

export default function UserLayout() {
    return (
        <>
            <header className="bg-[--color-bg-nav]">Navbar</header>
            <main>
                <Outlet />
            </main>
        </>
    )
}
