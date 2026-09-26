/* The formula library.
 *
 * Kept outside the component so that the route's metadata and the footer can
 * read the counts without importing a "use client" module, the same reason
 * the blog data lives in posts.ts.
 *
 * Every entry carries a worked example with real numbers rather than a
 * restatement of the symbols. A formula nobody has put numbers through is
 * a picture, not a tool. */

export type Category =
  | "Algebra"
  | "Geometry"
  | "Trigonometry"
  | "Statistics"
  | "Finance"
  | "Measurement";

export type Formula = {
  id: string;
  name: string;
  category: Category;
  expression: string;
  /** What each symbol stands for. */
  variables: string;
  /** When this is the right formula to reach for — and when it is not. */
  use: string;
  /** Worked through with numbers, arithmetic shown. */
  example: string;
  /** Alternative names and spellings people actually search for. */
  keywords: string[];
  /** A calculator on this site that does the same job. */
  tool?: [string, string];
};

export const CATEGORIES: Category[] = [
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Statistics",
  "Finance",
  "Measurement",
];

const RAW: Formula[] = [
  /* ── Algebra ────────────────────────────────────────────────────────── */
  {
    id: "quadratic",
    name: "Quadratic Formula",
    category: "Algebra",
    expression: "x = (−b ± √(b² − 4ac)) / 2a",
    variables: "a, b and c are the coefficients of ax² + bx + c = 0.",
    use: "Solves any quadratic, including the ones that do not factorise. Rearrange to the form ax² + bx + c = 0 first, or the signs will be wrong.",
    example:
      "For 2x² + 5x − 3 = 0: b² − 4ac = 25 + 24 = 49, √49 = 7, so x = (−5 ± 7) / 4, giving x = 0.5 and x = −3.",
    keywords: ["quadratic", "roots", "solve equation", "abc formula"],
  },
  {
    id: "discriminant",
    name: "Discriminant",
    category: "Algebra",
    expression: "Δ = b² − 4ac",
    variables: "The part of the quadratic formula under the square root.",
    use: "Tells you how many real solutions a quadratic has before you solve it. Positive gives two, zero gives one, negative gives none.",
    example:
      "For x² + 2x + 5: Δ = 4 − 20 = −16. Negative, so the curve never crosses the x-axis and there are no real roots.",
    keywords: ["discriminant", "delta", "number of roots", "nature of roots"],
  },
  {
    id: "difference-squares",
    name: "Difference of Two Squares",
    category: "Algebra",
    expression: "a² − b² = (a + b)(a − b)",
    variables: "a and b are any two terms.",
    use: "Factorises instantly whenever you recognise two perfect squares with a minus between them. Also a quick mental multiplication trick.",
    example: "97 × 103 is (100 − 3)(100 + 3) = 100² − 3² = 10,000 − 9 = 9,991.",
    keywords: ["difference of squares", "factorise", "factoring", "dots"],
  },
  {
    id: "binomial-square",
    name: "Square of a Binomial",
    category: "Algebra",
    expression: "(a + b)² = a² + 2ab + b²",
    variables: "a and b are the two terms being squared together.",
    use: "Expands a bracket squared. The middle term is the one people drop — (a + b)² is never a² + b².",
    example: "(x + 4)² = x² + 8x + 16, since 2ab = 2 × x × 4 = 8x.",
    keywords: ["binomial", "expand brackets", "perfect square", "foil"],
  },
  {
    id: "slope",
    name: "Gradient of a Line",
    category: "Algebra",
    expression: "m = (y₂ − y₁) / (x₂ − x₁)",
    variables: "(x₁, y₁) and (x₂, y₂) are any two points on the line.",
    use: "Measures steepness. Take the points in the same order top and bottom, or the sign flips.",
    example:
      "Between (2, 3) and (6, 11): m = (11 − 3) / (6 − 2) = 8 / 4 = 2. The line rises two units for every one across.",
    keywords: ["gradient", "slope", "rise over run", "steepness"],
  },
  {
    id: "line-equation",
    name: "Equation of a Straight Line",
    category: "Algebra",
    expression: "y = mx + c",
    variables: "m is the gradient, c is where the line crosses the y-axis.",
    use: "Describes any straight line except a vertical one. Written y = mx + b in American textbooks — same formula.",
    example:
      "A line of gradient 2 through (0, −5) is y = 2x − 5. At x = 4 that gives y = 3.",
    keywords: ["straight line", "linear equation", "y intercept", "y=mx+b"],
  },
  {
    id: "distance",
    name: "Distance Between Two Points",
    category: "Algebra",
    expression: "d = √((x₂ − x₁)² + (y₂ − y₁)²)",
    variables: "The two points are (x₁, y₁) and (x₂, y₂).",
    use: "Pythagoras applied to coordinates. Squaring removes the sign, so the order of the points does not matter here.",
    example: "From (1, 2) to (4, 6): d = √(3² + 4²) = √25 = 5.",
    keywords: ["distance formula", "between two points", "coordinates"],
  },
  {
    id: "exponents",
    name: "Laws of Indices",
    category: "Algebra",
    expression: "aᵐ × aⁿ = aᵐ⁺ⁿ   and   aᵐ ÷ aⁿ = aᵐ⁻ⁿ",
    variables: "a is the base, m and n the powers.",
    use: "Only applies when the bases match. You cannot combine 2³ × 3³ this way, though you can write it as 6³.",
    example: "2⁵ × 2³ = 2⁸ = 256. And 2⁵ ÷ 2³ = 2² = 4.",
    keywords: ["indices", "exponents", "powers", "index laws"],
  },
  {
    id: "log-product",
    name: "Logarithm Rules",
    category: "Algebra",
    expression: "log(xy) = log x + log y   and   log(xⁿ) = n log x",
    variables: "x and y are positive; the base must be the same throughout.",
    use: "Turns multiplication into addition, which is why logs are how you solve for an exponent.",
    example:
      "To solve 3ˣ = 81: take logs to get x log 3 = log 81, so x = log 81 / log 3 = 4.",
    keywords: ["logarithm", "log rules", "ln", "solve for exponent"],
  },
  {
    id: "arithmetic-sequence",
    name: "Arithmetic Sequence, nth Term",
    category: "Algebra",
    expression: "aₙ = a₁ + (n − 1)d",
    variables: "a₁ is the first term, d the common difference, n the position.",
    use: "For sequences that go up by a fixed amount each time. The (n − 1) catches people out — the first term has had no steps added yet.",
    example:
      "For 5, 8, 11, 14…: a₁ = 5 and d = 3, so the 20th term is 5 + 19 × 3 = 62.",
    keywords: ["arithmetic sequence", "nth term", "common difference"],
  },
  {
    id: "geometric-sum",
    name: "Sum of a Geometric Series",
    category: "Algebra",
    expression: "Sₙ = a(1 − rⁿ) / (1 − r)",
    variables:
      "a is the first term, r the common ratio, n the number of terms.",
    use: "For sequences that multiply by a fixed factor. Where compound interest and repayment schedules come from.",
    example:
      "Sum of 2 + 6 + 18 + 54: a = 2, r = 3, n = 4, so S = 2(1 − 81) / (1 − 3) = 2 × (−80) / (−2) = 80.",
    keywords: ["geometric series", "sum of series", "common ratio"],
  },

  /* ── Geometry ───────────────────────────────────────────────────────── */
  {
    id: "area-rectangle",
    name: "Area of a Rectangle",
    category: "Geometry",
    expression: "A = l × w",
    variables: "l is length, w is width, both in the same unit.",
    use: "The starting point for almost every material calculation. Mixing feet and inches here is the most common source of a wrong order.",
    example: "A patio 6.4 m by 3.5 m has an area of 22.4 m².",
    keywords: ["area", "rectangle", "square footage", "length times width"],
    tool: ["/gravel-calculator/", "Gravel Calculator"],
  },
  {
    id: "area-triangle",
    name: "Area of a Triangle",
    category: "Geometry",
    expression: "A = ½ × b × h",
    variables:
      "b is the base, h the perpendicular height — not the slanted side.",
    use: "Works for any triangle as long as the height is measured at right angles to the base you chose.",
    example:
      "Base 12 cm, perpendicular height 5 cm: A = 0.5 × 12 × 5 = 30 cm².",
    keywords: ["area of triangle", "half base times height"],
  },
  {
    id: "area-circle",
    name: "Area of a Circle",
    category: "Geometry",
    expression: "A = πr²",
    variables: "r is the radius — half the width, not the width.",
    use: "Using the diameter instead of the radius is the classic error and makes the answer four times too big.",
    example:
      "A circle of diameter 3 m has radius 1.5 m, so A = π × 2.25 = 7.07 m².",
    keywords: ["area of circle", "pi r squared", "circle area"],
  },
  {
    id: "circumference",
    name: "Circumference of a Circle",
    category: "Geometry",
    expression: "C = 2πr = πd",
    variables: "r is the radius, d the diameter.",
    use: "The distance around the edge. Both versions are the same formula, so use whichever measurement you actually have.",
    example:
      "A wheel of diameter 0.7 m travels π × 0.7 = 2.20 m per revolution.",
    keywords: ["circumference", "perimeter of circle", "pi d"],
  },
  {
    id: "pythagoras",
    name: "Pythagorean Theorem",
    category: "Geometry",
    expression: "a² + b² = c²",
    variables: "c is the hypotenuse, the side opposite the right angle.",
    use: "Right-angled triangles only. Also how builders check a corner is square without a set square.",
    example:
      "Legs of 3 m and 4 m give c = √(9 + 16) = 5 m. Measure 3 along one wall, 4 along the other, and if the diagonal is 5 the corner is true.",
    keywords: ["pythagoras", "pythagorean theorem", "hypotenuse", "3 4 5"],
  },
  {
    id: "area-trapezium",
    name: "Area of a Trapezium",
    category: "Geometry",
    expression: "A = ½(a + b) × h",
    variables:
      "a and b are the two parallel sides, h the distance between them.",
    use: "Average the parallel sides, then treat it as a rectangle. Called a trapezoid in American usage.",
    example: "Parallel sides 8 m and 5 m, 4 m apart: A = 0.5 × 13 × 4 = 26 m².",
    keywords: ["trapezium", "trapezoid", "area"],
  },
  {
    id: "heron",
    name: "Heron's Formula",
    category: "Geometry",
    expression: "A = √(s(s − a)(s − b)(s − c)),  s = (a + b + c) / 2",
    variables: "a, b and c are the three sides; s is the semi-perimeter.",
    use: "Gives the area of any triangle from the three sides alone, when no height has been measured.",
    example: "Sides 5, 6 and 7: s = 9, so A = √(9 × 4 × 3 × 2) = √216 = 14.70.",
    keywords: ["herons formula", "area from three sides", "semi-perimeter"],
  },
  {
    id: "volume-cuboid",
    name: "Volume of a Cuboid",
    category: "Geometry",
    expression: "V = l × w × h",
    variables: "Length, width and depth, all in the same unit.",
    use: "Any rectangular box or layer of material. For a layer, the depth is usually the one quoted in different units from the other two.",
    example:
      "A bed 6 m by 2 m covered 0.1 m deep holds 6 × 2 × 0.1 = 1.2 m³ of mulch.",
    keywords: ["volume", "cuboid", "box", "cubic"],
    tool: ["/mulch-calculator/", "Mulch Calculator"],
  },
  {
    id: "volume-cylinder",
    name: "Volume of a Cylinder",
    category: "Geometry",
    expression: "V = πr²h",
    variables: "r is the radius of the circular face, h the height.",
    use: "The area of the circle, extended along its length. Works for pipes, tanks and post holes.",
    example:
      "A tank 0.5 m across and 1.2 m tall: V = π × 0.25² × 1.2 = 0.236 m³, or about 236 litres.",
    keywords: ["volume of cylinder", "tank volume", "pipe"],
  },
  {
    id: "volume-sphere",
    name: "Volume of a Sphere",
    category: "Geometry",
    expression: "V = (4/3)πr³",
    variables: "r is the radius.",
    use: "The cube on the radius is why a small increase in size makes such a large difference to volume.",
    example:
      "Doubling a ball's radius from 5 cm to 10 cm multiplies its volume by 2³ = 8, not by 2.",
    keywords: ["volume of sphere", "ball", "four thirds pi r cubed"],
  },
  {
    id: "volume-cone",
    name: "Volume of a Cone",
    category: "Geometry",
    expression: "V = (1/3)πr²h",
    variables: "r is the base radius, h the vertical height.",
    use: "Exactly one third of the cylinder that would enclose it — a useful check on any answer.",
    example:
      "A conical heap 2 m across and 1.5 m high: V = (1/3) × π × 1 × 1.5 = 1.57 m³.",
    keywords: ["volume of cone", "heap", "pile"],
  },
  {
    id: "surface-sphere",
    name: "Surface Area of a Sphere",
    category: "Geometry",
    expression: "A = 4πr²",
    variables: "r is the radius.",
    use: "Exactly four times the area of the circle you would see looking at it — which is not obvious, and worth remembering.",
    example: "A sphere of radius 0.3 m has surface area 4π × 0.09 = 1.13 m².",
    keywords: ["surface area", "sphere"],
  },

  /* ── Trigonometry ───────────────────────────────────────────────────── */
  {
    id: "sohcahtoa",
    name: "SOH CAH TOA",
    category: "Trigonometry",
    expression: "sin θ = opp/hyp,  cos θ = adj/hyp,  tan θ = opp/adj",
    variables:
      "Opposite, adjacent and hypotenuse are named relative to the angle θ you are working with.",
    use: "Right-angled triangles only. Which side counts as opposite changes when you switch angles, which is where mistakes creep in.",
    example:
      "A ladder 4 m long at 70° to the ground reaches 4 × sin 70° = 3.76 m up the wall.",
    keywords: ["sohcahtoa", "sin cos tan", "right triangle", "trig ratios"],
  },
  {
    id: "sine-rule",
    name: "Sine Rule",
    category: "Trigonometry",
    expression: "a / sin A = b / sin B = c / sin C",
    variables: "Each side is paired with the angle directly opposite it.",
    use: "For triangles with no right angle, when you know two angles and a side, or two sides and a non-included angle.",
    example:
      "With A = 30°, a = 5 and B = 60°: b = 5 × sin 60° / sin 30° = 5 × 0.866 / 0.5 = 8.66.",
    keywords: ["sine rule", "law of sines", "non right triangle"],
  },
  {
    id: "cosine-rule",
    name: "Cosine Rule",
    category: "Trigonometry",
    expression: "c² = a² + b² − 2ab cos C",
    variables: "C is the angle between sides a and b.",
    use: "When you know two sides and the angle between them, or all three sides. Pythagoras is this formula with C = 90°, where cos C = 0.",
    example:
      "Sides 7 and 9 with 40° between: c² = 49 + 81 − 2 × 63 × 0.766 = 33.5, so c = 5.79.",
    keywords: ["cosine rule", "law of cosines", "included angle"],
  },
  {
    id: "pythagorean-identity",
    name: "Pythagorean Identity",
    category: "Trigonometry",
    expression: "sin²θ + cos²θ = 1",
    variables: "True for every angle θ.",
    use: "Converts between sine and cosine when only one is known. Pythagoras on a circle of radius 1.",
    example:
      "If sin θ = 0.6 then cos²θ = 1 − 0.36 = 0.64, so cos θ = 0.8 for an angle in the first quadrant.",
    keywords: ["trig identity", "sin squared plus cos squared"],
  },
  {
    id: "tan-identity",
    name: "Tangent as a Ratio",
    category: "Trigonometry",
    expression: "tan θ = sin θ / cos θ",
    variables: "Undefined wherever cos θ = 0, which is at 90° and 270°.",
    use: "Explains why tan has no value at a right angle: the formula divides by zero there.",
    example: "At 45°, sin and cos are both 0.7071, so tan 45° = 1 exactly.",
    keywords: ["tan", "tangent", "sin over cos"],
  },
  {
    id: "triangle-two-sides",
    name: "Area From Two Sides and an Angle",
    category: "Trigonometry",
    expression: "A = ½ab sin C",
    variables: "a and b are two sides, C the angle between them.",
    use: "Gives the area without needing a perpendicular height, which is rarely the thing you can measure on site.",
    example:
      "Sides 8 m and 5 m with 30° between: A = 0.5 × 8 × 5 × 0.5 = 10 m².",
    keywords: ["area of triangle", "two sides and angle", "sine area"],
  },
  {
    id: "radians",
    name: "Degrees and Radians",
    category: "Trigonometry",
    expression: "radians = degrees × π / 180",
    variables: "A full turn is 360° or 2π radians.",
    use: "Spreadsheets and programming languages expect radians. A trig answer that looks wildly wrong is usually a calculator in the other mode.",
    example: "60° = 60 × π / 180 = π/3 ≈ 1.047 radians.",
    keywords: ["radians", "degrees", "conversion", "rad"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },

  /* ── Statistics ─────────────────────────────────────────────────────── */
  {
    id: "mean",
    name: "Mean (Average)",
    category: "Statistics",
    expression: "x̄ = Σx / n",
    variables: "Σx is the total of all values, n how many there are.",
    use: "The everyday average. One extreme value drags it a long way, which is why income is usually reported as a median.",
    example: "For 4, 8, 9, 11: total 32 ÷ 4 = 8.",
    keywords: ["mean", "average", "arithmetic mean"],
    tool: ["/mean-median-mode-calculator/", "Mean, Median and Mode Calculator"],
  },
  {
    id: "median",
    name: "Median",
    category: "Statistics",
    expression: "position = (n + 1) / 2, after sorting",
    variables: "n is how many values there are.",
    use: "The middle value once sorted. With an even count the position lands between two, and you average them.",
    example:
      "For 3, 7, 9, 15: (4 + 1) / 2 = 2.5, so average the 2nd and 3rd values — (7 + 9) / 2 = 8.",
    keywords: ["median", "middle value", "sorted"],
    tool: ["/mean-median-mode-calculator/", "Mean, Median and Mode Calculator"],
  },
  {
    id: "range",
    name: "Range",
    category: "Statistics",
    expression: "range = maximum − minimum",
    variables: "The two extreme values in the set.",
    use: "The crudest measure of spread, and easily distorted, since it depends on exactly two numbers however large the set.",
    example: "For 12, 15, 19, 40: range = 40 − 12 = 28.",
    keywords: ["range", "spread", "max minus min"],
  },
  {
    id: "variance",
    name: "Variance",
    category: "Statistics",
    expression: "σ² = Σ(x − μ)² / N",
    variables:
      "μ is the mean and N the count. For a sample rather than a whole population, divide by n − 1.",
    use: "Averages the squared distances from the mean. Squaring stops positive and negative gaps cancelling out.",
    example:
      "For 2, 4, 6 the mean is 4, the squared gaps are 4, 0 and 4, so σ² = 8 / 3 = 2.67.",
    keywords: ["variance", "sigma squared", "spread"],
  },
  {
    id: "standard-deviation",
    name: "Standard Deviation",
    category: "Statistics",
    expression: "σ = √variance",
    variables: "The square root of the variance.",
    use: "Returns the spread to the original units, which variance cannot report because it is in units squared.",
    example: "Variance of 2.67 gives σ = 1.63, in the same units as the data.",
    keywords: ["standard deviation", "sd", "sigma"],
    tool: ["/mean-median-mode-calculator/", "Mean, Median and Mode Calculator"],
  },
  {
    id: "z-score",
    name: "Z-Score",
    category: "Statistics",
    expression: "z = (x − μ) / σ",
    variables: "x is the value, μ the mean, σ the standard deviation.",
    use: "Expresses a value as a number of standard deviations from the mean, so results on different scales can be compared.",
    example:
      "A score of 78 where the mean is 65 and σ is 10 gives z = 1.3 — one and a bit deviations above average.",
    keywords: ["z score", "standard score", "standardise"],
  },
  {
    id: "probability",
    name: "Basic Probability",
    category: "Statistics",
    expression: "P(A) = favourable outcomes / total outcomes",
    variables: "All outcomes must be equally likely for this to hold.",
    use: "The definition, and only valid when the outcomes really are equally likely — which a shuffled deck satisfies and a football match does not.",
    example:
      "Drawing a heart from a full deck: 13 / 52 = 0.25, a one in four chance.",
    keywords: ["probability", "chance", "odds"],
  },
  {
    id: "combinations",
    name: "Combinations",
    category: "Statistics",
    expression: "C(n, r) = n! / (r!(n − r)!)",
    variables: "n items, choosing r of them, order not mattering.",
    use: "Counts selections where order is irrelevant — a lottery ticket, a committee, a hand of cards.",
    example: "Choosing 3 from 5: 120 / (6 × 2) = 10 possible groups.",
    keywords: ["combinations", "ncr", "choose", "binomial coefficient"],
  },
  {
    id: "permutations",
    name: "Permutations",
    category: "Statistics",
    expression: "P(n, r) = n! / (n − r)!",
    variables: "n items, arranging r of them, order mattering.",
    use: "Use when the sequence counts — a podium, a PIN, a running order. Always larger than the equivalent combination.",
    example:
      "Arranging 3 of 5: 120 / 2 = 60, six times as many as the 10 combinations, because each group of 3 can be ordered 3! = 6 ways.",
    keywords: ["permutations", "npr", "arrangements", "order matters"],
  },
  {
    id: "percentage-change",
    name: "Percentage Change",
    category: "Statistics",
    expression: "change = (new − old) / old × 100",
    variables: "Always divide by the original value, not the new one.",
    use: "A rise then an equal-looking fall does not return you to the start, because the base changes between the two.",
    example:
      "£80 rising to £100 is a 25% rise. £100 falling to £80 is a 20% fall. Same two numbers, different percentages.",
    keywords: ["percentage change", "percent increase", "percent decrease"],
    tool: ["/percentage-calculator/", "Percentage Calculator"],
  },

  /* ── Finance ────────────────────────────────────────────────────────── */
  {
    id: "simple-interest",
    name: "Simple Interest",
    category: "Finance",
    expression: "I = P × r × t",
    variables:
      "P is the principal, r the rate as a decimal, t the time in years.",
    use: "Interest on the original sum only. Rare in practice, but the baseline that shows what compounding adds.",
    example: "£2,000 at 4% for 3 years: I = 2000 × 0.04 × 3 = £240.",
    keywords: ["simple interest", "prt", "flat interest"],
  },
  {
    id: "compound-interest",
    name: "Compound Interest",
    category: "Finance",
    expression: "A = P(1 + r/n)^(nt)",
    variables:
      "P principal, r annual rate as a decimal, n compounding periods per year, t years. A is the final amount, not the interest.",
    use: "Subtract P from A to get the interest alone. More frequent compounding raises the total, but by less than most people expect.",
    example:
      "£2,000 at 4% compounded monthly for 3 years: A = 2000 × (1 + 0.04/12)^36 = £2,254.54, so £254.54 of interest against £240 simple.",
    keywords: ["compound interest", "apy", "growth", "interest formula"],
    tool: ["/loan-calculator/", "Loan Calculator"],
  },
  {
    id: "emi",
    name: "Loan Repayment (EMI)",
    category: "Finance",
    expression: "EMI = P × i × (1 + i)ⁿ / ((1 + i)ⁿ − 1)",
    variables:
      "P is the amount borrowed, i the monthly rate (annual ÷ 12, as a decimal), n the number of monthly payments.",
    use: "The fixed monthly payment that clears a loan exactly. Using the annual rate for i is the mistake that makes the answer nonsense.",
    example:
      "£10,000 over 5 years at 6%: i = 0.005 and n = 60, giving EMI = £193.33 a month, £11,599.80 in total.",
    keywords: ["emi", "loan payment", "monthly repayment", "amortisation"],
    tool: ["/emi-calculator/", "EMI Calculator"],
  },
  {
    id: "percentage-of",
    name: "Percentage of an Amount",
    category: "Finance",
    expression: "part = whole × percentage / 100",
    variables: "The percentage as a plain number, not already divided.",
    use: "The most-used calculation of all. Reversible: if you know the part and the whole, percentage = part / whole × 100.",
    example: "15% of £240 = 240 × 15 / 100 = £36.",
    keywords: ["percentage of", "percent", "work out percentage"],
    tool: ["/percentage-calculator/", "Percentage Calculator"],
  },
  {
    id: "vat-add",
    name: "Adding VAT",
    category: "Finance",
    expression: "gross = net × (1 + rate)",
    variables: "rate is the VAT rate as a decimal — 0.2 for 20%.",
    use: "Goes from a price excluding tax to the price a customer pays.",
    example:
      "£250 net at 20% VAT: 250 × 1.2 = £300 gross, of which £50 is VAT.",
    keywords: ["add vat", "vat", "plus tax", "gross from net"],
    tool: ["/vat-calculator/", "VAT Calculator"],
  },
  {
    id: "vat-remove",
    name: "Removing VAT",
    category: "Finance",
    expression: "net = gross / (1 + rate)",
    variables: "rate as a decimal, the same as when adding.",
    use: "Going backwards is division, not subtraction. Taking 20% off a gross price gives the wrong answer.",
    example:
      "£300 gross at 20%: 300 / 1.2 = £250 net. Subtracting 20% would have given £240, which is £10 out.",
    keywords: ["remove vat", "vat backwards", "net from gross", "reverse vat"],
    tool: ["/vat-calculator/", "VAT Calculator"],
  },
  {
    id: "cagr",
    name: "Compound Annual Growth Rate",
    category: "Finance",
    expression: "CAGR = (end / start)^(1/n) − 1",
    variables: "n is the number of years between the two figures.",
    use: "The steady annual rate that would have produced the same result. Smooths over what actually happened in between.",
    example:
      "£5,000 growing to £8,000 over 4 years: (1.6)^0.25 − 1 = 0.1247, so 12.5% a year.",
    keywords: ["cagr", "annual growth", "average growth rate"],
  },
  {
    id: "rule-72",
    name: "Rule of 72",
    category: "Finance",
    expression: "years to double ≈ 72 / annual percentage rate",
    variables: "The rate as a whole number, so 6 rather than 0.06.",
    use: "A mental approximation, accurate to within a few months for rates between about 4% and 12%.",
    example:
      "At 6%, money doubles in roughly 72 / 6 = 12 years. The exact answer is 11.9, which is close enough to do in your head.",
    keywords: ["rule of 72", "doubling time", "mental maths"],
  },

  /* ── Measurement ────────────────────────────────────────────────────── */
  {
    id: "c-to-f",
    name: "Celsius to Fahrenheit",
    category: "Measurement",
    expression: "°F = °C × 9/5 + 32",
    variables: "The 32 is an offset, not a scaling factor.",
    use: "Temperature is the one conversion where you cannot just multiply, because the two scales do not share a zero.",
    example: "20°C = 20 × 1.8 + 32 = 68°F.",
    keywords: ["celsius to fahrenheit", "temperature", "c to f"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },
  {
    id: "f-to-c",
    name: "Fahrenheit to Celsius",
    category: "Measurement",
    expression: "°C = (°F − 32) × 5/9",
    variables: "Subtract the offset first, then scale.",
    use: "Doing the two steps in the wrong order is the usual error, and it gets worse the further you are from freezing.",
    example: "95°F = (95 − 32) × 5/9 = 35°C.",
    keywords: ["fahrenheit to celsius", "f to c", "temperature"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },
  {
    id: "speed",
    name: "Speed, Distance and Time",
    category: "Measurement",
    expression: "speed = distance / time",
    variables: "Units must match — miles and hours, or metres and seconds.",
    use: "Rearranges to distance = speed × time and time = distance / speed. Mixing minutes into an hourly speed is the usual slip.",
    example:
      "150 miles in 2 hours 30 minutes is 150 / 2.5 = 60 mph. Using 2.30 instead of 2.5 would give 65.2, which is wrong.",
    keywords: ["speed", "distance", "time", "velocity", "mph"],
    tool: ["/time-calculator/", "Time Calculator"],
  },
  {
    id: "density",
    name: "Density",
    category: "Measurement",
    expression: "density = mass / volume",
    variables: "Rearranges to mass = density × volume.",
    use: "Converts a volume you calculated into the weight a supplier will actually quote, which is how aggregate is sold.",
    example: "2.5 m³ of gravel at 1,600 kg/m³ weighs 4,000 kg — four tonnes.",
    keywords: ["density", "mass", "weight from volume", "tonnes"],
    tool: ["/gravel-calculator/", "Gravel Calculator"],
  },
  {
    id: "cubic-yards",
    name: "Cubic Feet to Cubic Yards",
    category: "Measurement",
    expression: "cubic yards = cubic feet / 27",
    variables: "A yard is 3 feet, and 3³ = 27.",
    use: "Dividing by 3 instead of 27 is the error that turns a small order into a very large one.",
    example: "540 cubic feet of topsoil is 540 / 27 = 20 cubic yards.",
    keywords: ["cubic yards", "cubic feet", "yd3", "conversion"],
    tool: ["/gravel-calculator/", "Gravel Calculator"],
  },
  {
    id: "fraction-decimal",
    name: "Mixed Number to Decimal",
    category: "Measurement",
    expression: "a b/c = a + (b ÷ c)",
    variables: "a is the whole part, b/c the fraction.",
    use: "Tape measures read in fractions while calculators want decimals, so this sits between measuring and ordering.",
    example: "3 5/8 inches = 3 + 0.625 = 3.625 inches.",
    keywords: ["mixed number", "fraction to decimal", "tape measure"],
    tool: ["/mixed-number-calculator/", "Mixed Number Calculator"],
  },
  /* ── Added in the second pass ───────────────────────────────────────── */
  {
    id: "midpoint",
    name: "Midpoint of a Line",
    category: "Algebra",
    expression: "M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)",
    variables: "The two endpoints are (x₁, y₁) and (x₂, y₂).",
    use: "Average the x values and the y values separately. The answer is a point, so it has two coordinates rather than one number.",
    example: "Between (2, 3) and (8, 7): M = (5, 5).",
    keywords: ["midpoint", "middle of a line", "coordinates"],
  },
  {
    id: "arithmetic-sum",
    name: "Sum of an Arithmetic Series",
    category: "Algebra",
    expression: "Sₙ = n/2 × (a₁ + aₙ)",
    variables: "n terms, running from a₁ up to aₙ.",
    use: "Pairs the first term with the last, the second with the second from last, and so on — every pair has the same total.",
    example: "Adding 1 to 100: S = 50 × 101 = 5,050.",
    keywords: ["sum of series", "arithmetic series", "1 to 100"],
  },
  {
    id: "factorial",
    name: "Factorial",
    category: "Algebra",
    expression: "n! = n × (n − 1) × … × 2 × 1",
    variables: "Defined for whole numbers, with 0! equal to 1 by convention.",
    use: "Counts the ways n things can be put in order. It grows faster than almost anything else in ordinary maths.",
    example:
      "5! = 120, while 10! = 3,628,800 — doubling n multiplied the answer by thirty thousand.",
    keywords: ["factorial", "arrangements", "orderings"],
  },
  {
    id: "perimeter-rectangle",
    name: "Perimeter of a Rectangle",
    category: "Geometry",
    expression: "P = 2(l + w)",
    variables: "l is length and w is width.",
    use: "The distance around the edge, for fencing, skirting or edging. It is not the area, and the two are easy to order by mistake.",
    example: "A patio 6.4 m by 3.5 m needs 2 × 9.9 = 19.8 m of edging.",
    keywords: ["perimeter", "rectangle", "fencing", "edging"],
  },
  {
    id: "area-parallelogram",
    name: "Area of a Parallelogram",
    category: "Geometry",
    expression: "A = b × h",
    variables:
      "b is the base and h the perpendicular height between the parallel sides.",
    use: "The same as a rectangle, because sliding the top across changes no area. The slanted side is not the height.",
    example: "Base 7 m with a perpendicular height of 4 m: A = 28 m².",
    keywords: ["parallelogram", "area", "base times height"],
  },
  {
    id: "polygon-angles",
    name: "Interior Angles of a Polygon",
    category: "Geometry",
    expression: "sum = (n − 2) × 180°",
    variables: "n is the number of sides.",
    use: "Any polygon divides into n − 2 triangles and each holds 180°. Divide the total by n for one angle of a regular shape.",
    example:
      "A hexagon gives (6 − 2) × 180 = 720°, so each angle of a regular hexagon is 120°.",
    keywords: ["interior angles", "polygon", "hexagon", "angle sum"],
  },
  {
    id: "sector-area",
    name: "Area of a Sector",
    category: "Geometry",
    expression: "A = (θ / 360) × πr²",
    variables: "θ is the angle at the centre, measured in degrees.",
    use: "A slice of a circle. The fraction θ/360 is simply how much of the whole circle the slice covers.",
    example: "A quarter circle of radius 4: (90/360) × π × 16 = 12.57.",
    keywords: ["sector", "slice of a circle", "pie slice"],
  },
  {
    id: "arc-length",
    name: "Arc Length",
    category: "Geometry",
    expression: "L = (θ / 360) × 2πr",
    variables: "θ in degrees, r the radius.",
    use: "The curved edge of a sector — the same fraction as its area, applied to the circumference instead.",
    example: "A quarter of a circle of radius 4: 0.25 × 2π × 4 = 6.28.",
    keywords: ["arc length", "curved edge", "sector"],
  },
  {
    id: "cylinder-surface",
    name: "Surface Area of a Cylinder",
    category: "Geometry",
    expression: "A = 2πr² + 2πrh",
    variables:
      "Two circular ends, plus the curved side unrolled into a rectangle.",
    use: "For painting, wrapping or lagging. Drop the first term for each end that is open.",
    example: "With r = 0.5 m and h = 1.2 m: 1.571 + 3.770 = 5.34 m².",
    keywords: ["surface area", "cylinder", "lagging", "tank"],
  },
  {
    id: "pyramid-volume",
    name: "Volume of a Pyramid",
    category: "Geometry",
    expression: "V = (1/3) × base area × h",
    variables: "h is the vertical height from the base to the apex.",
    use: "One third of the prism with the same base and height, exactly as a cone is one third of its cylinder.",
    example: "A square base 4 m by 4 m, 9 m tall: (1/3) × 16 × 9 = 48 m³.",
    keywords: ["pyramid", "volume", "apex"],
  },
  {
    id: "angle-sum-triangle",
    name: "Angle Sum of a Triangle",
    category: "Trigonometry",
    expression: "A + B + C = 180°",
    variables: "The three interior angles of any flat triangle.",
    use: "Finds the third angle from two known ones, which is often the step that makes the sine rule usable.",
    example: "Given angles of 40° and 75°, the third is 180 − 115 = 65°.",
    keywords: ["angle sum", "triangle", "180 degrees"],
  },
  {
    id: "double-angle",
    name: "Double Angle Formulae",
    category: "Trigonometry",
    expression: "sin 2θ = 2 sin θ cos θ,   cos 2θ = cos²θ − sin²θ",
    variables: "θ is any angle.",
    use: "Rewrites a doubled angle in terms of the single one. sin 2θ is not 2 sin θ, and these exist to stop exactly that.",
    example:
      "At θ = 30°: sin 60° = 0.866, and 2 × 0.5 × 0.866 = 0.866. Writing 2 sin 30° would have given 1.",
    keywords: ["double angle", "trig identity", "sin 2 theta"],
  },
  {
    id: "iqr",
    name: "Interquartile Range",
    category: "Statistics",
    expression: "IQR = Q₃ − Q₁",
    variables:
      "Q₁ and Q₃ sit a quarter and three quarters of the way through the sorted data.",
    use: "The spread of the middle half, which survives the outliers that make the plain range useless.",
    example:
      "With Q₁ = 12 and Q₃ = 28, the IQR is 16 — the span holding the central 50%.",
    keywords: ["iqr", "interquartile range", "quartiles", "spread"],
  },
  {
    id: "weighted-mean",
    name: "Weighted Mean",
    category: "Statistics",
    expression: "x̄ = Σ(w × x) / Σw",
    variables:
      "Each value x carries a weight w — credits, hours or quantities.",
    use: "For when the values do not count equally. Averaging the values and ignoring the weights is the classic grade-point mistake.",
    example:
      "Grades of 3.7 over 4 credits, 3.0 over 3 and 4.0 over 2: (14.8 + 9 + 8) / 9 = 3.53.",
    keywords: ["weighted average", "weighted mean", "gpa", "credits"],
    tool: ["/gpa-calculator/", "GPA Calculator"],
  },
  {
    id: "expected-value",
    name: "Expected Value",
    category: "Statistics",
    expression: "E(X) = Σ x × P(x)",
    variables: "Each outcome multiplied by its probability, then totalled.",
    use: "The long-run average of a random process. It need not be a result that can actually occur.",
    example:
      "A fair die: (1 + 2 + 3 + 4 + 5 + 6) / 6 = 3.5, a face the die does not have.",
    keywords: ["expected value", "long run average", "ev"],
  },
  {
    id: "complement",
    name: "Complement Rule",
    category: "Statistics",
    expression: "P(not A) = 1 − P(A)",
    variables: "A is any event.",
    use: "Usually far easier to find the chance of something not happening and subtract, especially for questions asking about at least one.",
    example:
      "At least one six in two rolls: 1 − (5/6)² = 1 − 25/36 = 11/36, about 30.6%.",
    keywords: ["complement", "at least one", "not", "probability"],
  },
  {
    id: "independent-events",
    name: "Independent Events",
    category: "Statistics",
    expression: "P(A and B) = P(A) × P(B)",
    variables: "Valid only when one event has no effect on the other.",
    use: "Multiplying requires independence. Drawing a second card without replacing the first breaks it, and the answer comes out wrong.",
    example: "Two heads in a row: 0.5 × 0.5 = 0.25.",
    keywords: ["independent events", "and rule", "multiply probabilities"],
  },
  {
    id: "break-even",
    name: "Break-Even Point",
    category: "Finance",
    expression: "units = fixed costs / (price − variable cost)",
    variables:
      "The bracket is the contribution each sale makes towards the fixed costs.",
    use: "How many you must sell before anything is earned. If the price sits below the variable cost, no volume ever breaks even.",
    example:
      "£12,000 of fixed costs, selling at £25 against £10 of cost per unit: 12,000 / 15 = 800 units.",
    keywords: ["break even", "breakeven", "contribution", "fixed costs"],
  },
  {
    id: "profit-margin",
    name: "Profit Margin",
    category: "Finance",
    expression: "margin = (revenue − cost) / revenue × 100",
    variables: "Divided by revenue, meaning the selling price.",
    use: "The share of the selling price that is profit, so it can never reach 100%.",
    example: "An item costing £180 and sold for £250: 70 / 250 = 28%.",
    keywords: ["profit margin", "gross margin", "margin"],
  },
  {
    id: "markup",
    name: "Markup, and Why It Is Not Margin",
    category: "Finance",
    expression: "markup = (revenue − cost) / cost × 100",
    variables: "Divided by cost, meaning what you paid.",
    use: "The same profit over a different denominator, so the two figures never agree. Quoting a markup as a margin overstates what you earn.",
    example:
      "That same £180 item sold at £250 is a 28% margin but a 38.9% markup — 70/250 against 70/180.",
    keywords: ["markup", "margin vs markup", "cost plus"],
  },
  {
    id: "depreciation",
    name: "Straight-Line Depreciation",
    category: "Finance",
    expression: "annual charge = (cost − salvage value) / useful life",
    variables:
      "Salvage value is what the asset is worth at the end of that life.",
    use: "Spreads the loss in value evenly across the years. Real assets rarely lose value evenly, which is why other methods exist.",
    example:
      "A van costing £18,000 and worth £3,000 after five years: 15,000 / 5 = £3,000 a year.",
    keywords: ["depreciation", "straight line", "asset", "writing down"],
  },
  {
    id: "discount-price",
    name: "Price After a Discount",
    category: "Finance",
    expression: "final = original × (1 − discount)",
    variables: "discount as a decimal, so 0.3 for 30% off.",
    use: "Two discounts do not add up. 20% then a further 10% is 0.8 × 0.9 = 0.72, which is 28% off rather than 30%.",
    example: "£80 with 30% off: 80 × 0.7 = £56.",
    keywords: ["discount", "sale price", "percent off", "stacked discounts"],
    tool: ["/discount-calculator/", "Discount Calculator"],
  },
  {
    id: "ear",
    name: "Effective Annual Rate",
    category: "Finance",
    expression: "EAR = (1 + r/n)ⁿ − 1",
    variables:
      "r is the nominal annual rate, n the number of compounding periods a year.",
    use: "Makes two rates with different compounding frequencies comparable, which the advertised rate alone cannot do.",
    example: "12% compounded monthly: (1.01)¹² − 1 = 12.68%, not 12%.",
    keywords: ["ear", "aer", "apy", "effective rate", "nominal rate"],
  },
  {
    id: "miles-km",
    name: "Miles and Kilometres",
    category: "Measurement",
    expression: "km = miles × 1.609344",
    variables: "Exact by definition rather than an approximation.",
    use: "Reverse it by dividing. The mental version — multiply by 1.6, or take five eighths coming back — is close enough for a road sign.",
    example: "60 miles is 96.56 km, and 100 km is 62.14 miles.",
    keywords: ["miles to km", "kilometres", "distance conversion"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },
  {
    id: "kg-lb",
    name: "Kilograms and Pounds",
    category: "Measurement",
    expression: "lb = kg × 2.20462",
    variables: "One pound is exactly 0.45359237 kg.",
    use: "Doubling is the usual shortcut in your head, and it runs about 10% light every time.",
    example:
      "70 kg is 154.32 lb. Doubling would have said 140, which is 14 lb short.",
    keywords: ["kg to lbs", "pounds", "weight conversion"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },
  {
    id: "litres-gallons",
    name: "Litres and Gallons",
    category: "Measurement",
    expression: "US gallons = litres / 3.785411784",
    variables:
      "An imperial gallon is a different size again, at 4.54609 litres.",
    use: "The two gallons differ by about a fifth, so a figure quoted without saying which one is not usable.",
    example: "50 litres is 13.21 US gallons, or 11.00 imperial gallons.",
    keywords: ["litres to gallons", "gallon", "fuel", "volume conversion"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },
  {
    id: "sqm-sqft",
    name: "Square Metres and Square Feet",
    category: "Measurement",
    expression: "ft² = m² × 10.7639",
    variables: "It is the length factor squared: 3.28084² = 10.7639.",
    use: "Area factors are always the length factor squared, which is why using 3.28 here leaves the answer more than three times too small.",
    example: "25 m² is 269.10 ft².",
    keywords: ["square metres", "square feet", "area conversion", "sq ft"],
    tool: ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
  },
  {
    id: "mpg-l100",
    name: "MPG and Litres per 100 km",
    category: "Measurement",
    expression: "L/100km = 282.481 / mpg  (imperial)",
    variables: "Use 235.215 instead for US mpg, whose gallon is smaller.",
    use: "These are reciprocals rather than a scale, so the same step in mpg saves very different amounts of fuel at different ends of the range.",
    example:
      "40 mpg is 7.06 L/100km. Moving from 20 to 25 mpg saves 2.82 L/100km, while 40 to 45 saves only 0.78.",
    keywords: ["mpg", "l/100km", "fuel economy", "miles per gallon"],
    tool: ["/fuel-cost-calculator/", "Fuel Cost Calculator"],
  },
];

/* Stable sort by category, so an entry appended anywhere above still
   renders grouped rather than scattered through the list. */
export const FORMULAS: Formula[] = RAW.slice().sort(
  (a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category),
);

export const FORMULA_COUNT = FORMULAS.length;

export const COUNT_BY_CATEGORY: Record<Category, number> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c] = FORMULAS.filter((f) => f.category === c).length;
    return acc;
  },
  {} as Record<Category, number>,
);
