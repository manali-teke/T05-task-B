// Course grade calculator: validates the grade form, calculates the final
// grade and letter grade, and shows a result card. See docs/requirements.md.

const HOMEWORK_WEIGHT = 0.4;
const MIDTERM_WEIGHT = 0.25;
const FINAL_WEIGHT = 0.35;
const MAX_EXTRA = 10;
const MAX_NOTE = 120;

// A score from 0 to 100 with up to 2 decimal places, for example 87.25.
const SCORE_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;

const FIELDS = ["homework", "midterm", "final", "extra", "note"];
const SCORE_FIELDS = ["homework", "midterm", "final"];

const form = document.getElementById("grade-form");
const statusEl = document.getElementById("status");
const noteCounter = document.getElementById("note-counter");
const result = document.getElementById("result");

function readForm() {
  const data = {};
  for (const field of FIELDS) {
    data[field] = document.getElementById(field).value;
  }
  return data;
}

function validateGrades(data) {
  const errors = {};

  for (const field of SCORE_FIELDS) {
    const value = data[field].trim();
    if (!SCORE_PATTERN.test(value) || Number(value) > 100) {
      errors[field] = "Enter a score from 0 to 100, like 87.25.";
    }
  }

  if (data.extra.trim() !== "") {
    const extra = Number(data.extra.trim());
    if (!Number.isInteger(extra) || extra < 0 || extra > MAX_EXTRA) {
      errors.extra = `Extra credit must be a whole number from 0 to ${MAX_EXTRA}.`;
    }
  }

  if (data.note.length > MAX_NOTE) {
    errors.note = `Note must be ${MAX_NOTE} characters or fewer.`;
  }

  return errors;
}

function calculateGrade(data) {
  const homework = Number(data.homework);
  const midterm = Number(data.midterm);
  const final = Number(data.final);
  const extra = Number(data.extra.trim());

  const weighted =
    homework * HOMEWORK_WEIGHT + midterm * MIDTERM_WEIGHT + final * FINAL_WEIGHT;
  return Math.min(100, weighted + extra);
}

function letterGrade(grade) {
  if (grade > 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

function showErrors(errors) {
  for (const field of FIELDS) {
    document.getElementById(`${field}-error`).textContent = errors[field] || "";
  }
}

function showResult(grade, data) {
  result.innerHTML = `
    <h2>${grade.toFixed(1)} (${letterGrade(grade)})</h2>
    <p>${data.note}</p>`;
  result.hidden = false;
}

document.getElementById("note").addEventListener("input", (event) => {
  noteCounter.textContent = `${event.target.value.length}/${MAX_NOTE}`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = readForm();
  const errors = validateGrades(data);
  showErrors(errors);

  if (Object.keys(errors).length > 0) {
    statusEl.textContent = "Please fix the highlighted fields.";
    form.reset();
    return;
  }

  statusEl.textContent = "Grade calculated.";
  showResult(calculateGrade(data), data);
});
