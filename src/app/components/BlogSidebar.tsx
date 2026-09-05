import Link from "next/link";

type LinkItem = [href: string, label: string];

export default function BlogSidebar({
  relatedTools,
  relatedPosts,
}: {
  relatedTools?: LinkItem[];
  relatedPosts?: LinkItem[];
}) {
  return (
    <aside className="blog-sidebar">
      {relatedTools && relatedTools.length > 0 && (
        <>
          <p>Related Calculators</p>
          <ul>
            {relatedTools.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i
                      className="fa-solid fa-angle-right"
                      style={{ color: "#D8A13A" }}
                    ></i>
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {relatedPosts && relatedPosts.length > 0 && (
        <>
          <p style={{ marginTop: relatedTools?.length ? "24px" : 0 }}>
            Related Reading
          </p>
          <ul>
            {relatedPosts.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i
                      className="fa-solid fa-angle-right"
                      style={{ color: "#D8A13A" }}
                    ></i>
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
