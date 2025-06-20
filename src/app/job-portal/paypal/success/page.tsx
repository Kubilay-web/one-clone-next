"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PaymentSuccess = ({ searchParams }) => {
  const token = searchParams.token;
  const PayerID = searchParams.PayerID;

  const [isSuccessHandled, setIsSuccessHandled] = useState(false);

  useEffect(() => {
    handlesuccess();
  }, [searchParams]);

  const handlesuccess = async () => {
    if (isSuccessHandled) return; // Eğer işlem zaten yapıldıysa, tekrar yapma

    setIsSuccessHandled(true); // İşlem yapıldığı bilgisini set et

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/success`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            PayerID,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        console.log(data.err);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const containerStyle = {
    marginTop: "50px",
  };

  const animatedBoxStyle = {
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    animation: "fadeInUp 1s ease-in-out",
  };

  const checkmarkStyle = {
    fontSize: "4rem",
    color: "green",
    marginTop: "20px",
    animation: "bounce 1s ease-in-out infinite",
  };

  return (
    <div className="container" style={containerStyle}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 text-center">
          <div style={animatedBoxStyle}>
            <h1 className="display-4">Ödeme Başarılı!</h1>
            <p className="lead">
              Ödemeniz başarılı bir şekilde alınmıştır. Teşekkür ederiz.
            </p>
            <div style={checkmarkStyle}>✔</div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
