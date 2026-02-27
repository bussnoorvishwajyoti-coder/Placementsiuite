"use client";

import { useState } from "react";
import Link from "next/link";
import { PlacementSuiteUser } from "@/types";
import { Menu, X, Home, Briefcase, FileText, BarChart3, Settings, LogOut } from "lucide-react";

interface NavbarProps {
  user?: PlacementSuiteUser;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { href: "/jobs", label: "Jobs", icon: <Briefcase className="w-4 h-4" /> },
    { href: "/analyze", label: "Analyze", icon: <FileText className="w-4 h-4" /> },
    { href: "/resume", label: "Resume", icon: <FileText className="w-4 h-4" /> },
    { href: "/applications", label: "Applications", icon: <BarChart3 className="w-4 h-4" /> },
    { href: "/proof", label: "Proof", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              PS
            </div>
            <span className="hidden md:inline">Placement Suite</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition font-medium text-sm"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Settings & Profile */}
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-gray-700 hover:text-primary">
              <Settings className="w-5 h-5" />
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-full text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              <LogOut className="w-4 h-4" />
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
