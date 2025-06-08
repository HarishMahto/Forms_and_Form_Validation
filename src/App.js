import React, { useState } from "react";
import "./App.css";

// Country and city data
const countries = [
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "UK", name: "United Kingdom", dialCode: "+44" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
];

const citiesByCountry = {
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
  UK: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
};

const App = () => {
  const [currentRoute, setCurrentRoute] = useState("form");
  const [submittedData, setSubmittedData] = useState(null);

  const navigateToSuccess = (data) => {
    setSubmittedData(data);
    setCurrentRoute("success");
  };

  const navigateToForm = () => {
    setCurrentRoute("form");
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentRoute === "form" && (
        <RegistrationForm onSubmitSuccess={navigateToSuccess} />
      )}
      {currentRoute === "success" && (
        <SuccessPage data={submittedData} onBack={navigateToForm} />
      )}
    </div>
  );
};

const RegistrationForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    countryCode: "",
    phoneNumber: "",
    country: "",
    city: "",
    panNumber: "",
    aadharNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!formData.countryCode)
      newErrors.countryCode = "Country code is required";
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = "PAN number is required";
    } else if (!validatePAN(formData.panNumber.toUpperCase())) {
      newErrors.panNumber =
        "Please enter a valid PAN number (e.g., ABCDE1234F)";
    }
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!validateAadhar(formData.aadharNumber)) {
      newErrors.aadharNumber = "Please enter a valid 12-digit Aadhar number";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear city when country changes
    if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
        city: "",
      }));
    }

    // Real-time validation
    if (touched[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      // Format data for display
      const selectedCountry = countries.find(
        (c) => c.code === formData.country
      );
      const submissionData = {
        ...formData,
        countryName: selectedCountry?.name,
        dialCode: selectedCountry?.dialCode,
        panNumber: formData.panNumber.toUpperCase(),
      };
      onSubmitSuccess(submissionData);
    } else {
      setErrors(formErrors);
      setTouched(
        Object.keys(formData).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    }
  };

  const isFormValid = () => {
    const formErrors = validateForm();
    return Object.keys(formErrors).length === 0;
  };

  const getAvailableCities = () => {
    return formData.country ? citiesByCountry[formData.country] || [] : [];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="fs text-3xl font-bold text-blue-600 mb-8 text-center">
          User Registration
        </h1>

        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.firstName ? "error" : ""}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.lastName ? "error" : ""}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Username and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.username ? "error" : ""}`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input password-input ${
                  errors.password ? "error" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <div className="phone-container">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`country-code-select ${
                  errors.countryCode ? "error" : ""
                }`}
              >
                <option value="">Code</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.dialCode}>
                    {country.dialCode}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`phone-input ${errors.phoneNumber ? "error" : ""}`}
                placeholder="Enter 10-digit number"
              />
            </div>
            {(errors.countryCode || errors.phoneNumber) && (
              <span className="error-message">
                {errors.countryCode || errors.phoneNumber}
              </span>
            )}
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.country ? "error" : ""}`}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="error-message">{errors.country}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.city ? "error" : ""}`}
                disabled={!formData.country}
              >
                <option value="">Select City</option>
                {getAvailableCities().map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>
          </div>

          {/* PAN and Aadhar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">PAN Number *</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.panNumber ? "error" : ""}`}
                placeholder="ABCDE1234F"
                maxLength="10"
              />
              {errors.panNumber && (
                <span className="error-message">{errors.panNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Aadhar Number *</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input ${errors.aadharNumber ? "error" : ""}`}
                placeholder="123456789012"
                maxLength="12"
              />
              {errors.aadharNumber && (
                <span className="error-message">{errors.aadharNumber}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`submit-button ${!isFormValid() ? "disabled" : ""}`}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = ({ data, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="success-icon">
            <img
              src="https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"
              height={350}
              width={600}
              alt="Profile"
            />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-600">
            Your account has been created successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Registration Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="detail-item">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">
                {data.firstName} {data.lastName}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{data.username}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{data.email}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">
                {data.dialCode} {data.phoneNumber}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Country:</span>
              <span className="detail-value">{data.countryName}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">City:</span>
              <span className="detail-value">{data.city}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">PAN Number:</span>
              <span className="detail-value">{data.panNumber}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Aadhar Number:</span>
              <span className="detail-value">
                ****-****-{data.aadharNumber.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={onBack} className="back-button">
            Register Another User
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
