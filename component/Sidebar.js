"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  DollarSignIcon,
  UsersIcon,
  BookIcon,
  SettingsIcon,
} from "./icon";
import { signOut } from "@/lib/action";

export default function Sidebar({ isSidebarOpen, setSidebarOpen, userEmail }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/", icon: <HomeIcon />, label: "Dashboard" },
    { href: "/entries", icon: <BookIcon />, label: "Entries" },
    { href: "/contacts", icon: <UsersIcon />, label: "Contacts" },
  ];

  const handleSignOut = async () => {
    await signOut();
    // This client-side redirect is more robust for clearing the cache
    router.push("/login");
  };

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
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">
            {" "}
            {userEmail?.charAt(0).toUpperCase() || "A"}{" "}
          </div>
          {isSidebarOpen && <span className="user-email">{userEmail}</span>}
        </div>
        <form action={signOut}>
          <button onClick={handleSignOut} className="logout-btn">
            {isSidebarOpen ? (
              "Log Out"
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
