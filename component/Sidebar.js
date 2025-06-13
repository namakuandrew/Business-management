'use client';

import link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, DollarSignIcon, UsersIcon, BookIcon, SettingsIcon } from "./icon";

export default function Sidebar({isSidebarOpen}) {
    const pathname = usePathname();

    const navItems = [
        {href: '/', icon: <HomeIcon />, label: 'Dashboard'},
        
    ]
    return (
        <aside className={`transition-all duration-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${isSidebarOpen ? 'w-64' : 'w-20'} p-4 flex flex-col justify-between`}>
        <div>
            <div className="flex item-center mb-8">
                <DollarSignIcon />
                {isSidebarOpen && <h1 className="text-xl font=bold-ml-2">Accounting</h1>}
            </div>
        <nav>
            <ul>
                <li className="mb-4">
                    <link 
                </li>
            </ul>
        </nav>
        </div>
        </aside>
    )
}