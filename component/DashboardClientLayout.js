"use client";

import React, { useState } from "react";
import Sidebar from "@/component/Sidebar";

export default function DashboardClientLayout({ userEmail, children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userEmail={userEmail}
      />
      <main className="main-content">{children}</main>
    </div>
  );
}
