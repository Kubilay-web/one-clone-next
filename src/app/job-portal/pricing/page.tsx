"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
export default function Register() {
  const router = useRouter();

  const [price, setPrice] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/plan`,
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        console.log(data);
        setPrice(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redirectToCheckout = (id) => {
    router.push(`/job-portal/checkout/?id=${id}`);
  };

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-auto">
          <div className="col bg-light p-5 shadow">
            <section id="pricing" className="bg-white">
              <div className="container">
                <h2 className="text-center">PRICING</h2>
                <div className="spacer spacer-line border-primary">&nbsp;</div>
                <div className="spacer">&nbsp;</div>
                <div className="row">
                  {price.map((item) => (
                    <div className="col-md-4" key={item.id}>
                      <div className="pricing-table">
                        <div className="pricing-table-title">
                          <strong>
                            {" "}
                            {item.recommended ? (
                              <h4 className="badge badge-pill badge-success">
                                recommended
                              </h4>
                            ) : (
                              ""
                            )}{" "}
                          </strong>

                          <h5 className="pricing-title bg-info-hover text-white">
                            {item.leble}
                          </h5>
                        </div>
                        <div className="pricing-table-price bg-info text-center">
                          <p className="title-font">
                            <span className="pricing-currency text-white">
                              $
                            </span>
                            <span className="pricing-price text-white">
                              {item.price}
                            </span>
                          </p>
                        </div>
                        <div className="pricing-table-content">
                          <ul>
                            <li>
                              <strong>Job Limit: {item.joblimit}</strong>
                            </li>

                            <li>
                              <strong>
                                Featured Job Limit: {item.featuredjoblimit}
                              </strong>
                            </li>
                            <li>
                              <strong>
                                Highlight Job Limit: {item.highlightjoblimit}
                              </strong>
                            </li>
                            <li>
                              <strong>
                                Recommended:{" "}
                                {item.recommended ? (
                                  <FaCheck style={{ color: "green" }} />
                                ) : (
                                  <FaTimes style={{ color: "red" }} />
                                )}
                              </strong>
                            </li>

                            <li>
                              <strong>
                                Company Verify:{" "}
                                {item.profileverify ? (
                                  <FaCheck style={{ color: "green" }} />
                                ) : (
                                  <FaTimes style={{ color: "red" }} />
                                )}
                              </strong>
                            </li>
                          </ul>
                          <div className="pricing-table-button">
                            <button
                              onClick={() => redirectToCheckout(item.id)}
                              className="btn btn-primary mr-2"
                            >
                              <span>Buy plan</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
