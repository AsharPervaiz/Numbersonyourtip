import { Metadata } from "next";
import Link from "next/link";
import { IconCircle, Icons } from "../components/MenuIcons";

export const metadata: Metadata = {
  title: "Construction & Landscaping Material Calculators",
  description:
    "Work out how much gravel or mulch a driveway, path or garden bed needs — in cubic yards, tons, bags or cubic metres, with the arithmetic shown.",
  alternates: {
    canonical: "/construction-calculators/",
  },
  openGraph: {
    title: "Construction & Landscaping Calculators | Numbers On Your Tip",
    description:
      "Material quantity calculators for driveways, paths and beds. Area and depth to volume, weight, bags and cost.",
    url: "/construction-calculators/",
  },
  twitter: {
    title: "Construction Calculators",
    description:
      "How much gravel or mulch you need, in the units your supplier actually sells in.",
  },
};

export default function ConstructionCals() {
  return (
    <>
      <div className="section-two">
        <div className="section-two-inner single-col">
          <section>
            <h1 className="more-tools">Construction Calculators</h1>
            <p
              style={{
                maxWidth: "640px",
                marginBottom: "28px",
                lineHeight: 1.7,
              }}
            >
              Material quantity tools for the jobs that start with a tape
              measure and end with an order. Both take an area and a depth and
              return the volume, then convert it into whatever unit your
              supplier actually trades in — cubic yards and tons for aggregate,
              bags for mulch, cubic metres for either. Each shows its working,
              so the number you take to the merchant is one you can defend.
            </p>

            <div
              className="icon-grid1"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
                marginBottom: "50px",
              }}
            >
              {[
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IconCircle color="amber">
                        <Icons.Gravel />
                      </IconCircle>{" "}
                      <h4>Gravel Calculator</h4>
                    </div>
                  ),
                  href: "/gravel-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Mulch />
                      </IconCircle>{" "}
                      <h4>Mulch Calculator</h4>
                    </div>
                  ),
                  href: "/mulch-calculator/",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="calc-card bullet"
                    style={{
                      textAlign: "start",
                      padding: "12px 18px",
                      border: "1px solid #e4e6ee",
                      color: "black",
                      background: "white",
                      borderRadius: "12px",
                      transition: "0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="card-title"
                      style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}
                    >
                      {item.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <h2>One Formula, Two Materials That Behave Differently</h2>
            <p>
              Both calculators run the same three steps. Area is length times
              width. Volume is area times depth, once the depth has been
              converted out of inches. Cubic yards are cubic feet divided by 27.
              Nothing about that changes between stone and bark.
            </p>
            <p>
              What changes is the judgement wrapped around it. With aggregate,
              the question is whether the layer is thick enough for the stones
              to lock together and carry weight, so the risk runs in one
              direction — too thin and the surface scatters. Mulch has a limit
              at both ends: too thin and weeds come through, too thick and the
              bed underneath is starved of water and air. Two identical sums,
              two different things to worry about.
            </p>

            <h2>Ordering by Volume, Buying by Weight or by Bag</h2>
            <p>
              Volume is what a project needs, but it is rarely what appears on
              an invoice. Aggregate is weighed on a weighbridge and quoted in
              tons, which means density sits between your calculation and your
              order. Mulch is light enough that weight barely features and is
              sold by the bag or the cubic yard instead.
            </p>
            <p>
              That is why the{" "}
              <Link href="/gravel-calculator/" className="my-link">
                gravel calculator
              </Link>{" "}
              treats density as an editable input and states the figure it used,
              while the{" "}
              <Link href="/mulch-calculator/" className="my-link">
                mulch calculator
              </Link>{" "}
              works in bags and tells you how many one cubic yard contains. Each
              reports in the unit its own trade quotes in, rather than forcing
              both into the same column.
            </p>

            <h2>Measure the Site Once, Order Twice</h2>
            <p>
              Most garden projects need both. A new path is stone down the
              middle and bark either side of it; a parking area often ends at a
              planted border. The efficient way to handle that is to walk the
              site once with a tape, write down every rectangle with a note of
              what is going in it, and sort the list afterwards.
            </p>
            <p>
              Keep the two lists separate rather than totalling a single area
              figure, because the depths differ and the materials are ordered
              from different suppliers in different units. Two tidy lists beat
              one combined number you then have to unpick at the merchant&apos;s
              counter.
            </p>
            <p>
              Where measurements arrive in a mix of metres and feet, the{" "}
              <Link href="/unit-conversion-calculator/" className="my-link">
                unit conversion calculator
              </Link>{" "}
              will square them up before you start, and the{" "}
              <Link href="/mixed-number-calculator/" className="my-link">
                mixed number calculator
              </Link>{" "}
              turns a depth read off a tape in eighths into the decimal these
              tools expect.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
