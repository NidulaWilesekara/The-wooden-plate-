import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layout/customerLayout";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:8000";

const ReservationPage = () => {
  const navigate = useNavigate();
  const { customer, token, isAuthenticated, login, checkEmail, sendOTP, verifyOTP, register } = useCustomerAuth();

  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Table, 2: Fill Form, 3: Success

  // Tables state
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  // Filter states for availability check
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterDuration, setFilterDuration] = useState("2"); // hours
  const [filterGuests, setFilterGuests] = useState("2");

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState("email"); // email, register, otp
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
  });

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(null);

  // Time slots
  const timeSlots = useMemo(
    () => [
      { display: "10:00 AM", value: "10:00" },
      { display: "10:30 AM", value: "10:30" },
      { display: "11:00 AM", value: "11:00" },
      { display: "11:30 AM", value: "11:30" },
      { display: "12:00 PM", value: "12:00" },
      { display: "12:30 PM", value: "12:30" },
      { display: "01:00 PM", value: "13:00" },
      { display: "01:30 PM", value: "13:30" },
      { display: "02:00 PM", value: "14:00" },
      { display: "02:30 PM", value: "14:30" },
      { display: "05:00 PM", value: "17:00" },
      { display: "05:30 PM", value: "17:30" },
      { display: "06:00 PM", value: "18:00" },
      { display: "06:30 PM", value: "18:30" },
      { display: "07:00 PM", value: "19:00" },
      { display: "07:30 PM", value: "19:30" },
      { display: "08:00 PM", value: "20:00" },
      { display: "08:30 PM", value: "20:30" },
      { display: "09:00 PM", value: "21:00" },
    ],
    []
  );

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Calculate end time based on duration
  const getEndTime = (startTime, durationHours) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + parseInt(durationHours);
    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // Fetch available tables
  const fetchAvailableTables = async () => {
    if (!filterDate || !filterTime) {
      // Just fetch all tables if no filters
      try {
        const response = await fetch(`${API_BASE}/api/public/tables`);
        const data = await response.json();
        if (data.success) {
          setTables(data.data.map((t) => ({ ...t, available: true })));
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      } finally {
        setLoadingTables(false);
      }
      return;
    }

    setLoadingTables(true);
    try {
      const endTime = getEndTime(filterTime, filterDuration);
      const params = new URLSearchParams({
        date: filterDate,
        start_time: filterTime,
        end_time: endTime,
        party_size: filterGuests,
      });

      const response = await fetch(`${API_BASE}/api/public/tables/available?${params}`);
      const data = await response.json();

      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch available tables:", error);
    } finally {
      setLoadingTables(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAvailableTables();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    if (filterDate && filterTime) {
      fetchAvailableTables();
      setSelectedTable(null); // Reset selection when filters change
    }
  }, [filterDate, filterTime, filterDuration, filterGuests]);

  // Auto-fill form when authenticated
  useEffect(() => {
    if (isAuthenticated() && customer) {
      setForm((prev) => ({
        ...prev,
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
      }));
    }
  }, [customer, isAuthenticated]);

  // Handle table selection
  const handleSelectTable = (table) => {
    if (!table.available) return;
    setSelectedTable(table);
    setCurrentStep(2);
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  // Handle auth form change
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
    setAuthError("");
  };

  // Step 1: Check if email exists - if yes, login directly; if no, go to register
  const handleCheckEmail = async () => {
    if (!authForm.email) {
      setAuthError("Please enter your email");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      // Try to login directly (for existing customers)
      const loginResult = await login({ email: authForm.email });

      if (loginResult.success) {
        // Existing customer - logged in successfully!
        setShowAuthModal(false);
        setAuthStep("email");
        setAuthForm({ name: "", email: "", phone: "", otp: "" });
      } else {
        // Customer doesn't exist - go to register step
        setAuthStep("register");
      }
    } catch (error) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Step 2: Register new customer and send OTP
  const handleRegisterAndSendOTP = async () => {
    if (!authForm.name || !authForm.email || !authForm.phone) {
      setAuthError("Please fill all fields");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      // Register first
      const registerResult = await register({
        name: authForm.name,
        email: authForm.email,
        phone: authForm.phone,
      });

      if (!registerResult.success && !registerResult.message?.includes("already")) {
        setAuthError(registerResult.message || "Registration failed");
        setAuthLoading(false);
        return;
      }

      // Send OTP for verification
      const otpResult = await sendOTP({ email: authForm.email });

      if (otpResult.success) {
        setAuthStep("otp");
      } else {
        setAuthError(otpResult.message || "Failed to send OTP");
      }
    } catch (error) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!authForm.otp) {
      setAuthError("Please enter the OTP");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const result = await verifyOTP({
        email: authForm.email,
        otp: authForm.otp,
      });

      if (result.success) {
        setShowAuthModal(false);
        setAuthStep("login");
        setAuthForm({ name: "", email: "", phone: "", otp: "" });
      } else {
        setAuthError(result.message || "Invalid OTP");
      }
    } catch (error) {
      setAuthError("Failed to verify OTP. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle reservation submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }

    // Validate
    if (!selectedTable || !filterDate || !filterTime) {
      setSubmitError("Please select a table, date, and time");
      return;
    }

    if (!form.name || !form.email || !form.phone) {
      setSubmitError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const endTime = getEndTime(filterTime, filterDuration);

      const response = await fetch(`${API_BASE}/api/public/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table_id: selectedTable.id,
          party_size: parseInt(filterGuests),
          reservation_date: filterDate,
          start_time: filterTime,
          end_time: endTime,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_notes: form.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReservationSuccess(data.data);
        setCurrentStep(3);
      } else {
        setSubmitError(data.message || "Failed to create reservation");
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setSubmitError("Failed to create reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter tables by guest capacity
  const filteredTables = useMemo(() => {
    const guestCount = parseInt(filterGuests) || 1;
    return tables.filter((table) => table.chair_count >= guestCount);
  }, [tables, filterGuests]);

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#0F0A08] text-[#E7D2B6]">
        {/* Hero Banner */}
        <div className="relative h-[300px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A08] via-[#0F0A08]/70 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#C98A5A] mb-4">
                Reserve a Table
              </h1>
              <p className="text-[#BFA58A] text-lg max-w-xl mx-auto px-4">
                Choose your preferred table, date and time for an unforgettable dining experience
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? "bg-[#C98A5A] text-[#0F0A08]"
                        : "bg-[#1A110D] text-[#BFA58A] border border-[#8B5A2B]/40"
                    }`}
                  >
                    {currentStep > step ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 md:w-24 h-1 rounded transition-all ${
                        currentStep > step ? "bg-[#C98A5A]" : "bg-[#8B5A2B]/30"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-center gap-8 md:gap-16 mb-12 text-sm">
            <span className={currentStep >= 1 ? "text-[#C98A5A]" : "text-[#BFA58A]/60"}>Select Table</span>
            <span className={currentStep >= 2 ? "text-[#C98A5A]" : "text-[#BFA58A]/60"}>Your Details</span>
            <span className={currentStep >= 3 ? "text-[#C98A5A]" : "text-[#BFA58A]/60"}>Confirmation</span>
          </div>

          {/* Step 1: Select Table */}
          {currentStep === 1 && (
            <div>
              {/* Filters */}
              <div className="rounded-3xl border border-[#8B5A2B]/40 bg-[#1A110D] p-6 mb-8">
                <h3 className="text-xl font-semibold text-[#E7D2B6] mb-6">Select Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">Date *</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      min={getMinDate()}
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">Time *</label>
                    <select
                      value={filterTime}
                      onChange={(e) => setFilterTime(e.target.value)}
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.display}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">Duration</label>
                    <select
                      value={filterDuration}
                      onChange={(e) => setFilterDuration(e.target.value)}
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours (Max)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">Guests</label>
                    <select
                      value={filterGuests}
                      onChange={(e) => setFilterGuests(e.target.value)}
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} Guest{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tables Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#E7D2B6] mb-6">
                  {filterDate && filterTime ? "Available Tables" : "Our Tables"}
                </h3>

                {loadingTables ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-10 h-10 border-4 border-[#C98A5A] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[#BFA58A]">Loading tables...</p>
                  </div>
                ) : filteredTables.length === 0 ? (
                  <div className="text-center py-12 bg-[#1A110D] rounded-3xl border border-[#8B5A2B]/40">
                    <p className="text-[#BFA58A] text-lg">No tables available for {filterGuests} guests</p>
                    <p className="text-[#E7D2B6]/60 text-sm mt-2">Try selecting fewer guests or a different time</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTables.map((table) => (
                      <div
                        key={table.id}
                        onClick={() => table.available !== false && handleSelectTable(table)}
                        className={`relative rounded-2xl border p-6 transition-all cursor-pointer ${
                          selectedTable?.id === table.id
                            ? "border-[#C98A5A] bg-[#C98A5A]/10 ring-2 ring-[#C98A5A]"
                            : table.available === false
                            ? "border-red-900/40 bg-red-900/10 cursor-not-allowed opacity-60"
                            : "border-[#8B5A2B]/40 bg-[#1A110D] hover:border-[#C98A5A]/60 hover:bg-[#1A110D]/80"
                        }`}
                      >
                        {/* Status Badge */}
                        <div
                          className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                            table.available === false
                              ? "bg-red-900/30 text-red-400"
                              : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {table.available === false ? "Booked" : "Available"}
                        </div>

                        {/* Table Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C98A5A]/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#C98A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                        </div>

                        {/* Table Info */}
                        <div className="text-center">
                          <h4 className="text-lg font-semibold text-[#E7D2B6]">Table {table.table_number}</h4>
                          <p className="text-[#BFA58A] text-sm mt-1">
                            {table.chair_count} Chairs
                          </p>
                        </div>

                        {/* Select indicator */}
                        {selectedTable?.id === table.id && (
                          <div className="absolute inset-0 rounded-2xl border-2 border-[#C98A5A] pointer-events-none" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Message */}
              {!filterDate || !filterTime ? (
                <div className="text-center py-6 bg-[#C98A5A]/10 rounded-2xl border border-[#C98A5A]/30">
                  <p className="text-[#C98A5A]">
                    Please select a date and time to check table availability
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Step 2: Reservation Form */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl border border-[#8B5A2B]/40 bg-[#1A110D] p-8">
                {/* Selected Table Summary */}
                <div className="mb-8 p-4 rounded-2xl bg-[#C98A5A]/10 border border-[#C98A5A]/30">
                  <h4 className="text-sm font-medium text-[#C98A5A] mb-2">Selected Reservation</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#BFA58A]">Table</p>
                      <p className="text-[#E7D2B6] font-medium">Table {selectedTable?.table_number}</p>
                    </div>
                    <div>
                      <p className="text-[#BFA58A]">Date</p>
                      <p className="text-[#E7D2B6] font-medium">
                        {new Date(filterDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#BFA58A]">Time</p>
                      <p className="text-[#E7D2B6] font-medium">
                        {timeSlots.find((t) => t.value === filterTime)?.display}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#BFA58A]">Duration</p>
                      <p className="text-[#E7D2B6] font-medium">{filterDuration} Hour{filterDuration > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="mt-4 text-sm text-[#C98A5A] hover:underline"
                  >
                    ← Change selection
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-[#E7D2B6] mb-6">Your Details</h3>

                {submitError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">
                      Full Name <span className="text-[#C98A5A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/50 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">
                      Email <span className="text-[#C98A5A]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/50 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">
                      Phone <span className="text-[#C98A5A]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      placeholder="07xxxxxxxx"
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/50 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#BFA58A] mb-2">
                      Special Requests (optional)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleFormChange}
                      placeholder="Any special requests? (e.g., birthday celebration, dietary requirements)"
                      rows={4}
                      className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/50 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#C98A5A] to-[#D7B38A] text-[#0F0A08] font-bold text-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : isAuthenticated() ? "Request Reservation" : "Login & Reserve"}
                  </button>

                  <p className="text-xs text-center text-[#BFA58A]">
                    Your reservation will be confirmed via email after admin approval.
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && reservationSuccess && (
            <div className="max-w-lg mx-auto text-center">
              <div className="rounded-3xl border border-[#8B5A2B]/40 bg-[#1A110D] p-8">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-[#E7D2B6] mb-4">Reservation Requested!</h2>
                <p className="text-[#BFA58A] mb-8">
                  Your reservation request has been submitted. We will confirm your booking via email shortly.
                </p>

                {/* Reservation Details */}
                <div className="bg-[#0F0A08] rounded-2xl p-6 mb-8 text-left">
                  <h4 className="text-sm font-medium text-[#C98A5A] mb-4">Reservation Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#BFA58A]">Table</span>
                      <span className="text-[#E7D2B6]">Table {selectedTable?.table_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BFA58A]">Date</span>
                      <span className="text-[#E7D2B6]">
                        {new Date(filterDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BFA58A]">Time</span>
                      <span className="text-[#E7D2B6]">
                        {timeSlots.find((t) => t.value === filterTime)?.display} ({filterDuration}h)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BFA58A]">Party Size</span>
                      <span className="text-[#E7D2B6]">{filterGuests} Guest{filterGuests > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#BFA58A]">Status</span>
                      <span className="text-yellow-400 font-medium">Pending Confirmation</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 rounded-full bg-[#C98A5A] text-[#0F0A08] font-bold hover:brightness-110 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1A110D] rounded-3xl border border-[#8B5A2B]/50 p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#E7D2B6]">
                {authStep === "email" ? "Login" : authStep === "register" ? "Create Account" : "Verify OTP"}
              </h3>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthStep("email");
                  setAuthError("");
                }}
                className="text-[#BFA58A] hover:text-[#E7D2B6] text-2xl"
              >
                ×
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
                {authError}
              </div>
            )}

            {/* Step 1: Email Check */}
            {authStep === "email" && (
              <div className="space-y-4">
                <p className="text-[#BFA58A] text-sm mb-4">
                  Enter your email address to continue.
                </p>
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/60 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />
                <button
                  onClick={handleCheckEmail}
                  disabled={authLoading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C98A5A] to-[#D7B38A] text-[#0F0A08] font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Checking..." : "Continue"}
                </button>
              </div>
            )}

            {/* Step 2: Register (only for new customers) */}
            {authStep === "register" && (
              <div className="space-y-4">
                <p className="text-[#BFA58A] text-sm mb-4">
                  New customer? Enter your details to create an account.
                </p>
                <input
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/60 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  placeholder="Email Address"
                  disabled
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/40 px-4 py-3 text-[#E7D2B6]/60 focus:outline-none"
                />
                <input
                  name="phone"
                  value={authForm.phone}
                  onChange={handleAuthChange}
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/60 focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />
                <button
                  onClick={handleRegisterAndSendOTP}
                  disabled={authLoading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C98A5A] to-[#D7B38A] text-[#0F0A08] font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Creating Account..." : "Create Account & Verify"}
                </button>
                <button
                  onClick={() => setAuthStep("email")}
                  className="w-full py-2 text-[#BFA58A] hover:text-[#E7D2B6] text-sm"
                >
                  ← Use different email
                </button>
              </div>
            )}

            {/* Step 3: OTP Verification (only for new registrations) */}
            {authStep === "otp" && (
              <div className="space-y-4">
                <p className="text-[#BFA58A] text-sm mb-4">
                  We've sent a 6-digit OTP to <span className="text-[#E7D2B6]">{authForm.email}</span>
                </p>
                <input
                  name="otp"
                  value={authForm.otp}
                  onChange={handleAuthChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full rounded-xl border border-[#8B5A2B]/40 bg-black/25 px-4 py-3 text-[#E7D2B6] placeholder:text-[#BFA58A]/60 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#C98A5A]/60"
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={authLoading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#C98A5A] to-[#D7B38A] text-[#0F0A08] font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Verifying..." : "Verify & Continue"}
                </button>
                <button
                  onClick={() => setAuthStep("register")}
                  className="w-full py-2 text-[#BFA58A] hover:text-[#E7D2B6] text-sm"
                >
                  ← Back to details
                </button>
              </div>
            )}
          </div>
        </div>
      )}

	  <Footer />
    </CustomerLayout>
  );
};

export default ReservationPage;
