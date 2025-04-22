"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Instagram, Facebook, Linkedin, MessageSquare } from "lucide-react";

// Define the form schema using Zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function WaitList() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      reset();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-950 to-blue-900 px-4 py-20">
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* Glowing Orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500 opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-center">
        {/* Headline with Gradient Effect */}
        <div className="relative">
          <h1 className="animate-gradient mb-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Join Our Product
            <br />
            Launch Waitlist
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 bg-clip-text text-5xl font-bold text-transparent opacity-50 blur-lg md:text-6xl">
            Join Our Product
            <br />
            Launch Waitlist
          </div>
        </div>

        <p className="mb-12 text-xl leading-relaxed text-gray-400 md:text-2xl">
          Be part of something truly extraordinary. Join thousands of others
          already gaining early access to our revolutionary new product.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-12 space-y-4">
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <div className="max-w-md flex-grow">
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full rounded-lg border bg-blue-800/20 px-6 py-4 text-white placeholder-gray-400 backdrop-blur-sm ${errors.email ? "border-red-500" : "border-blue-700/50"} transition-colors focus:border-blue-500 focus:outline-none`}
                disabled={isSubmitting || isSubmitSuccessful}
              />
              {errors.email && (
                <div className="mt-2 text-left text-sm text-red-500">
                  {errors.email.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
              className={`rounded-lg bg-black px-8 py-4 font-semibold text-white transition-all ${isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-gray-900"} ${isSubmitSuccessful ? "bg-green-600 hover:bg-green-600" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </span>
              ) : isSubmitSuccessful ? (
                "Thanks for joining! ✓"
              ) : (
                "Get Notified"
              )}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {isSubmitSuccessful && (
          <div className="animate-fade-in text-lg text-green-400">
            We will notify you when we launch!
          </div>
        )}

        {/* Waitlist Counter */}
        <div className="mb-12 flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-semibold text-white ring-2 ring-blue-900">
              JD
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white ring-2 ring-blue-900">
              AS
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white ring-2 ring-blue-900">
              MK
            </div>
          </div>
          <span className="ml-4 text-gray-400">
            100+ people on the waitlist
          </span>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-300"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-300"
          >
            <MessageSquare className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-300"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 transition-colors hover:text-gray-300"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Add keyframe animations
const style = document.createElement("style");
style.textContent = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 8s linear infinite;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
