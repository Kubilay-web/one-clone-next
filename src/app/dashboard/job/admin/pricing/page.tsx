"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const [leble, setLable] = useState("");
  const [price, setPrice] = useState("");
  const [joblimit, setPjobLimit] = useState("");
  const [featuredjoblimit, setFeaturedJobLimit] = useState("");
  const [highlightjoblimit, setHighlightJobLimit] = useState("");
  const [recommended, setRecommended] = useState("");
  const [frontendshow, setFrontendShow] = useState("");
  const [profileverify, setProfileVerify] = useState("");
  const [home, setHome] = useState("");
  const [listprice, setListPrice] = useState([]);

  // Edit modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan`,
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        setListPrice(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leble,
            price,
            joblimit,
            featuredjoblimit,
            highlightjoblimit,
            recommended: recommended === "true",
            frontendshow: frontendshow === "true",
            profileverify: profileverify === "true",
            home: home === "true",
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Successfully plan created");
        // Temizle formu istersen burada
        setLable("");
        setPrice("");
        setPjobLimit("");
        setFeaturedJobLimit("");
        setHighlightJobLimit("");
        setRecommended("");
        setFrontendShow("");
        setProfileVerify("");
        setHome("");
        fetchData();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/plan/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Successfully deleted");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    // Checkbox değerlerini boolean olarak set et
    setEditedItem({
      ...item,
      recommended: item.recommended ? "true" : "false",
      frontendshow: item.frontendshow ? "true" : "false",
      profileverify: item.profileverify ? "true" : "false",
      home: item.home ? "true" : "false",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditedItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedItem) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/plan/${editedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editedItem,
            recommended: editedItem.recommended === "true",
            frontendshow: editedItem.frontendshow === "true",
            profileverify: editedItem.profileverify === "true",
            home: editedItem.home === "true",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Data updated successfully");
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-auto">
          <div className="col p-5 shadow">
            <h2 className="mb-4 text-center">Add Pricing System</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <label>Label</label>
                  <input
                    type="text"
                    value={leble}
                    onChange={(e) => setLable(e.target.value)}
                    className="form-control mb-4"
                    placeholder="Enter label"
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label>Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control mb-4"
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label>Job Limit</label>
                  <input
                    type="number"
                    value={joblimit}
                    onChange={(e) => setPjobLimit(e.target.value)}
                    className="form-control mb-4"
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label>Featured Job Limit</label>
                  <input
                    type="number"
                    value={featuredjoblimit}
                    onChange={(e) => setFeaturedJobLimit(e.target.value)}
                    className="form-control mb-4"
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label>Highlight Job Limit</label>
                  <input
                    type="number"
                    value={highlightjoblimit}
                    onChange={(e) => setHighlightJobLimit(e.target.value)}
                    className="form-control mb-4"
                    required
                  />
                </div>
                <div className="col-lg-6">
                  <label>Recommended</label>
                  <select
                    value={recommended}
                    onChange={(e) => setRecommended(e.target.value)}
                    className="form-control mb-4"
                    required
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="col-lg-6">
                  <label>Frontend Show</label>
                  <select
                    value={frontendshow}
                    onChange={(e) => setFrontendShow(e.target.value)}
                    className="form-control mb-4"
                    required
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="col-lg-6">
                  <label>Profile Verify</label>
                  <select
                    value={profileverify}
                    onChange={(e) => setProfileVerify(e.target.value)}
                    className="form-control mb-4"
                    required
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="col-lg-6">
                  <label>Display Home</label>
                  <select
                    value={home}
                    onChange={(e) => setHome(e.target.value)}
                    className="form-control mb-4"
                    required
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Add Price"}
              </button>
            </form>

            {/* Price list */}
            <section id="pricing" className="mt-5 bg-white">
              <h2 className="mb-4 text-center">PRICING</h2>

              <div className="row">
                {listprice.map((item) => (
                  <div className="col-md-4 mb-4" key={item._id}>
                    <div className="pricing-table rounded border p-3">
                      <div className="pricing-table-title mb-3">
                        {item.recommended && (
                          <span className="badge bg-success me-1">
                            Recommended
                          </span>
                        )}
                        {item.home && (
                          <span className="badge bg-info me-1">Home</span>
                        )}
                        {item.frontendshow && (
                          <span className="badge bg-warning text-dark me-1">
                            Frontend Show
                          </span>
                        )}
                        <h5 className="mt-2">{item.leble}</h5>
                      </div>
                      <div className="pricing-table-price mb-3 rounded bg-primary py-3 text-center text-white">
                        <p className="fs-3 mb-0">${item.price}</p>
                      </div>
                      <ul className="list-unstyled">
                        <li>Job Limit: {item.joblimit}</li>
                        <li>Featured Job Limit: {item.featuredjoblimit}</li>
                        <li>Highlight Job Limit: {item.highlightjoblimit}</li>
                        <li>
                          Recommended:{" "}
                          {item.recommended ? (
                            <FaCheck style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </li>
                        <li>
                          Frontend Show:{" "}
                          {item.frontendshow ? (
                            <FaCheck style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </li>
                        <li>
                          Profile Verify:{" "}
                          {item.profileverify ? (
                            <FaCheck style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </li>
                      </ul>
                      <div className="d-flex justify-content-between">
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn btn-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Edit Modal */}
            {isModalOpen && editedItem && (
              <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Plan</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCloseModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSave();
                        }}
                      >
                        <div className="mb-3">
                          <label className="form-label">Label</label>
                          <input
                            type="text"
                            className="form-control"
                            name="leble"
                            value={editedItem.leble}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Price</label>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={editedItem.price}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Job Limit</label>
                          <input
                            type="number"
                            className="form-control"
                            name="joblimit"
                            min="0"
                            value={editedItem.joblimit}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Featured Job Limit
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="featuredjoblimit"
                            min="0"
                            value={editedItem.featuredjoblimit}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Highlight Job Limit
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="highlightjoblimit"
                            min="0"
                            value={editedItem.highlightjoblimit}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="row mb-3">
                          <div className="col">
                            <label className="form-label">Recommended</label>
                            <select
                              className="form-select"
                              name="recommended"
                              value={editedItem.recommended}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </div>
                          <div className="col">
                            <label className="form-label">Frontend Show</label>
                            <select
                              className="form-select"
                              name="frontendshow"
                              value={editedItem.frontendshow}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </div>
                          <div className="col">
                            <label className="form-label">Profile Verify</label>
                            <select
                              className="form-select"
                              name="profileverify"
                              value={editedItem.profileverify}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </div>
                          <div className="col">
                            <label className="form-label">Display Home</label>
                            <select
                              className="form-select"
                              name="home"
                              value={editedItem.home}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </div>
                        </div>

                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
