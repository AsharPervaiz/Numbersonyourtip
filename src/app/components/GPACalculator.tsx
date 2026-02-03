"use client";
import { useState } from "react";

const gradePoints: Record<string, number> = {
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

export default function GPACalculator() {
  const [subjects, setSubjects] = useState([{ credit: "", grade: "A" }]);
  const [gpa, setGpa] = useState<number | null>(null);

  const addSubject = () => {
    setSubjects([...subjects, { credit: "", grade: "A" }]);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((s) => {
      const credit = Number(s.credit);
      if (!credit) return;

      totalCredits += credit;
      totalPoints += credit * gradePoints[s.grade];
    });

    if (totalCredits === 0) return;

    setGpa(Number((totalPoints / totalCredits).toFixed(2)));
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setSubjects([{ credit: "", grade: "A" }]);
    setGpa(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Semester GPA Calculator</h2>

      {subjects.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            className="calc-input"
            type="number"
            placeholder="Credits"
            value={s.credit}
            onChange={(e) => {
              const updated = [...subjects];
              updated[i].credit = e.target.value;
              setSubjects(updated);
            }}
          />

          <select
            className="calc-input"
            value={s.grade}
            onChange={(e) => {
              const updated = [...subjects];
              updated[i].grade = e.target.value;
              setSubjects(updated);
            }}
          >
            {Object.keys(gradePoints).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Add Subject button on its own line */}
      <div style={{ marginBottom: "10px" }}>
        <button className="calc-button" onClick={addSubject}>
          + Add Subject
        </button>
      </div>

      {/* Calculate and Clear buttons side by side */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={calculateGPA}>
          Calculate GPA
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {gpa !== null && (
        <div className="calc-result">
          Semester GPA: {gpa}
        </div>
      )}
    </div>
  );
}
