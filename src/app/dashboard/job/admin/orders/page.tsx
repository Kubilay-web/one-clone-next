"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Orders() {
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/orders`,
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        console.log(data);
        setTransactions(data);
        setFilteredTransactions(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (e) => {
    const keyward = e.target.value.toLowerCase();

    const filtered = transactions.filter(
      (t) =>
        t.package_name.toLowerCase().includes(keyward) ||
        t.payment_provider.toLowerCase().includes(keyward) ||
        t.transaction_id.toLowerCase().includes(keyward) ||
        t.order_id.toLowerCase().includes(keyward) ||
        t.amount.toLowerCase().includes(keyward) ||
        t.paid_in_currency.toLowerCase().includes(keyward) ||
        t.default_amount.toLowerCase().includes(keyward) ||
        new Date(t.createdAt).toLocaleDateString().includes(keyward) ||
        new Date(t.updatedAt).toLocaleDateString().includes(keyward),
    );

    setFilteredTransactions(filtered);
  };

  const handleShowDetails = (id) => {
    router.push(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/admin/orders/details/?id=${id}`,
    );
  };

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-auto">
          <div className="col p-5 shadow">
            <h2 className="mb-4 text-center">All orders</h2>

            <div className="container">
              <input
                type="text"
                style={{ outline: "none" }}
                className="mb-3"
                placeholder="Search..."
                onChange={handleFilter}
              />
              <div className="table-responsive">
                <table className="table-bordered table">
                  <thead
                    style={{ fontWeight: "bold" }}
                    className="font-weight-bold"
                  >
                    <tr className="font-weight-bold">
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Package Name
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Payment Provider
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Transaction ID
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Order ID
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Paid in Currency
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Default Amount
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Payment Status
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Created At
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Updated At
                      </th>
                      <th
                        style={{
                          padding: "12px 15px",
                          backgroundColor: "#f2f2f2",
                          fontWeight: "bold",
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.package_name}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.payment_provider}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.transaction_id}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.order_id}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.amount}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.paid_in_currency}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.default_amount}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {transaction.payment_status}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {new Date(transaction.createdAt).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "left",
                          }}
                        >
                          {new Date(transaction.updatedAt).toLocaleString()}
                        </td>
                        <td>
                          <button
                            style={{
                              marginRight: "8px",
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "4px",
                            }}
                            className="btn btn-primary btn-sm button1 button2 bu"
                            onClick={() =>
                              handleShowDetails(transaction.order_id)
                            }
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
