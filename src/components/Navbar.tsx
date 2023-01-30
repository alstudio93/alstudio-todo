import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-10 py-5 max-w-7xl mx-auto">
            <Image src="/alstudio.png" alt="ALStudio Logo" height="60" width="120" />
            <ul className="text-slate-200 flex items-center gap-x-5">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/archive">Archive</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar