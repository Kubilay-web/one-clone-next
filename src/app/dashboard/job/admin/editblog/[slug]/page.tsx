"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";

const UpdateBlog = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const slug = params?.slug;

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/${slug}`,
    );
    const data = await res.json();

    setTitle(data?.title);
    setDescription(data?.description);
    setImage(data?.image);
    setImagePreview(data?.image);
  };

  const handleUploadSuccess = (result) => {
    console.log("Upload Result:", result);
    const secureUrl = result?.info?.secure_url;
    if (secureUrl) {
      setImage(secureUrl);
      setImagePreview(secureUrl);
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("Failed to retrieve image URL.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/${slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.err || "An error occurred.");
    } else {
      toast.success("Blog updated successfully!");
      router.push("/dashboard/job/admin/blogs");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Update Blog</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Title */}
        <div className="form-group">
          <label style={{ fontWeight: "bold", color: "#343a40" }}>Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label style={{ fontWeight: "bold", color: "#343a40" }}>
            Description
          </label>
          <textarea
            className="form-control"
            placeholder="Enter blog description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Image Upload via Cloudinary Widget */}
        <div className="form-group">
          <label style={{ fontWeight: "bold", color: "#343a40" }}>Image</label>
          <CldUploadWidget
            cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="btn btn-primary"
              >
                Upload Image
              </button>
            )}
          </CldUploadWidget>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={imagePreview}
                alt="Image Preview"
                style={{
                  maxHeight: "200px",
                  borderRadius: "0.3rem",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            color: "white",
            backgroundColor: "#007bff",
            borderColor: "#007bff",
            transition: "background-color 0.3s, border-color 0.3s",
          }}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateBlog;
