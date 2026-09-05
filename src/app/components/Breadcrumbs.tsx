"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, trailFor } from "../data/breadcrumbs";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const trail = trailFor(pathname || "/");

  // Homepage and unmapped routes (404) get nothing.
  if (trail.length < 2) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: SITE + c.href,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href}>
                {last ? (
                  <span aria-current="page">{c.label}</span>
                ) : (
                  <>
                    <Link href={c.href}>
                      {i === 0 ? (
                        <>
                          <i
                            className="fa-solid fa-house"
                            aria-hidden="true"
                          ></i>{" "}
                          {c.label}
                        </>
                      ) : (
                        c.label
                      )}
                    </Link>
                    <span className="crumbs-sep" aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
