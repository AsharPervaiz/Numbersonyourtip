"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      style={{
        borderBottom: "1px solid #ddd",
        backgroundColor: "#1b3066",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <div
        className="container-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 0",
          position: "relative",
        }}
      >
        {/* Hamburger Button */}
        <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <img
            src="/no.-2.png"
            alt="Numbers On Your Tip"
            className="site-logo"
            style={{
              height: "60px",
              width: "auto",
              display: "block",
            }}
          />
        </Link>

        {/* Menu */}
        <nav>
          <ul className={menuOpen ? "menu active" : "menu"}>
            {/* Close Button */}
            <li style={{ marginBottom: "20px" }}>
              <button className="close-btn" onClick={closeMenu}>
                ✕
              </button>
            </li>

            {/* Menu Items (auto-close on click) */}
            <li><Link href="/bmi-calculator" onClick={closeMenu}>BMI</Link></li>
            <li><Link href="/unit-conversion-calculator" onClick={closeMenu}>Units</Link></li>
            <li><Link href="/time-calculator" onClick={closeMenu}>Time</Link></li>
            <li><Link href="/gpa-calculator" onClick={closeMenu}>GPA</Link></li>
            <li><Link href="/age-calculator" onClick={closeMenu}>Age</Link></li>
            <li><Link href="/days-between-calculator" onClick={closeMenu}>Days</Link></li>
            <li><Link href="/currency-converter" onClick={closeMenu}>Currency Converter</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
