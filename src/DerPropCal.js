import React, { useMemo, useState } from "react";

const money = (value) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value || 0);

const num = (value) =>
  new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 2,
  }).format(value || 0);

/* =========================================================
   AREA CONVERTER
   ========================================================= */

function AreaConverter() {
  const [sqft, setSqft] = useState("");
  const [gaz, setGaz] = useState("");
  const [marla, setMarla] = useState("");

  // Common Pakistan convention
  // 1 gaz = 9 sq ft
  // 1 marla = 272.25 sq ft

  const updateFromSqft = (value) => {
    setSqft(value);

    const sqftValue = Number(value);

    if (!sqftValue) {
      setGaz("");
      setMarla("");
      return;
    }

    setGaz(String(sqftValue / 9));
    setMarla(String(sqftValue / 272.25));
  };

  const updateFromGaz = (value) => {
    setGaz(value);

    const gazValue = Number(value);

    if (!gazValue) {
      setSqft("");
      setMarla("");
      return;
    }

    const sqftValue = gazValue * 9;

    setSqft(String(sqftValue));
    setMarla(String(sqftValue / 272.25));
  };

  const updateFromMarla = (value) => {
    setMarla(value);

    const marlaValue = Number(value);

    if (!marlaValue) {
      setSqft("");
      setGaz("");
      return;
    }

    const sqftValue = marlaValue * 272.25;

    setSqft(String(sqftValue));
    setGaz(String(sqftValue / 9));
  };

  return (
    <div className="calculator-card">
      <h2>Area Converter</h2>

      <p className="muted">
        Enter any one unit. The other two units will be calculated
        automatically.
      </p>

      <div className="area-grid">
        <div>
          <label>Square Feet</label>

          <input
            type="number"
            value={sqft}
            onChange={(e) => updateFromSqft(e.target.value)}
            placeholder="e.g. 1200"
          />
        </div>

        <div>
          <label>Gaz / Gaj</label>

          <input
            type="number"
            value={gaz}
            onChange={(e) => updateFromGaz(e.target.value)}
            placeholder="e.g. 133.33"
          />
        </div>

        <div>
          <label>Marla</label>

          <input
            type="number"
            value={marla}
            onChange={(e) => updateFromMarla(e.target.value)}
            placeholder="e.g. 4.41"
          />
        </div>
      </div>

      <div className="formula">
        <div>1 Gaz = 9 sq ft</div>
        <div>1 Marla = 272.25 sq ft</div>
      </div>
    </div>
  );
}

/* =========================================================
   LOAN CALCULATOR
   ========================================================= */

function LoanCalculator() {
  const [propertyPrice, setPropertyPrice] = useState("1000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [annualRate, setAnnualRate] = useState("5.47");
  const [years, setYears] = useState("25");

  const calculation = useMemo(() => {
    const price = Number(propertyPrice) || 0;
    const downPercent = Number(downPaymentPercent) || 0;
    const rate = Number(annualRate) || 0;
    const termYears = Number(years) || 0;

    const downPayment = price * (downPercent / 100);

    const loanAmount = price - downPayment;

    const monthlyRate = rate / 100 / 12;
    const months = termYears * 12;

    let monthlyPayment = 0;

    if (loanAmount > 0 && months > 0) {
      if (monthlyRate === 0) {
        monthlyPayment = loanAmount / months;
      } else {
        monthlyPayment =
          (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
      }
    }

    const yearlyPayment = monthlyPayment * 12;

    const totalPayments = monthlyPayment * months;

    const totalProfit = totalPayments - loanAmount;

    return {
      price,
      downPayment,
      loanAmount,
      monthlyPayment,
      yearlyPayment,
      totalPayments,
      totalProfit,
    };
  }, [propertyPrice, downPaymentPercent, annualRate, years]);

  return (
    <div className="calculator-card">
      <h2>Loan / Home Finance Calculator</h2>

      <div className="form-grid">
        <div>
          <label>Property Value</label>

          <input
            type="number"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Down Payment %</label>

          <input
            type="number"
            value={downPaymentPercent}
            onChange={(e) =>
              setDownPaymentPercent(e.target.value)
            }
          />
        </div>

        <div>
          <label>Annual Rate / Profit Rate %</label>

          <input
            type="number"
            step="0.01"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
        </div>

        <div>
          <label>Finance Period</label>

          <select
            value={years}
            onChange={(e) => setYears(e.target.value)}
          >
            <option value="10">10 Years</option>
            <option value="15">15 Years</option>
            <option value="20">20 Years</option>
            <option value="25">25 Years</option>
            <option value="30">30 Years</option>
          </select>
        </div>
      </div>

      <div className="top-summary">
        <SummaryItem
          label="Property Value"
          value={money(calculation.price)}
        />

        <SummaryItem
          label="Down Payment"
          value={money(calculation.downPayment)}
        />

        <SummaryItem
          label="Bank Finance"
          value={money(calculation.loanAmount)}
        />

        <SummaryItem
          label="Monthly Payment"
          value={money(calculation.monthlyPayment)}
          highlight
        />

        <SummaryItem
          label="Yearly Payment"
          value={money(calculation.yearlyPayment)}
        />

        <SummaryItem
          label="Total Profit / Interest"
          value={money(calculation.totalProfit)}
        />
      </div>
    </div>
  );
}

/* =========================================================
   PROPERTY COST DATA
   ========================================================= */

const CITY_COSTS = {
  Dubai: {
    registrationRate: 2,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRate: 0.25,
    titleDeed: 250,

    noc: 0,
    valuation: 3000,
    processing: 5250,
    other: 0,
  },

  "Abu Dhabi": {
    registrationRate: 1,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRate: 0.1,
    titleDeed: 0,

    noc: 0,
    valuation: 3000,
    processing: 5250,
    other: 0,
  },

  Sharjah: {
    registrationRate: 2,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRate: 0,
    titleDeed: 500,

    noc: 0,
    valuation: 3000,
    processing: 5250,
    other: 0,
  },

  Ajman: {
    registrationRate: 3,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRate: 0.5,
    titleDeed: 350,

    noc: 0,
    valuation: 3000,
    processing: 5250,
    other: 0,
  },
};

/* =========================================================
   PURCHASE BREAKDOWN
   ========================================================= */

function PurchaseBreakdown({
  propertyPrice,
  financeAmount,
}) {
  const [open, setOpen] = useState(true);

  const calculateCity = (city) => {
    const c = CITY_COSTS[city];

    const registration =
      propertyPrice * (c.registrationRate / 100);

    const broker =
      propertyPrice * (c.brokerRate / 100);

    const brokerVat =
      broker * (c.brokerVat / 100);

    const mortgage =
      financeAmount * (c.mortgageRate / 100);

    const subtotal =
      registration +
      broker +
      brokerVat +
      mortgage +
      c.titleDeed +
      c.noc +
      c.valuation +
      c.processing +
      c.other;

    const grandTotal = propertyPrice + subtotal;

    return {
      registration,
      broker,
      brokerVat,
      mortgage,
      titleDeed: c.titleDeed,
      noc: c.noc,
      valuation: c.valuation,
      processing: c.processing,
      other: c.other,
      subtotal,
      grandTotal,
    };
  };

  const data = {
    Dubai: calculateCity("Dubai"),
    "Abu Dhabi": calculateCity("Abu Dhabi"),
    Sharjah: calculateCity("Sharjah"),
    Ajman: calculateCity("Ajman"),
  };

  const rows = [
    {
      label: "Property Registration",
      key: "registration",
    },

    {
      label: "Broker Commission",
      key: "broker",
    },

    {
      label: "VAT on Broker",
      key: "brokerVat",
    },

    {
      label: "Mortgage / Finance Registration",
      key: "mortgage",
    },

    {
      label: "Title Deed / Certificate",
      key: "titleDeed",
    },

    {
      label: "NOC / Developer Fees",
      key: "noc",
    },

    {
      label: "Bank Valuation",
      key: "valuation",
    },

    {
      label: "Bank Processing / Admin",
      key: "processing",
    },

    {
      label: "Other Charges",
      key: "other",
    },
  ];

  return (
    <div className="breakdown-wrapper">
      <button
        className="collapse-header"
        onClick={() => setOpen(!open)}
      >
        <div>
          <strong>Purchase Breakdown</strong>

          <span>
            Registration, broker, mortgage, NOC, bank and other
            charges
          </span>
        </div>

        <span className={`arrow ${open ? "rotate" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="breakdown-content">
          <div className="table-scroll">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Purchase Cost</th>
                  <th>Dubai</th>
                  <th>Abu Dhabi</th>
                  <th>Sharjah</th>
                  <th>Ajman</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td>{row.label}</td>

                    <td>
                      {money(data.Dubai[row.key])}
                    </td>

                    <td>
                      {money(data["Abu Dhabi"][row.key])}
                    </td>

                    <td>
                      {money(data.Sharjah[row.key])}
                    </td>

                    <td>
                      {money(data.Ajman[row.key])}
                    </td>
                  </tr>
                ))}

                <tr className="subtotal-row">
                  <td>SUBTOTAL — Additional Costs</td>

                  <td>{money(data.Dubai.subtotal)}</td>

                  <td>
                    {money(data["Abu Dhabi"].subtotal)}
                  </td>

                  <td>{money(data.Sharjah.subtotal)}</td>

                  <td>{money(data.Ajman.subtotal)}</td>
                </tr>

                <tr className="grand-total-row">
                  <td>GRAND TOTAL</td>

                  <td>{money(data.Dubai.grandTotal)}</td>

                  <td>
                    {money(data["Abu Dhabi"].grandTotal)}
                  </td>

                  <td>{money(data.Sharjah.grandTotal)}</td>

                  <td>{money(data.Ajman.grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="breakdown-note">
            <strong>Note:</strong> Registration, broker, NOC,
            valuation, processing and other fees can vary depending
            on the property, transaction structure, bank and
            developer. These figures are configurable estimates.
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PROPERTY CALCULATOR
   ========================================================= */

function PropertyCalculator() {
  const [propertyPrice, setPropertyPrice] =
    useState("1000000");

  const [downPaymentPercent, setDownPaymentPercent] =
    useState("20");

  const [rate, setRate] = useState("5.47");

  const [years, setYears] = useState("25");

  const calculation = useMemo(() => {
    const price = Number(propertyPrice) || 0;

    const downPercent =
      Number(downPaymentPercent) || 0;

    const downPayment =
      price * (downPercent / 100);

    const finance =
      price - downPayment;

    const annualRate = Number(rate) || 0;

    const months = Number(years) * 12;

    const monthlyRate =
      annualRate / 100 / 12;

    let monthlyPayment = 0;

    if (finance > 0 && months > 0) {
      if (monthlyRate === 0) {
        monthlyPayment =
          finance / months;
      } else {
        monthlyPayment =
          (finance *
            monthlyRate *
            Math.pow(
              1 + monthlyRate,
              months
            )) /
          (Math.pow(
            1 + monthlyRate,
            months
          ) - 1);
      }
    }

    return {
      price,
      downPayment,
      finance,
      monthlyPayment,
      yearlyPayment:
        monthlyPayment * 12,
    };
  }, [
    propertyPrice,
    downPaymentPercent,
    rate,
    years,
  ]);

  return (
    <div className="calculator-card">
      <h2>UAE Property Cost Calculator</h2>

      <p className="muted">
        Enter the property value and finance details. The
        calculator will compare the estimated purchase cost
        across Dubai, Abu Dhabi, Sharjah and Ajman.
      </p>

      <div className="form-grid">
        <div>
          <label>Property Value</label>

          <input
            type="number"
            value={propertyPrice}
            onChange={(e) =>
              setPropertyPrice(e.target.value)
            }
          />
        </div>

        <div>
          <label>Down Payment %</label>

          <input
            type="number"
            value={downPaymentPercent}
            onChange={(e) =>
              setDownPaymentPercent(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label>Annual Profit / Interest Rate %</label>

          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) =>
              setRate(e.target.value)
            }
          />
        </div>

        <div>
          <label>Finance Period</label>

          <select
            value={years}
            onChange={(e) =>
              setYears(e.target.value)
            }
          >
            <option value="10">
              10 Years
            </option>

            <option value="15">
              15 Years
            </option>

            <option value="20">
              20 Years
            </option>

            <option value="25">
              25 Years
            </option>

            <option value="30">
              30 Years
            </option>
          </select>
        </div>
      </div>

      {/* GENERAL / FIXED PAYMENT SUMMARY */}

      <div className="summary-heading">
        <h3>Finance Summary</h3>

        <span>
          Based on {downPaymentPercent}% down payment,
          {100 - Number(downPaymentPercent)}% financing
        </span>
      </div>

      <div className="top-summary">
        <SummaryItem
          label="Property Value"
          value={money(calculation.price)}
        />

        <SummaryItem
          label="Your Down Payment"
          value={money(
            calculation.downPayment
          )}
        />

        <SummaryItem
          label="Bank Finance"
          value={money(
            calculation.finance
          )}
        />

        <SummaryItem
          label="Monthly Payment"
          value={money(
            calculation.monthlyPayment
          )}
          highlight
        />

        <SummaryItem
          label="Yearly Payment"
          value={money(
            calculation.yearlyPayment
          )}
        />
      </div>

      {/* COLLAPSIBLE PURCHASE BREAKDOWN */}

      <PurchaseBreakdown
        propertyPrice={
          calculation.price
        }
        financeAmount={
          calculation.finance
        }
      />
    </div>
  );
}

/* =========================================================
   SUMMARY ITEM
   ========================================================= */

function SummaryItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`summary-item ${
        highlight ? "highlight" : ""
      }`}
    >
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function PropertyFinanceCalculator() {
  const [tab, setTab] = useState("property");

  return (
    <div className="property-calculator">
      <div className="header">
        <h1>
          UAE Property & Finance Calculator
        </h1>

        <p>
          Property cost, home finance and area
          conversion in one place.
        </p>
      </div>

      <div className="tabs">
        <button
          className={
            tab === "property"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("property")
          }
        >
          🏠 Property Purchase
        </button>

        <button
          className={
            tab === "loan"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("loan")
          }
        >
          💰 Loan Calculator
        </button>

        <button
          className={
            tab === "area"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("area")
          }
        >
          📐 Area Converter
        </button>
      </div>

      {tab === "property" && (
        <PropertyCalculator />
      )}

      {tab === "loan" && (
        <LoanCalculator />
      )}

      {tab === "area" && (
        <AreaConverter />
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .property-calculator {
          max-width: 1200px;
          margin: 40px auto;
          padding: 24px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: #172033;
          background: #f7f9fc;
        }

        .header {
          margin-bottom: 24px;
        }

        .header h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .header p,
        .muted {
          color: #687386;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tabs button {
          border: 1px solid #26364a;
          background: #26364a;
          color: #ffffff;
          padding: 12px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 150ms ease, border-color 150ms ease;
        }

        .tabs button:hover {
          background: #354a60;
          border-color: #354a60;
        }

        .tabs button.active {
          background: #187456;
          color: #ffffff;
          border-color: #187456;
        }

        .tabs button:focus-visible {
          outline: 3px solid #7bc8a8;
          outline-offset: 2px;
        }

        .calculator-card {
          background: white;
          border: 1px solid #e3e7ef;
          border-radius: 16px;
          padding: 24px;
          box-shadow:
            0 8px 30px
            rgba(30, 40, 60, 0.06);
        }

        .calculator-card h2 {
          margin-top: 0;
          margin-bottom: 6px;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);

          gap: 16px;
          margin: 24px 0;
        }

        label {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
          font-weight: 600;
        }

        input,
        select {
          width: 100%;
          padding: 12px;
          border: 1px solid #d9dee8;
          border-radius: 9px;
          font-size: 15px;
          background: white;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #7c8595;
        }

        /* =========================
           SUMMARY
        ========================= */

        .summary-heading {
          display: flex;
          justify-content:
            space-between;

          align-items: center;
          margin-top: 30px;
          margin-bottom: 12px;
        }

        .summary-heading h3 {
          margin: 0;
        }

        .summary-heading span {
          color: #6b7586;
          font-size: 13px;
        }

        .top-summary {
          display: grid;
          grid-template-columns:
            repeat(5, 1fr);

          gap: 10px;
        }

        .summary-item {
          border: 1px solid #e5e9f0;
          background: #fafbfc;
          padding: 16px;
          border-radius: 12px;
        }

        .summary-item span {
          display: block;
          color: #687386;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .summary-item strong {
          font-size: 18px;
        }

        .summary-item.highlight {
          background: #eef6f2;
          border-color: #cfe3d9;
        }

        /* =========================
           COLLAPSIBLE
        ========================= */

        .breakdown-wrapper {
          margin-top: 28px;
          border: 1px solid #e1e6ee;
          border-radius: 14px;
          overflow: hidden;
        }

        .collapse-header {
          width: 100%;
          border: none;
          background: #f7f9fb;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content:
            space-between;

          text-align: left;
          cursor: pointer;
        }

        .collapse-header strong {
          display: block;
          font-size: 16px;
        }

        .collapse-header span {
          display: block;
          margin-top: 4px;
          color: #707b8d;
          font-size: 12px;
        }

        .collapse-header .arrow {
          font-size: 12px;
          transition:
            transform 0.2s ease;
        }

        .collapse-header .arrow.rotate {
          transform: rotate(180deg);
        }

        .breakdown-content {
          padding: 20px;
          background: white;
        }

        /* =========================
           COMPARISON TABLE
        ========================= */

        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .comparison-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 13px 14px;
          border-bottom:
            1px solid #edf0f4;
          text-align: right;
          white-space: nowrap;
        }

        .comparison-table th:first-child,
        .comparison-table td:first-child {
          text-align: left;
          position: sticky;
          left: 0;
          background: white;
        }

        .comparison-table thead th {
          background: #f4f6f9;
          font-size: 13px;
          font-weight: 700;
        }

        .comparison-table tbody td {
          font-size: 13px;
        }

        .comparison-table tbody tr:hover td {
          background: #fafbfc;
        }

        .subtotal-row td {
          background: #f3f5f8 !important;
          font-weight: 700;
          border-top: 2px solid #dfe4eb;
        }

        .grand-total-row td {
          background: #172033 !important;
          color: white;
          font-weight: 800;
          font-size: 14px;
        }

        .grand-total-row td:first-child {
          background: #172033 !important;
          color: white;
        }

        .breakdown-note {
          margin-top: 15px;
          padding: 13px;
          border-radius: 9px;
          background: #fff8e6;
          border: 1px solid #f1dfac;
          color: #68551d;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================
           AREA
        ========================= */

        .area-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);

          gap: 16px;
          margin-top: 24px;
        }

        .formula {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          background: #f5f7fa;
          color: #596273;
          font-size: 13px;
          line-height: 1.7;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 900px) {
          .top-summary {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .area-grid {
            grid-template-columns:
              1fr;
          }
        }

        @media (max-width: 650px) {
          .property-calculator {
            margin: 0;
            padding: 14px;
          }

          .calculator-card {
            padding: 18px;
          }

          .form-grid {
            grid-template-columns:
              1fr;
          }

          .top-summary {
            grid-template-columns:
              1fr;
          }

          .summary-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }

          .tabs button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}