import React, { useState } from "react";
import { apiCall, API_BASE_URL } from "../config/api";

interface WaitlistSignupProps {
  compact?: boolean; // For embedding in homepage vs standalone page
}

interface SignupData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function WaitlistSignup({ compact = false }: WaitlistSignupProps) {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<SignupData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name as keyof SignupData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<SignupData> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Only send non-empty optional fields
      const payload: SignupData = {
        email: formData.email,
      };

      if (formData.firstName?.trim()) {
        payload.firstName = formData.firstName.trim();
      }

      if (formData.lastName?.trim()) {
        payload.lastName = formData.lastName.trim();
      }

      const response = await apiCall(`${API_BASE_URL}/api/subscribe`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({ email: "", firstName: "", lastName: "" });
      } else {
        setError(response.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      console.error("Subscription error:", err);

      // Handle specific error cases
      if (err.message.includes("409")) {
        setError("This email is already subscribed to our waitlist");
      } else if (err.message.includes("400")) {
        setError("Please check your information and try again");
      } else {
        setError("Unable to subscribe. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Compact version for homepage
  if (compact) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        {success ? (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  You're on the list! We'll notify you when (and if) we launch.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${formErrors.email ? "border-red-300" : "border-gray-300"
                  }`}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </div>

            {formErrors.email && (
              <p className="text-sm text-red-600">{formErrors.email}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  // Full version for standalone page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Join the Waitlist
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Be the first to know when the site is open for business. We will never share or sell your information.
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 p-6 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">
                  You're on the list!
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  We'll send you an email notification as soon as we launch.
                  Thank you for your interest in Sharon Wisely Jewelry!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              {/* Email - Required */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm ${formErrors.email ? "border-red-300" : "border-gray-300"
                    }`}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* First Name - Optional */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Sharon"
                />
              </div>

              {/* Last Name - Optional */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Wisely"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Joining waitlist..." : "Join Waitlist"}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500">
              We respect your privacy. Your email will only be used to notify
              you about our launch.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
