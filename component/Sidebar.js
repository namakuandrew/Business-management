"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DollarSignIcon,
  UsersIcon,
  BookIcon,
  SettingsIcon,
} from "./icon";

export default function Sidebar({ isSidebarOpen }) {
  const pathname = usePathname();
  const navItems = [
    { href: "/", icon: <HomeIcon />, label: "Dashboard" },
    { href: "/entries", icon: <BookIcon />, label: "Entries" },
    { href: "/contacts", icon: <UsersIcon />, label: "Contacts" },
  ];

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div>
        <div className="sidebar-logo">
          <DollarSignIcon />
          {isSidebarOpen && <h1>Accounting</h1>}
        </div>
        <nav>
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    {item.icon}
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div>
        <a href="#" className="nav-link">
          <SettingsIcon />
          {isSidebarOpen && <span>Settings</span>}
        </a>
      </div>
    </aside>
  );
}
