"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const menuTimerRef = useRef<NodeJS.Timeout | null>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target as Node)
      ) {
        closeMegaMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMegaMenu = () => setActiveMegaMenu(null);

  const menuData = {
    "bmi-calculator": {
      title: "Health & Fitness",
      columns: [
        {
          items: [
            {
              name: "BMI Calculator",
              desc: "Check your body mass index",
              href: "/bmi-calculator",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="4" r="2" />
                  <path d="M9 12l-2 8" />
                  <path d="M15 12l2 8" />
                  <path d="M8 12h8" />
                  <path d="M10 12v-3l2-2 2 2v3" />
                  <line x1="6" y1="20" x2="18" y2="20" />
                  <line x1="6" y1="20" x2="6" y2="17" />
                  <line x1="18" y1="20" x2="18" y2="17" />
                  <line x1="12" y1="20" x2="12" y2="18" />
                </svg>
              ),
            },
            {
              name: "Body Fat Calculator",
              desc: "Estimate your body fat %",
              href: "/body-fat-calculator",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a6 6 0 0112 0v2" />
                </svg>
              ),
            },

            {
              name: "Calorie Calculator",
              desc: "Daily calorie needs tracker",
              href: "/calorie-calculator/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8h1a4 4 0 010 8h-1" />
                  <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Dose Calculator",
              desc: "Medication dosage helper",
              href: "/dose-calculator/",
              iconColor: "coral",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              ),
            },
            {
              name: "Dose Stock Calculator",
              desc: "Manage medication inventory",
              href: "/dose-stock-calculator/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              ),
            },
            {
              name: "Pharmacodynamics Calculator",
              desc: "The core pharmacodynamic parameters",
              href: "/pharmacodynamics-calculator/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="19" cy="12" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <line x1="7" y1="11" x2="10" y2="8" />
                  <line x1="14" y1="8" x2="17" y2="11" />
                  <line x1="17" y1="13" x2="14" y2="16" />
                  <line x1="10" y1="16" x2="7" y2="13" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "IV Calculator",
              desc: "Intravenous drip rates",
              href: "/iv-calculator/",
              iconColor: "green",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              ),
            },
            {
              name: "Pharmacokinetics Calculator",
              desc: "the six core PK parameters",
              href: "/pharmacokinetics-calculator/",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 3h6" />
                  <path d="M10 3v5l-4 7a3 3 0 002.7 4.5h6.6A3 3 0 0018 15l-4-7V3" />
                  <path d="M8.5 15c1-1.5 2-1.5 3 0s2 1.5 3 0" />
                </svg>
              ),
            },
          ],
        },
      ],
    },
    "unit-conversion-calculator": {
      title: "Finance & Numbers",
      columns: [
        {
          items: [
            {
              name: "EMI Calculator",
              desc: "Monthly loan installment",
              href: "/emi-calculator/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              ),
            },
            {
              name: "Home Mortgage Calculator",
              desc: "Estimate mortgage payments",
              href: "/home-mortgage-calculator/",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              ),
            },
            {
              name: "Net Worth Calculator",
              desc: "Calculate Your Total Net Worth",
              href: "/net-worth-calculator/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="6" rx="8" ry="3" />
                  <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                  <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" />
                  <path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" />
                </svg>
              ),
            },
            {
              name: "Fuel Cost Calculator",
              desc: "Calculate Trip Fuel Cost",
              href: "/fuel-cost-calculator/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16" />
                  <path d="M3 22h12" />
                  <path d="M7 10h4" />
                  <path d="M15 6h1a2 2 0 012 2v3a2 2 0 002 2h0V8l-3-3" />
                  <path d="M20 13v6a1 1 0 01-1 1h-1" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Rent Calculator",
              desc: "Monthly rent affordability",
              href: "/rent-calculator/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              ),
            },
            {
              name: "Loan Calculator",
              desc: "Loan repayment estimator",
              href: "/loan-calculator/",
              iconColor: "coral",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              ),
            },
            {
              name: "Freelancer Tax Calculator",
              desc: "Take-Home Pay After Tax & Platform Fees",
              href: "/freelancer-tax-calculator/",
              iconColor: "blue",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
                  <path d="M14 8h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5m2 0v1.5m0 -9v1.5" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Income Tax Calculator",
              desc: "Calculate your tax liability",
              href: "/income-tax-calculator/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              ),
            },
            {
              name: "VAT Calculator",
              desc: "Value added tax helper",
              href: "/vat-calculator/",
              iconColor: "green",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              ),
            },
            {
              name: "Gold Calculator",
              desc: "Value, purity, resale & zakat",
              href: "/gold-calculator/",
              isNew: true,
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="8" r="6" />
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                  <path d="M7 6h1v4" />
                  <path d="m16.71 13.88.7.71-2.82 2.82" />
                </svg>
              ),
            },
            {
              name: "Salary Hike Calculator",
              desc: "New Salary After Appraisal",
              href: "/salary-hike-calculator/",
              iconColor: "purple",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4h-6a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h8" />
                  <path d="M18 20v-17" />
                  <path d="M15 6l3 -3l3 3" />
                </svg>
              ),
            },
          ],
        },
      ],
    },
    "time-calculator": {
      title: "Daily Use Calculators",
      columns: [
        {
          items: [
            {
              name: "Days Between Dates",
              desc: "Calculate date difference",
              href: "/days-between-calculator/",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              name: "Time Calculator",
              desc: "Add & subtract time easily",
              href: "/time-calculator/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
            {
              name: "Age Calculator",
              desc: "Find exact age in seconds",
              href: "/age-calculator/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "GPA Calculator",
              desc: "Compute your grade average",
              href: "/gpa-calculator/",
              iconColor: "coral",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              ),
            },
            {
              name: "GPA Percentage Calculator",
              desc: "Convert GPA to percentage",
              href: "/gpa-percentage/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="5" x2="5" y2="19" />
                  <circle cx="6.5" cy="6.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              ),
            },
            {
              name: "Percentage Calculator",
              desc: "Quick percentage solver",
              href: "/percentage-calculator/",
              iconColor: "green",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 9h.01M15 15h.01M9 15l6-6" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Unit Conversion Calculator",
              desc: "Convert any unit instantly",
              href: "/unit-conversion-calculator/",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
              ),
            },
            {
              name: "Discount Calculator",
              desc: "Calculate Sale Price, Savings & Final Price",
              href: "/discount-calculator/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>
              ),
            },
            {
              name: "Bill Split Calculator",
              desc: "Split Any Bill Equally or Unevenly",
              href: "/bill-split-calculator/",
              iconColor: "teal",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  width="22"
                  height="22"
                >
                  <path d="M136,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM96,120H35.31l18.35-18.34A8,8,0,0,0,42.34,90.34l-32,32a8,8,0,0,0,0,11.32l32,32a8,8,0,0,0,11.32-11.32L35.31,136H96a8,8,0,0,0,0-16Zm149.66,2.34-32-32a8,8,0,0,0-11.32,11.32L220.69,120H160a8,8,0,0,0,0,16h60.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,245.66,122.34Z" />
                </svg>
              ),
            },
          ],
        },
      ],
    },

    "dns-lookup": {
      title: "Network & Security",
      columns: [
        {
          items: [
            {
              name: "DNS Lookup",
              desc: "Look up domain DNS records",
              href: "/dns-lookup/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v6c0 1.66 4 3 9 3 .34 0 .67-.01 1-.03" />
                  <path d="M3 11v6c0 1.66 4 3 9 3 .34 0 .67-.01 1-.04" />
                  <circle cx="17.5" cy="17.5" r="3.5" />
                  <line x1="20" y1="20" x2="22" y2="22" />
                </svg>
              ),
            },
            {
              name: "IP Detector",
              desc: "Find your public IP address",
              href: "/ip-detector/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              ),
            },
            {
              name: "Email Validator",
              desc: "Check Syntax & Mail Server (MX) Records",
              href: "/email-validator/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="2,4 12,13 22,4" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Domain Name Checker",
              desc: "Check domain name availability",
              href: "/domain-name-checker/",
              iconColor: "coral",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="2" y1="7" x2="22" y2="7" />
                  <circle
                    cx="5"
                    cy="5"
                    r="0.8"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="8"
                    cy="5"
                    r="0.8"
                    fill="currentColor"
                    stroke="none"
                  />
                  <line x1="10" y1="5" x2="18" y2="5" />
                  <line x1="7" y1="21" x2="17" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              ),
            },
            {
              name: "Internet Speed Test",
              desc: "Check WiFi download, upload & ping",
              href: "/internet-speed-test/",
              isNew: true,
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21a9 9 0 1 0 -9 -9" />
                  <path d="M12 12l4 -4" />
                  <path d="M12 3v1" />
                  <path d="M3 12h1" />
                  <path d="M5.6 5.6l.7 .7" />
                </svg>
              ),
            },
          ],
        },
      ],
    },

    "median-mode-mean-calculator": {
      title: "Mathematics & Solutions",
      columns: [
        {
          items: [
            {
              name: "Median Mode Mean Calculator",
              desc: "Find central tendency of a data set",
              href: "/mean-median-mode-calculator/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              ),
            },
            {
              name: "Matrix Calculator",
              desc: "Add, multiply & solve matrices",
              href: "/matrix-calculator/",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              ),
            },
            {
              name: "Mixed Number Calculator",
              desc: "Add, subtract & convert fractions",
              href: "/mixed-number-calculator/",
              isNew: true,
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="5" x2="5" y2="19" />
                  <circle cx="6.5" cy="6.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              ),
            },
          ],
        },
      ],
    },

    "gpa-calculator": {
      title: "Tools",
      columns: [
        {
          items: [
            {
              name: "Currency Converter",
              desc: "Live exchange rate tool",
              href: "/currency-converter/",
              iconColor: "green",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              ),
            },
            {
              name: "Image Converter",
              desc: "Convert image formats fast",
              href: "/image-converter/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              ),
            },
            {
              name: "Image Compressor",
              desc: "Reduce image file size",
              href: "/image-compressor/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              ),
            },
            {
              name: "Image Resizer",
              desc: "Resize images to any size",
              href: "/image-resizer/",
              iconColor: "coral",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Password Generator",
              desc: "Generate secure passwords",
              href: "/password-generator/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              ),
            },
            {
              name: "Lorem Ipsum Generator",
              desc: "Generate dummy content",
              href: "/lorem-ipsum-generator/",
              iconColor: "amber",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                  <line x1="3" y1="18" x2="19" y2="18" />
                </svg>
              ),
            },
            {
              name: "Text Generator",
              desc: "AI-powered text creator",
              href: "/text-generator/",
              iconColor: "purple",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
            },
            {
              name: "Color Picker & Pallete Generator",
              desc: "Pick & generate colors",
              href: "/color-picker/",
              iconColor: "pink",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
              ),
            },
          ],
        },
        {
          items: [
            {
              name: "Text Case Converter",
              desc: "Transform text case & style",
              href: "/text-converter/",
              iconColor: "blue",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" y1="20" x2="15" y2="20" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
              ),
            },
            {
              name: "Words Counter",
              desc: "Count words & characters",
              href: "/word-char-counter/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              ),
            },
            {
              name: "Carbon Footprint Calculator",
              desc: "See Your CO₂ Impact Instantly",
              href: "/carbon-footprint-calculator/",
              iconColor: "teal",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.5 19H9a7 7 0 110-14 7 7 0 017 6h1.5a3.5 3.5 0 010 7" />
                  <line x1="9" y1="7" x2="9" y2="7.01" />
                  <path d="M8 19c0 1.5-1 3-1 3" />
                  <path d="M12 19c0 1.5-1 3-1 3" />
                  <path d="M16 19c0 1.5-1 3-1 3" />
                </svg>
              ),
            },
            {
              name: "Time Zone & World Clock",
              desc: "Convert times between any cities instantly",
              href: "/time-zone-converter/",
              iconColor: "coral",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                </svg>
              ),
            },
          ],
        },
      ],
    },
  };

  type IconColor =
    | "purple"
    | "blue"
    | "teal"
    | "coral"
    | "amber"
    | "green"
    | "pink";

  const iconColorMap: Record<IconColor, { bg: string; color: string }> = {
    purple: { bg: "#EEEDFE", color: "#534AB7" },
    blue: { bg: "#E6F1FB", color: "#185FA5" },
    teal: { bg: "#E1F5EE", color: "#0F6E56" },
    coral: { bg: "#FAECE7", color: "#993C1D" },
    amber: { bg: "#FAEEDA", color: "#854F0B" },
    green: { bg: "#EAF3DE", color: "#3B6D11" },
    pink: { bg: "#FBEAF0", color: "#993556" },
  };

  const mainMenuItems = [
    { label: "Health", key: "bmi-calculator", href: "/health-calculators/" },
    {
      label: "Finance",
      key: "unit-conversion-calculator",
      href: "/finance-calculators/",
    },
    {
      label: "Daily Use",
      key: "time-calculator",
      href: "/daily-use-calculators/",
    },
    { label: "Networking", key: "dns-lookup", href: "/networking-tools/" },
    {
      label: "Maths",
      key: "median-mode-mean-calculator",
      href: "/math-calculators/",
    },
    { label: "Tools", key: "gpa-calculator", href: "/tools/" },
    { label: "Blogs", href: "/blog/" },
    { label: "About Us", href: "/about-us/" },
  ];

  const handleMenuEnter = (key: string) => {
    if (menuTimerRef.current) {
      clearTimeout(menuTimerRef.current);
      menuTimerRef.current = null;
    }
    setActiveMegaMenu(key);
  };
  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => setActiveMegaMenu(null), 150);
  };
  const handleMegaMenuEnter = () => {
    if (menuTimerRef.current) {
      clearTimeout(menuTimerRef.current);
      menuTimerRef.current = null;
    }
  };
  const handleMegaMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => setActiveMegaMenu(null), 200);
  };

  useEffect(() => {
    return () => {
      if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    };
  }, []);

  return (
    <header className="header">
      <div className="container-header">
        <div className="menu-toggle" onClick={() => setMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <Link href="/" className="logo-link">
          <img
            src="/brand-logo.png"
            alt="Numbers On Your Tip"
            className="site-logo"
          />
        </Link>

        <nav className="desktop-nav">
          <ul className="desktop-menu">
            {mainMenuItems.map((item) => (
              <li
                key={item.key ?? item.label}
                onMouseEnter={() => item.key && handleMenuEnter(item.key)}
                onMouseLeave={handleMenuLeave}
                className="desktop-menu-item"
              >
                <Link href={item.href ?? ""} className="desktop-menu-link">
                  {item.label}
                  {item.key && <i className="fa-solid fa-angle-down"></i>}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`mega-menu-container ${activeMegaMenu ? "active" : ""}`}
            ref={megaMenuRef}
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            {activeMegaMenu &&
              menuData[activeMegaMenu as keyof typeof menuData] && (
                <div className="mega-menu">
                  <div className="mega-menu-content">
                    <h3 className="mega-menu-title">
                      {menuData[activeMegaMenu as keyof typeof menuData].title}
                    </h3>
                    <div className="mega-menu-columns">
                      {menuData[
                        activeMegaMenu as keyof typeof menuData
                      ].columns.map((column, colIndex) => (
                        <div key={colIndex} className="mega-menu-column">
                          <ul className="column-list">
                            {column.items.map((subItem, itemIndex) => {
                              const colors =
                                iconColorMap[
                                  (subItem as any).iconColor as IconColor
                                ] ?? iconColorMap.blue;
                              return (
                                <li key={itemIndex}>
                                  <Link
                                    href={subItem.href}
                                    className="column-link"
                                    onClick={closeMegaMenu}
                                  >
                                    <span
                                      className="menu-icon-circle"
                                      style={{
                                        backgroundColor: colors.bg,
                                        color: colors.color,
                                      }}
                                    >
                                      {(subItem as any).icon}
                                    </span>
                                    <span className="menu-link-text">
                                      <span className="menu-link-title">
                                        {subItem.name}
                                        {(subItem as any).isNew && (
                                          <span className="menu-new-chip">
                                            New
                                          </span>
                                        )}
                                      </span>
                                      <span className="menu-link-desc">
                                        {(subItem as any).desc}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
        )}

        <nav className={`mobile-menu ${menuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            <button className="close-btn" onClick={closeMenu}>
              ✕
            </button>
          </div>
          <ul className="mobile-menu-list">
            {mainMenuItems.map((item) => (
              <li key={item.key ?? item.label} className="mobile-menu-item">
                <Link
                  href={item.href ?? ""}
                  className="mobile-menu-link"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
                {item.key && (
                  <>
                    <span
                      className="mobile-dropdown-arrow"
                      onClick={() => {
                        const submenu = document.getElementById(
                          `mobile-submenu-${item.key}`,
                        );
                        if (submenu) submenu.classList.toggle("active");
                      }}
                    >
                      <i className="fa-solid fa-angle-down"></i>
                    </span>
                    <ul
                      id={`mobile-submenu-${item.key}`}
                      className="mobile-submenu"
                    >
                      {menuData[
                        item.key as keyof typeof menuData
                      ]?.columns.flatMap((column) =>
                        column.items.map((subItem, idx) => (
                          <li key={idx}>
                            <Link
                              href={subItem.href}
                              onClick={closeMenu}
                              className="mobile-submenu-link"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        )),
                      )}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
