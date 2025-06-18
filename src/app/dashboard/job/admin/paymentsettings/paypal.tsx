"use client";

import { useState, useEffect } from "react";
import { useCountryStore } from "@/app/job-portal-store/country";
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

export default function Paypal() {
  const [paypalStatus, setPaypalStatus] = useState("");
  const [paypalMode, setPaypalMode] = useState("");
  const [paypalCurrencyName, setPaypalCurrencyName] = useState("");
  const [paypalCurrencyRate, setPaypalCurrencyRate] = useState("");
  const [clientId, setClientId] = useState("");
  const [appId, setAppId] = useState("");
  const [countryid, setCountryid] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const { fetchCountriesPublic, countries } = useCountryStore();

  useEffect(() => {
    fetchCountriesPublic();
    fetchData();
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/paymentsettings`,
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        setPaypalStatus(data?.settings?.paypalStatus);
        setPaypalMode(data?.settings?.paypalMode);
        setPaypalCurrencyName(data?.settings?.paypalCurrencyName);
        setPaypalCurrencyRate(data?.settings?.paypalCurrencyRate);
        setClientId(data?.settings?.clientId);
        setSecretKey(data?.settings?.secretKey);
        setAppId(data?.settings?.appId);
        setCountryid(data?.settings?.countryid);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      paypalStatus,
      paypalMode,
      paypalCurrencyName,
      paypalCurrencyRate,
      clientId,
      secretKey,
      appId,
      countryid,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/paymentsettings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        toast.success("Form submitted successfully!");
        setPaypalStatus("");
        setPaypalMode("");
        setPaypalCurrencyName("");
        setPaypalCurrencyRate("");
        setClientId("");
        setSecretKey("");
        setAppId("");
        setCountryid("");
      } else {
        toast.error("Failed to submit form.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">PayPal Settings</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={paypalStatus}
              onChange={(e) => setPaypalStatus(e.target.value)}
            >
              <option value="">Select status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Mode</label>
            <select
              className="form-select"
              value={paypalMode}
              onChange={(e) => setPaypalMode(e.target.value)}
            >
              <option value="">Select mode</option>
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Country</label>
            <select
              className="form-select"
              value={countryid}
              onChange={(e) => setCountryid(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Currency</label>
            <select
              className="form-select"
              value={paypalCurrencyName}
              onChange={(e) => setPaypalCurrencyName(e.target.value)}
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Currency Rate</label>
            <input
              type="text"
              className="form-control"
              value={paypalCurrencyRate}
              onChange={(e) => setPaypalCurrencyRate(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Client ID</label>
            <input
              type="text"
              className="form-control"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Secret Key</label>
            <input
              type="text"
              className="form-control"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">App ID</label>
            <input
              type="text"
              className="form-control"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            />
          </div>

          <div className="col-12 mt-4 text-end">
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
