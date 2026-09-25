import React, { useMemo, useState } from "react";

type City = "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman";

const money = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value || 0);

const number = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    maximumFractionDigits: 2,
  }).format(value || 0);

/* =========================================================
   AREA CONVERTER
   ========================================================= */

function AreaConverter() {
  const [sqft, setSqft] = useState("");

  const sqFeet = Number(sqft) || 0;

  /*
    IMPORTANT:
    Gaz/Gaj = square yard
    1 gaz = 9 sq ft

    Marla varies by region.
    We use the common Pakistan standard:
    1 marla = 272.25 sq ft
  */

  const gaz = sqFeet / 9;
  const marla = sqFeet / 272.25;

  return (
    <div className="calculator-card">
      <h2>Area Converter</h2>
      <p className="muted">
        Convert square feet into gaz (square yard) and marla.
      </p>

      <label>Square Feet</label>
      <input
        type="number"
        value={sqft}
        onChange={(e) => setSqft(e.target.value)}
        placeholder="e.g. 1200"
      />

      <div className="result-grid">
        <div className="result-box">
          <span>Square Feet</span>
          <strong>{number(sqFeet)} sq ft</strong>
        </div>

        <div className="result-box">
          <span>Gaz / Gaj</span>
          <strong>{number(gaz)} gaz</strong>
        </div>

        <div className="result-box">
          <span>Marla</span>
          <strong>{number(marla)} marla</strong>
        </div>
      </div>

      <div className="formula">
        <div>1 gaz = 9 sq ft</div>
        <div>1 marla = 272.25 sq ft</div>
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
    const totalProfitInterest = totalPayments - loanAmount;

    return {
      price,
      downPayment,
      loanAmount,
      monthlyPayment,
      yearlyPayment,
      totalPayments,
      totalProfitInterest,
      termYears,
    };
  }, [propertyPrice, downPaymentPercent, annualRate, years]);

  return (
    <div className="calculator-card">
      <h2>Home Finance Calculator</h2>

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
            onChange={(e) => setDownPaymentPercent(e.target.value)}
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
          <label>Finance Period (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
      </div>

      <div className="result-grid">
        <div className="result-box">
          <span>Down Payment</span>
          <strong>{money(calculation.downPayment)}</strong>
        </div>

        <div className="result-box">
          <span>Bank Finance</span>
          <strong>{money(calculation.loanAmount)}</strong>
        </div>

        <div className="result-box highlight">
          <span>Monthly Payment</span>
          <strong>{money(calculation.monthlyPayment)}</strong>
        </div>

        <div className="result-box">
          <span>Yearly Payment</span>
          <strong>{money(calculation.yearlyPayment)}</strong>
        </div>

        <div className="result-box">
          <span>Total Payments</span>
          <strong>{money(calculation.totalPayments)}</strong>
        </div>

        <div className="result-box">
          <span>Total Profit / Interest</span>
          <strong>{money(calculation.totalProfitInterest)}</strong>
        </div>
      </div>

      <div className="formula">
        <strong>Example:</strong> AED 1,000,000 property with 20% down,
        80% financing, 5.47% annual rate and 25 years.
      </div>
    </div>
  );
}

/* =========================================================
   UAE PROPERTY PURCHASE COST CALCULATOR
   ========================================================= */

interface PropertyCosts {
  registrationRate: number;
  buyerRegistrationRate: number;

  brokerRate: number;
  brokerVat: number;

  mortgageRegistrationRate: number;

  titleDeed: number;

  noc: number;
  valuation: number;
  bankProcessing: number;
  other: number;
}

const defaultCosts: Record<City, PropertyCosts> = {
  Dubai: {
    registrationRate: 4,
    buyerRegistrationRate: 2,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRegistrationRate: 0.25,
    titleDeed: 250,
    noc: 0,
    valuation: 3000,
    bankProcessing: 5250,
    other: 0,
  },

  "Abu Dhabi": {
    registrationRate: 2,
    buyerRegistrationRate: 1,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRegistrationRate: 0.1,
    titleDeed: 0,
    noc: 0,
    valuation: 3000,
    bankProcessing: 5250,
    other: 0,
  },

  Sharjah: {
    registrationRate: 2,
    buyerRegistrationRate: 2,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRegistrationRate: 0,
    titleDeed: 500,
    noc: 0,
    valuation: 3000,
    bankProcessing: 5250,
    other: 0,
  },

  Ajman: {
    registrationRate: 3,
    buyerRegistrationRate: 3,
    brokerRate: 2,
    brokerVat: 5,
    mortgageRegistrationRate: 0.5,
    titleDeed: 350,
    noc: 0,
    valuation: 3000,
    bankProcessing: 5250,
    other: 0,
  },
};

function PropertyCostCalculator() {
  const [city, setCity] = useState<City>("Dubai");

  const [propertyPrice, setPropertyPrice] = useState("1000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");

  const [brokerRate, setBrokerRate] = useState(
    String(defaultCosts.Dubai.brokerRate)
  );

  const [valuation, setValuation] = useState(
    String(defaultCosts.Dubai.valuation)
  );

  const [bankProcessing, setBankProcessing] = useState(
    String(defaultCosts.Dubai.bankProcessing)
  );

  const [noc, setNoc] = useState("0");
  const [other, setOther] = useState("0");

  const costs = defaultCosts[city];

  const calculation = useMemo(() => {
    const price = Number(propertyPrice) || 0;
    const downPercent = Number(downPaymentPercent) || 0;

    const downPayment = price * (downPercent / 100);

    const financeAmount = price - downPayment;

    const registrationFee =
      price * (costs.buyerRegistrationRate / 100);

    const broker = price * ((Number(brokerRate) || 0) / 100);

    const brokerVat = broker * (costs.brokerVat / 100);

    const mortgageRegistration =
      financeAmount * (costs.mortgageRegistrationRate / 100);

    const titleDeed = costs.titleDeed;

    const totalAdditionalCosts =
      registrationFee +
      broker +
      brokerVat +
      mortgageRegistration +
      titleDeed +
      Number(noc || 0) +
      Number(valuation || 0) +
      Number(bankProcessing || 0) +
      Number(other || 0);

    const totalCashRequired =
      downPayment + totalAdditionalCosts;

    return {
      price,
      downPayment,
      financeAmount,
      registrationFee,
      broker,
      brokerVat,
      mortgageRegistration,
      titleDeed,
      totalAdditionalCosts,
      totalCashRequired,
    };
  }, [
    propertyPrice,
    downPaymentPercent,
    brokerRate,
    valuation,
    bankProcessing,
    noc,
    other,
    costs,
  ]);

  const changeCity = (newCity: City) => {
    setCity(newCity);

    const newCosts = defaultCosts[newCity];

    setBrokerRate(String(newCosts.brokerRate));
    setValuation(String(newCosts.valuation));
    setBankProcessing(String(newCosts.bankProcessing));
  };

  return (
    <div className="calculator-card">
      <h2>UAE Property Purchase Calculator</h2>

      <div className="city-selector">
        {(
          ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"] as City[]
        ).map((item) => (
          <button
            key={item}
            className={city === item ? "active" : ""}
            onClick={() => changeCity(item)}
          >
            {item}
          </button>
        ))}
      </div>

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
            onChange={(e) => setDownPaymentPercent(e.target.value)}
          />
        </div>

        <div>
          <label>Broker Commission %</label>
          <input
            type="number"
            step="0.01"
            value={brokerRate}
            onChange={(e) => setBrokerRate(e.target.value)}
          />
        </div>

        <div>
          <label>Bank Valuation</label>
          <input
            type="number"
            value={valuation}
            onChange={(e) => setValuation(e.target.value)}
          />
        </div>

        <div>
          <label>Bank Processing / Admin</label>
          <input
            type="number"
            value={bankProcessing}
            onChange={(e) => setBankProcessing(e.target.value)}
          />
        </div>

        <div>
          <label>NOC / Developer Fees</label>
          <input
            type="number"
            value={noc}
            onChange={(e) => setNoc(e.target.value)}
          />
        </div>

        <div>
          <label>Other Fees</label>
          <input
            type="number"
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        </div>
      </div>

      <div className="breakdown">
        <h3>{city} Purchase Breakdown</h3>

        <CostRow
          label="Property Value"
          value={calculation.price}
        />

        <CostRow
          label={`Down Payment (${downPaymentPercent}%)`}
          value={calculation.downPayment}
        />

        <CostRow
          label="Bank Finance"
          value={calculation.financeAmount}
        />

        <CostRow
          label="Property Registration"
          value={calculation.registrationFee}
        />

        <CostRow
          label={`Broker Commission (${brokerRate}%)`}
          value={calculation.broker}
        />

        <CostRow
          label="VAT on Broker"
          value={calculation.brokerVat}
        />

        <CostRow
          label="Mortgage Registration"
          value={calculation.mortgageRegistration}
        />

        <CostRow
          label="Title Deed / Certificate"
          value={calculation.titleDeed}
        />

        <CostRow
          label="NOC / Developer"
          value={Number(noc || 0)}
        />

        <CostRow
          label="Bank Valuation"
          value={Number(valuation || 0)}
        />

        <CostRow
          label="Bank Processing / Admin"
          value={Number(bankProcessing || 0)}
        />

        <CostRow
          label="Other"
          value={Number(other || 0)}
        />

        <div className="total-row">
          <span>Additional Purchase Costs</span>
          <strong>{money(calculation.totalAdditionalCosts)}</strong>
        </div>

        <div className="grand-total">
          <div>
            <span>Cash Required Initially</span>
            <small>
              Down payment + purchase costs
            </small>
          </div>

          <strong>{money(calculation.totalCashRequired)}</strong>
        </div>
      </div>

      <div className="warning">
        <strong>Important:</strong> Fees shown here are estimates/default
        assumptions. Broker fees, NOC, bank valuation, bank processing,
        developer fees and some registration charges can vary by transaction.
        Confirm the final amount with the relevant authority, bank and
        developer before purchasing.
      </div>
    </div>
  );
}

function CostRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="cost-row">
      <span>{label}</span>
      <strong>{money(value)}</strong>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function UAEPropertyCalculator() {
  const [activeTab, setActiveTab] = useState<
    "area" | "loan" | "property"
  >("property");

  return (
    <div className="property-calculator">
      <div className="header">
        <h1>Property & Finance Calculator</h1>
        <p>
          Calculate property area, home finance and total purchase cost.
        </p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "property" ? "active" : ""}
          onClick={() => setActiveTab("property")}
        >
          🏠 Property Cost
        </button>

        <button
          className={activeTab === "loan" ? "active" : ""}
          onClick={() => setActiveTab("loan")}
        >
          💰 Loan Calculator
        </button>

        <button
          className={activeTab === "area" ? "active" : ""}
          onClick={() => setActiveTab("area")}
        >
          📐 Area Converter
        </button>
      </div>

      {activeTab === "property" && <PropertyCostCalculator />}
      {activeTab === "loan" && <LoanCalculator />}
      {activeTab === "area" && <AreaConverter />}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .property-calculator {
          max-width: 1050px;
          margin: 40px auto;
          padding: 24px;
          font-family: Inter, Arial, sans-serif;
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

        .header p {
          margin: 0;
          color: #697386;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tabs button,
        .city-selector button {
          border: 1px solid #d9dee8;
          background: white;
          padding: 12px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        .tabs button.active,
        .city-selector button.active {
          background: #172033;
          color: white;
          border-color: #172033;
        }

        .calculator-card {
          background: white;
          border: 1px solid #e3e7ef;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(30, 40, 60, 0.06);
        }

        .calculator-card h2 {
          margin-top: 0;
          margin-bottom: 6px;
        }

        .muted {
          color: #697386;
          margin-top: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin: 24px 0;
        }

        label {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
          font-weight: 600;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d9dee8;
          border-radius: 9px;
          font-size: 15px;
          outline: none;
        }

        input:focus {
          border-color: #7b8496;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .result-box {
          border: 1px solid #e5e9f0;
          background: #fafbfc;
          padding: 18px;
          border-radius: 12px;
        }

        .result-box span {
          display: block;
          font-size: 12px;
          color: #697386;
          margin-bottom: 8px;
        }

        .result-box strong {
          font-size: 19px;
        }

        .result-box.highlight {
          background: #eef6f2;
          border-color: #cfe3d9;
        }

        .formula {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          background: #f5f7fa;
          font-size: 13px;
          color: #596273;
        }

        .city-selector {
          display: flex;
          gap: 8px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .breakdown {
          margin-top: 30px;
        }

        .breakdown h3 {
          margin-bottom: 12px;
        }

        .cost-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #edf0f4;
        }

        .cost-row span {
          color: #596273;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
          padding: 16px;
          background: #f3f5f8;
          border-radius: 10px;
        }

        .grand-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding: 20px;
          border-radius: 12px;
          background: #172033;
          color: white;
        }

        .grand-total span {
          display: block;
          font-size: 16px;
          font-weight: 600;
        }

        .grand-total small {
          display: block;
          margin-top: 4px;
          opacity: 0.7;
        }

        .grand-total strong {
          font-size: 24px;
        }

        .warning {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          background: #fff8e6;
          border: 1px solid #f1dfac;
          color: #6b551d;
          font-size: 13px;
          line-height: 1.5;
        }

        @media (max-width: 700px) {
          .property-calculator {
            margin: 0;
            padding: 14px;
          }

          .form-grid,
          .result-grid {
            grid-template-columns: 1fr;
          }

          .calculator-card {
            padding: 18px;
          }

          .grand-total {
            gap: 15px;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}