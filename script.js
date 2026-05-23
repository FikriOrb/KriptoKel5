"use strict";

const binaryPattern = /^[01]+$/;

const normalize = (poly) => {
  const cleaned = String(poly).replace(/^0+/, "");
  return cleaned.length === 0 ? "0" : cleaned;
};

const degree = (poly) => {
  const normalized = normalize(poly);
  return normalized === "0" ? -1 : normalized.length - 1;
};

const xorPolynomials = (left, right) => {
  const width = Math.max(left.length, right.length);
  const a = left.padStart(width, "0");
  const b = right.padStart(width, "0");
  let output = "";

  for (let index = 0; index < width; index += 1) {
    // GF(2) addition and subtraction are identical: each coefficient is XORed.
    output += Number(a[index]) ^ Number(b[index]);
  }

  return normalize(output);
};

const shiftPolynomial = (poly, places) => {
  const normalized = normalize(poly);
  // Multiplying by x^n appends n zero coefficients on the right side.
  return normalized === "0" ? "0" : normalized + "0".repeat(places);
};

const multiplyPolynomials = (left, right) => {
  const a = normalize(left);
  const b = normalize(right);
  let product = "0";

  for (let index = b.length - 1; index >= 0; index -= 1) {
    if (b[index] === "1") {
      const shift = b.length - 1 - index;
      product = xorPolynomials(product, shiftPolynomial(a, shift));
    }
  }

  return product;
};

const dividePolynomials = (dividend, divisor) => {
  const normalizedDivisor = normalize(divisor);

  if (normalizedDivisor === "0") {
    throw new Error("Pembagian dengan polinomial nol tidak valid.");
  }

  let remainder = normalize(dividend);
  const quotientWidth = Math.max(1, degree(remainder) - degree(normalizedDivisor) + 1);
  const quotientBits = Array.from({ length: quotientWidth }, () => "0");
  const steps = [];

  while (remainder !== "0" && degree(remainder) >= degree(normalizedDivisor)) {
    const shift = degree(remainder) - degree(normalizedDivisor);
    const shiftedDivisor = shiftPolynomial(normalizedDivisor, shift);
    const before = remainder;

    // The coefficient for x^shift sits from the right in a high-to-low bit string.
    quotientBits[quotientWidth - 1 - shift] =
      String(Number(quotientBits[quotientWidth - 1 - shift]) ^ 1);
    remainder = xorPolynomials(remainder, shiftedDivisor);

    steps.push({
      shift,
      before,
      subtractor: shiftedDivisor,
      after: remainder,
    });
  }

  return {
    quotient: normalize(quotientBits.join("")),
    remainder,
    steps,
  };
};

const moduloPolynomial = (poly, modulus) => dividePolynomials(poly, modulus).remainder;

const polynomialToExpression = (poly) => {
  const normalized = normalize(poly);

  if (normalized === "0") {
    return "0";
  }

  return normalized
    .split("")
    .map((bit, index) => ({ bit, power: normalized.length - 1 - index }))
    .filter((term) => term.bit === "1")
    .map((term) => {
      if (term.power === 0) return "1";
      if (term.power === 1) return "x";
      return `x^${term.power}`;
    })
    .join(" + ");
};

const extendedEuclidean = (modulus, element) => {
  let r0 = normalize(modulus);
  let r1 = normalize(element);
  let t0 = "0";
  let t1 = "1";
  const iterations = [];

  while (r1 !== "0") {
    const division = dividePolynomials(r0, r1);
    const qTimesT1 = multiplyPolynomials(division.quotient, t1);
    const t2 = xorPolynomials(t0, qTimesT1);

    iterations.push({
      index: iterations.length + 1,
      r0,
      r1,
      quotient: division.quotient,
      remainder: division.remainder,
      t0,
      t1,
      qTimesT1,
      t2,
      divisionSteps: division.steps,
    });

    r0 = r1;
    r1 = division.remainder;
    t0 = t1;
    t1 = t2;
  }

  const gcd = r0;
  const inverse = gcd === "1" ? moduloPolynomial(t0, modulus) : null;

  return {
    gcd,
    inverse,
    iterations,
  };
};

const validateInput = (modulus, element) => {
  if (!binaryPattern.test(modulus) || !binaryPattern.test(element)) {
    return "Input hanya boleh berisi digit 0 dan 1.";
  }

  if (normalize(modulus) === "0") {
    return "Modulus tidak boleh bernilai nol.";
  }

  if (normalize(element) === "0") {
    return "Polynomial input tidak boleh bernilai nol.";
  }

  if (degree(element) >= degree(modulus)) {
    return "Derajat polynomial input harus lebih kecil dari derajat modulus.";
  }

  return "";
};

const elements = {
  form: document.querySelector("#gf2-form"),
  modulus: document.querySelector("#modulus"),
  element: document.querySelector("#element"),
  loadAes: document.querySelector("#load-aes"),
  error: document.querySelector("#form-error"),
  gcd: document.querySelector("#result-gcd"),
  inverse: document.querySelector("#result-inverse"),
  polynomial: document.querySelector("#result-polynomial"),
  fieldDegree: document.querySelector("#result-field-degree"),
  inputDegree: document.querySelector("#result-input-degree"),
  check: document.querySelector("#result-check"),
  iterationList: document.querySelector("#iteration-list"),
};

const setError = (message) => {
  elements.error.textContent = message;
  elements.modulus.setAttribute("aria-invalid", String(Boolean(message)));
  elements.element.setAttribute("aria-invalid", String(Boolean(message)));
};

const buildCell = (label, value) => `
  <div class="iteration-cell">
    <span>${label}</span>
    <code>${value}</code>
  </div>
`;

const renderDivisionSteps = (steps) => {
  if (steps.length === 0) {
    return "<code>degree(r0) &lt; degree(r1), quotient = 0</code>";
  }

  return steps
    .map((step) => (
      `<code>${step.before} XOR ${step.subtractor} = ${step.after} (shift ${step.shift})</code>`
    ))
    .join("");
};

const renderIterations = (iterations) => {
  elements.iterationList.innerHTML = iterations
    .map((iteration) => `
      <article class="iteration-card">
        <h3>Iterasi ${iteration.index}</h3>
        <div class="iteration-grid">
          ${buildCell("r0", iteration.r0)}
          ${buildCell("r1", iteration.r1)}
          ${buildCell("quotient", iteration.quotient)}
          ${buildCell("residue", iteration.remainder)}
          ${buildCell("t0", iteration.t0)}
          ${buildCell("t1", iteration.t1)}
          ${buildCell("q * t1", iteration.qTimesT1)}
          ${buildCell("t2 = t0 XOR q * t1", iteration.t2)}
        </div>
        <div class="division-work">
          <strong>Pembagian bersusun GF(2)</strong>
          ${renderDivisionSteps(iteration.divisionSteps)}
        </div>
      </article>
    `)
    .join("");
};

const renderResult = (modulus, element) => {
  const result = extendedEuclidean(modulus, element);
  const fieldWidth = degree(modulus);
  const inverseDisplay = result.inverse ? result.inverse.padStart(fieldWidth, "0") : null;

  elements.gcd.textContent = result.gcd;
  elements.inverse.textContent = inverseDisplay ?? "Tidak ada inverse";
  elements.polynomial.textContent = result.inverse ? polynomialToExpression(result.inverse) : "-";
  elements.fieldDegree.textContent = String(degree(modulus));
  elements.inputDegree.textContent = String(degree(element));

  if (result.inverse) {
    const product = multiplyPolynomials(element, result.inverse);
    const reduced = moduloPolynomial(product, modulus);
    elements.check.innerHTML = `<span class="result-ok">${element} * ${inverseDisplay} mod ${modulus} = ${reduced}</span>`;
  } else {
    elements.check.textContent = `gcd = ${result.gcd}, sehingga inverse tidak eksis.`;
  }

  renderIterations(result.iterations);
};

const sanitizeBinaryInput = (event) => {
  const input = event.currentTarget;
  input.value = input.value.replace(/[^01]/g, "");
};

elements.modulus.addEventListener("input", sanitizeBinaryInput);
elements.element.addEventListener("input", sanitizeBinaryInput);

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

  const modulus = elements.modulus.value.trim();
  const element = elements.element.value.trim();
  const error = validateInput(modulus, element);

  setError(error);

  if (error) {
    return;
  }

  renderResult(normalize(modulus), normalize(element));
});

elements.loadAes.addEventListener("click", () => {
  elements.modulus.value = "100011011";
  elements.element.value = "01010011";
  elements.form.requestSubmit();
});

elements.form.requestSubmit();
