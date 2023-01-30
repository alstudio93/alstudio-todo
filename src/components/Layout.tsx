import React from 'react'
import Navbar from './Navbar'



const Layout: React.FC<{
    children: React.ReactNode;

}> = ({ children }) => {
    return (
        <div className="bg-slate-800 min-h-screen">
            <Navbar />
            {children}
        </div>
    )
}

export default Layout