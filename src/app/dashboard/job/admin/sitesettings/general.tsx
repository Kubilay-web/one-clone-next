"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
  "NOK",
  "KRW",
  "MXN",
  "SGD",
  "HKD",
  "INR",
  "RUB",
  "ZAR",
  "BRL",
  "TRY",
  "TWD",
  "DKK",
  "PLN",
  "THB",
  "IDR",
  "HUF",
  "CZK",
  "ILS",
  "CLP",
  "PHP",
  "AED",
  "COP",
  "SAR",
  "MYR",
  "RON",
  "VND",
  "ARS",
  "IQD",
  "KWD",
  "NGN",
  "UAH",
  "EGP",
  "PKR",
  "OMR",
  "QAR",
  "KES",
  "BDT",
  "MAD",
  "VUV",
  "SCR",
  "UZS",
  "LKR",
  "JOD",
  "GTQ",
  "BOB",
  "HRK",
  "DZD",
  "TND",
  "UYU",
  "PYG",
  "NPR",
  "AFN",
  "GEL",
  "MNT",
  "ETB",
  "LBP",
  "BHD",
  "JMD",
  "CUC",
  "LYD",
  "TTD",
  "XAF",
  "XOF",
  "NAD",
  "BND",
  "SZL",
  "GIP",
  "BWP",
  "FJD",
  "DJF",
  "CVE",
  "BSD",
  "GYD",
  "YER",
  "HTG",
  "BIF",
  "SYP",
  "MVR",
  "MKD",
  "RSD",
];

const currencySymbols = [
  "$",
  "€",
  "£",
  "¥",
  "¥",
  "$",
  "$",
  "Fr.",
  "HK$",
  "NZ$",
  "₩",
  "$",
  "kr",
  "kr",
  "$",
  "₹",
  "₽",
  "R",
  "R$",
  "₺",
  "NT$",
  "kr",
  "zł",
  "฿",
  "Rp",
  "Ft",
  "Kč",
  "₪",
  "$",
  "₱",
  "د.إ",
  "$",
  "﷼",
  "RM",
  "lei",
  "₫",
  "$",
  "₦",
  "£",
  "₨",
  "ع.د",
  "د.ك",
  "﷼",
  "₴",
  "BD",
  "ر.ع.",
  "Ksh",
  "USh",
];

export default function Paypal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [default_currency, setDefault_currency] = useState("");
  const [currency_icon, setCurrency_icon] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/sitesettings`,
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        setName(data?.settings?.name || "");
        setEmail(data?.settings?.email || "");
        setPhone(data?.settings?.phone || "");
        setDefault_currency(data?.settings?.default_currency || "");
        setCurrency_icon(data?.settings?.currency_icon || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, phone, default_currency, currency_icon };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/sitesettings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        toast.success("Save settings!");
        setName("");
        setEmail("");
        setPhone("");
        setDefault_currency("");
        setCurrency_icon("");

        fetchData();
      } else {
        toast.error("Form not send!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Site Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="siteName" className="form-label">
              Site Name
            </label>
            <input
              id="siteName"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="siteEmail" className="form-label">
              Site Mail
            </label>
            <input
              id="siteEmail"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="sitePhone" className="form-label">
              Telephone
            </label>
            <input
              id="sitePhone"
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="currencyIcon" className="form-label">
              Currency Icon
            </label>
            <select
              id="currencyIcon"
              className="form-select"
              value={currency_icon}
              onChange={(e) => setCurrency_icon(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {currencySymbols.map((symbol, index) => (
                <option key={index} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="defaultCurrency" className="form-label">
              Default Currency
            </label>
            <select
              id="defaultCurrency"
              className="form-select"
              value={default_currency}
              onChange={(e) => setDefault_currency(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Save
        </button>
      </form>
    </div>
  );
}
