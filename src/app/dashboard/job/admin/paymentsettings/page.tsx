"use client";
import { useState, useEffect } from "react";
import Paypal from "./paypal";
import Stripe from "./stripe";
import Razorpay from "./razorpay";

export default function PaymentSettings() {
  const [activeTab, setActiveTab] = useState("v-pills-home");

  useEffect(() => {
    const savedActiveTab = localStorage.getItem("activeTab");
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }

    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab", tabId);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 bg-light rounded p-4 shadow">
          <h2 className="mb-4 text-center">Payment Settings</h2>
          <div className="row flex-column flex-md-row">
            {/* Sidebar */}
            <div className="col-md-3 mb-md-0 mb-3">
              <div
                className="nav flex-md-column nav-pills w-100"
                role="tablist"
              >
                {[
                  { id: "v-pills-home", label: "Paypal Account" },
                  { id: "v-pills-profile", label: "Stripe Account" },
                  { id: "v-pills-messages", label: "Razorpay Account" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-link btn btn-outline-primary mb-2 text-start ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="col-md-9">
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${activeTab === "v-pills-home" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <Paypal />
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "v-pills-profile" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <Stripe />
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "v-pills-messages" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <Razorpay />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
