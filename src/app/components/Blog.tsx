import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

const blogs = [
  {
    id: "1",
    title: "What Is VAT?",
    category: "Finance",
    image: "/blog1.webp",
    author: "Ashar Pervaiz",
    date: "25 March 2026",
    slug: "/blog/what-is-vat/",
  },
  {
    id: "2",
    title:
      "Medication Dose Calculation: Complete Guide to Dose Calculator & Safe Drug Dosing",
    category: "Health",
    image: "/blog2.webp",
    author: "Ashar Pervaiz",
    date: "3 April 2026",
    slug: "/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
  },
  {
    id: "3",
    title:
      "The Ultimate Guide to IV Infusion Calculations: Formulas, Drip Rates, and Dosages",
    category: "Health",
    image: "/blog3.webp",
    author: "Ashar Pervaiz",
    date: "13 April 2026",
    slug: "/blog/ultimate-iv-infusion-calculator-guide/",
  },
  {
    id: "4",
    title: "The Smart Renter’s Guide: What You Can Actually Afford",
    category: "Finance",
    image: "/blog4.webp",
    author: "Ashar Pervaiz",
    date: "1 May 2026",
    slug: "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
  },
  {
    id: "5",
    title: "How Do I Calculate My Net Worth?",
    category: "Finance",
    image: "/blog5.webp",
    author: "Ashar Pervaiz",
    date: "10 May 2026",
    slug: "/blog/how-do-i-calculate-my-net-worth/",
  },
  {
    id: "6",
    title: "Best Free Financial Calculators for Everyday Money Questions",
    category: "Finance",
    image: "/blog6.webp",
    author: "Ashar Pervaiz",
    date: "30 May 2026",
    slug: "/blog/best-free-financial-calculators-for-everyday-money-questions/",
  },
  {
    id: "7",
    title: "Can AI Replace Financial Calculators? Here's the Honest Truth",
    category: "Finance",
    image: "/blog7.webp",
    author: "Ashar Pervaiz",
    date: "7 June 2026",
    slug: "/blog/can-ai-replace-financial-calculators/",
  },
  {
    id: "8",
    title: "Renting vs. Buying a Home: How to Decide With Numbers (2026 Guide)",
    category: "Finance",
    image: "/blog8.webp",
    author: "Ashar Pervaiz",
    date: "14 June 2026",
    slug: "/blog/renting-vs-buying-a-home/",
  },
  {
    id: "9",
    title:
      "Healthy Body Fat Percentage by Age and Gender: The Complete Reference Guide",
    category: "Health",
    image: "/blog9.webp",
    author: "Ashar Pervaiz",
    date: "20 June 2026",
    slug: "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
  },
  {
    id: "10",
    title: "What Is Numbers on Your Tip?",
    category: "Daily Use",
    image: "/blog10.webp",
    author: "Ashar Pervaiz",
    date: "3 July 2026",
    slug: "/blog/what-is-numbers-on-your-tip/",
  },
  {
    id: "11",
    title:
      "Matrix Calculator: The Complete Guide to Every Matrix Operation (With Formulas and Examples)",
    category: "Maths",
    image: "/blog11.webp",
    author: "Ashar Pervaiz",
    date: "12 July 2026",
    slug: "/blog/matrix-calculator-guide/",
  },
  {
    id: "12",
    title:
      "2026 Tax Brackets: Complete Guide to Federal Income Tax Rates, Standard Deductions, and What Changed",
    category: "Finance",
    image: "/blog12.webp",
    author: "Ashar Pervaiz",
    date: "17 July 2026",
    slug: "/blog/2026-tax-brackets/",
  },
  {
    id: "13",
    title: "How Many Calories Should I Eat to Lose Weight?",
    category: "Health",
    image: "/blog13.webp",
    author: "Ashar Pervaiz",
    date: "26 July 2026",
    slug: "/blog/how-many-calories-to-lose-weight/",
  },
];

export default function BlogsPage() {
  return (
    <div className="page-blog">
      {/* HEADER SECTION */}
      <section className="header-blog">
        <h1>Our Blogs</h1>
        <p>
          Explore the latest articles, tutorials, and insights from our team to
          improve your development skills and stay updated with modern web
          trends.
        </p>
      </section>

      {/* BLOG GRID SECTION */}
      {/* BLOG GRID SECTION */}
      <section className="grid-blog">
        {[...blogs]
          .sort((a, b) => Number(b.id) - Number(a.id)) // descending, not ascending
          .map((blog, index) => (
            <div key={blog.id} className="wrapper-blog">
              <Link href={blog.slug} className="my-link">
                <div className="card-blog">
                  <span className="category">
                    <i className="custom-meta-icon fa-solid fa-layer-group"></i>
                    {blog.category}
                  </span>

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="image-blog-post"
                  />

                  <div className="content-blog">
                    <small
                      className="meta-blog"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "40px",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <img
                          className="founder-photo"
                          src="/founder_photo.webp"
                          alt=""
                        />
                        {blog.author}
                      </span>

                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <i className="custom-meta-icon fa-solid fa-calendar"></i>
                        {blog.date}
                      </span>
                    </small>
                  </div>
                </div>
              </Link>

              {/* Divider between cards */}
              {(index + 1) % 2 === 1 && index !== blogs.length - 1 && (
                <div className="divider-blog"></div>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
