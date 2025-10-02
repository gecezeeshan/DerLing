import React, { useMemo, useState } from "react";
import "./WhatsApp.css";

const COUNTRIES = [
  { name: "UAE", code: "+971" },
  { name: "Pakistan", code: "+92" },
  { name: "India", code: "+91" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "USA", code: "+1" },
  { name: "UK", code: "+44" }
];

function sanitizeDigits(value) {
  return (value || "").replace(/\D+/g, "");
}

export default function WhatsAppQuickChat() {
  const [countryCode, setCountryCode] = useState("+971");
  const [rawNumber, setRawNumber] = useState("");
  const [message, setMessage] = useState("");

  const digitsOnly = useMemo(() => sanitizeDigits(rawNumber), [rawNumber]);

  const fullNumber = useMemo(() => {
    if (!digitsOnly) {
      return "";
    }

    if (digitsOnly.startsWith("0")) {
      const cc = sanitizeDigits(countryCode);
      return `${cc}${digitsOnly.slice(1)}`;
    }

    const cc = sanitizeDigits(countryCode);
    if (!digitsOnly.startsWith(cc) && digitsOnly.length <= 10) {
      return `${cc}${digitsOnly}`;
    }

    return digitsOnly;
  }, [digitsOnly, countryCode]);

  const isValid = fullNumber.length >= 7;

  const url = useMemo(() => {
    if (!isValid) {
      return "";
    }

    const base = `https://wa.me/${fullNumber}`;
    const query = message.trim()
      ? `?text=${encodeURIComponent(message.trim())}`
      : "";

    return `${base}${query}`;
  }, [fullNumber, message, isValid]);

  function openWhatsApp(event) {
    event.preventDefault();

    if (!isValid || !url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    if (!url) {
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      alert("Link copied to clipboard");
    } catch (error) {
      alert("Unable to copy the link. Please copy it manually.");
    }
  }

  return (
    <div className="whatsapp-page py-4 py-md-5">
      <div className="container">
        <div className="quick-chat-card card shadow-sm border-0 mx-auto">
          <div className="card-body">
            <header className="mb-4">
              <h1 className="h3 fw-semibold mb-2">WhatsApp Quick Chat</h1>
              <p className="text-muted mb-0 small">
                Type a phone number, optionally add a message, and jump straight to WhatsApp using <span className="font-monospace">wa.me</span>.
              </p>
            </header>

            <form onSubmit={openWhatsApp} className="quick-chat-form">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-5">
                  <label className="form-label">Country</label>
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    className="form-select form-select-lg"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-7">
                  <label className="form-label">Phone number</label>
                  <input
                    inputMode="tel"
                    placeholder="0503265487 or 971503265487"
                    value={rawNumber}
                    onChange={(event) => setRawNumber(event.target.value)}
                    className="form-control form-control-lg"
                  />
                  <div className="form-text">
                    We'll strip spaces and dashes automatically. A leading 0 is replaced with the selected country code.
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="form-label">Optional message</label>
                <textarea
                  rows={3}
                  placeholder="Hello!"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="form-control"
                />
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mt-4">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-dark btn-lg rounded-pill px-4"
                >
                  Open WhatsApp
                </button>

                <button
                  type="button"
                  disabled={!isValid}
                  onClick={copyLink}
                  className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                >
                  Copy wa.me Link
                </button>

                <div className="link-preview small text-muted">
                  {url ? (
                    <>
                      <strong className="text-dark me-2">Link:</strong>
                      <span className="text-break">{url}</span>
                    </>
                  ) : (
                    <span>Enter a valid number to generate the link.</span>
                  )}
                </div>
              </div>

              <div className="detected-number small text-muted mt-3">
                <span className="me-2 text-dark fw-semibold">Detected number:</span>
                <span className="font-monospace">{fullNumber || "..."}</span>
              </div>
            </form>

            <hr className="my-4" />

            <details className="quick-chat-details small text-muted">
              <summary className="details-summary fw-semibold">How it works</summary>
              <div className="pt-2">
                <p className="mb-2">
                  We generate a link in the format <span className="font-monospace">https://wa.me/&lt;number&gt;</span>. The number must contain digits only, include the country code, and must not start with a plus sign.
                </p>
                <p className="mb-0">
                  If you add a message, it is URL encoded and appended as <span className="font-monospace">?text=...</span>.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
