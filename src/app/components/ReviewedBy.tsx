import Link from "next/link";

/**
 * Reviewer section, placed at the end of calculator and guide pages.
 *
 * `medical` — use ONLY on health/clinical pages that Dr. Syeda Khadija Akbar
 * has actually reviewed. Every other page should use the default variant,
 * which states the formula review date without attributing it to her.
 */
export default function ReviewedBy({
  medical = false,
  date = "27 August 2026",
}: {
  medical?: boolean;
  date?: string;
}) {
  return (
    <section
      className="reviewer-section"
      style={{ margin: "48px 0 10px" }}
      aria-labelledby="reviewer-heading"
    >
      <h2 id="reviewer-heading" style={{ marginBottom: "14px" }}>
        {medical ? "Medically Reviewed" : "Reviewed and Verified"}
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          padding: "20px",
          background: "#f4f7fc",
          border: "1px solid #e2e9f4",
          borderLeft: "5px solid #1F9FB8",
          borderRadius: "12px",
        }}
      >
        <i
          className={`fa-solid ${medical ? "fa-user-doctor" : "fa-square-check"}`}
          style={{ fontSize: "24px", color: "#1F9FB8", marginTop: "3px" }}
          aria-hidden="true"
        />
        <div>
          {medical ? (
            <>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#1B3066",
                }}
              >
                Dr. Syeda Khadija Akbar
              </p>
              <p
                style={{
                  margin: "2px 0 10px",
                  color: "#1F9FB8",
                  fontSize: "14px",
                }}
              >
                PharmD (Doctor of Pharmacy) — Medical Reviewer
              </p>
              <p style={{ margin: "0 0 10px", fontSize: "14.5px" }}>
                The formulas, dosing logic, unit handling, and safety wording on
                this page were reviewed for clinical accuracy by Dr. Syeda
                Khadija Akbar, PharmD. This page is an educational reference
                only — always confirm any clinical calculation independently
                before acting on it.
              </p>
            </>
          ) : (
            <p style={{ margin: "0 0 10px", fontSize: "14.5px" }}>
              The formula used on this page was checked against published
              reference sources and tested against worked examples with known
              answers before publication.
            </p>
          )}
          <p style={{ margin: 0, fontSize: "13.5px", color: "#5a6577" }}>
            <i
              className="fa-solid fa-calendar-check"
              style={{ color: "#1F9FB8", marginRight: "6px" }}
              aria-hidden="true"
            />
            Last reviewed: <strong>{date}</strong> ·{" "}
            <Link
              href={medical ? "/about-us/#medical-reviewer" : "/about-us/#review-process"}
              className="my-link"
            >
              {medical
                ? "About our medical reviewer"
                : "How we verify our calculators"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
