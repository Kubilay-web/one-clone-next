"use client";
import { useEffect, useState } from "react";
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

export default function Razorpay() {
  const [razorpaycountryid, setRazorpayCountryid] = useState("");
  const [razorpayStatus, setRazorpayStatus] = useState("");
  const [razorpayCurrencyRate, setRazorpayCurrencyRate] = useState("");
  const [razorpayCurrencyName, setRazorpayCurrencyName] = useState("");
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");

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
        setRazorpayStatus(data?.settings?.razorpayStatus || "");
        setRazorpayCurrencyRate(data?.settings?.razorpayCurrencyRate || "");
        setRazorpayCurrencyName(data?.settings?.razorpayCurrencyName || "");
        setRazorpayKeyId(data?.settings?.razorpayKeyId || "");
        setRazorpayKeySecret(data?.settings?.razorpayKeySecret || "");
        setRazorpayCountryid(data?.settings?.razorpaycountryid || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = {
      razorpayStatus,
      razorpayCurrencyName,
      razorpayCurrencyRate,
      razorpayKeyId,
      razorpayKeySecret,
      razorpaycountryid,
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
        setRazorpayStatus("");
        setRazorpayCurrencyName("");
        setRazorpayCurrencyRate("");
        setRazorpayKeyId("");
        setRazorpayKeySecret("");
        setRazorpayCountryid("");
      } else {
        toast.error("Failed to submit form.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3">
      <h4 className="mb-4">Razorpay Settings</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={razorpayStatus}
              onChange={(e) => setRazorpayStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Country</label>
            <select
              className="form-select"
              value={razorpaycountryid}
              onChange={(e) => setRazorpayCountryid(e.target.value)}
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
              value={razorpayCurrencyName}
              onChange={(e) => setRazorpayCurrencyName(e.target.value)}
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
              value={razorpayCurrencyRate}
              onChange={(e) => setRazorpayCurrencyRate(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Razorpay Key ID</label>
            <input
              type="text"
              className="form-control"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Razorpay Key Secret</label>
            <input
              type="text"
              className="form-control"
              value={razorpayKeySecret}
              onChange={(e) => setRazorpayKeySecret(e.target.value)}
            />
          </div>

          <div className="col-12 mt-4 text-end">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
