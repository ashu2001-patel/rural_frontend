import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { paymentAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// Loads the Razorpay checkout script (idempotent — safe to call multiple times)
// ─────────────────────────────────────────────────────────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─────────────────────────────────────────────────────────────────────────────
// usePaymentGate(featureKey, referenceId?)
//
// Returns:
//   loading          – true while fetching status from backend
//   canUse           – user can use the feature right now
//   remaining        – free uses left (0 means payment needed)
//   freeLimit        – total free uses allowed
//   requiresPayment  – true when remaining === 0 and no paid access
//   price            – price in paise (divide by 100 for ₹)
//   isPaid           – user already paid for this specific item
//   showModal        – controls PaymentGateModal visibility
//   openModal        – manually open the modal
//   closeModal       – close the modal
//   requestAccess    – call this when user triggers the gated action
//   onPaySuccess     – call this after payment succeeds
//   refresh          – re-fetch status from backend
// ─────────────────────────────────────────────────────────────────────────────
const usePaymentGate = (featureKey, referenceId = null) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status,    setStatus]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError,   setPayError]   = useState("");

  // ── Fetch gate status from backend ─────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = referenceId ? { referenceId } : {};
      const res = await paymentAPI.get(`/usage/check/${featureKey}`, { params });
      setStatus(res.data);
    } catch (err) {
      console.error("usePaymentGate check error:", err);
      // On error, allow access so UI doesn't break
      setStatus({ canUse: true, remaining: 1, requiresPayment: false });
    } finally {
      setLoading(false);
    }
  }, [user, featureKey, referenceId]);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Record one free usage ───────────────────────────────────────────────────
  const consumeFree = useCallback(async () => {
    try {
      await paymentAPI.post(`/usage/record/${featureKey}`);
      await refresh();
    } catch (err) {
      console.error("consumeFree error:", err);
    }
  }, [featureKey, refresh]);

  // ── Trigger the payment flow ────────────────────────────────────────────────
  const initiatePayment = useCallback(async (onSuccess) => {
    if (!user) { navigate("/login"); return; }
    setPayError("");
    setPayLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await paymentAPI.post("/payment/order", {
        featureKey,
        referenceId,
      });

      // Free feature — backend already granted
      if (orderRes.data.isFree) {
        setShowModal(false);
        await refresh();
        onSuccess?.();
        return;
      }

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        setPayError("Could not load payment gateway. Check your internet connection.");
        return;
      }

      // 3. Open Razorpay checkout
      const { orderId, transactionId, keyId, amount, displayName } = orderRes.data;

      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency:    "INR",
        order_id:    orderId,
        name:        "Rural Company",
        description: displayName || featureKey,
        image:       "/logo.png",
        prefill: {
          name:    user.name    || "",
          contact: user.phoneNumber || "",
          email:   user.email   || "",
        },
        theme: { color: "#d4af63" },

        handler: async (response) => {
          try {
            // 4. Verify on backend
            await paymentAPI.post("/payment/verify", {
              razorpayOrderId:  response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              transactionId,
            });
            setShowModal(false);
            await refresh();
            onSuccess?.();
          } catch {
            setPayError("Payment verification failed. Contact support.");
          }
        },

        modal: {
          ondismiss: () => setPayLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setPayError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPayLoading(false);
    }
  }, [user, featureKey, referenceId, navigate, refresh]);

  // ── requestAccess — main entry point for components ────────────────────────
  // Returns { granted: boolean }
  const requestAccess = useCallback(async (onSuccess) => {
    if (!user) { navigate("/login"); return { granted: false }; }

    // Already has access (paid earlier or has free uses)
    if (status?.canUse && !status?.requiresPayment) {
      if (status?.remaining > 0 && !status?.isPaid) {
        await consumeFree();
      }
      onSuccess?.();
      return { granted: true };
    }

    // Needs payment
    setShowModal(true);
    return { granted: false };
  }, [user, status, navigate, consumeFree]);

  return {
    // Status
    loading,
    canUse:          status?.canUse          ?? false,
    remaining:       status?.remaining       ?? 0,
    freeLimit:       status?.freeLimit       ?? 0,
    requiresPayment: status?.requiresPayment ?? false,
    price:           status?.price           ?? 0,
    isPaid:          status?.isPaid          ?? false,
    displayName:     status?.displayName     ?? featureKey,

    // Modal control
    showModal,
    openModal:   () => setShowModal(true),
    closeModal:  () => { setShowModal(false); setPayError(""); },

    // Payment
    payLoading,
    payError,
    initiatePayment,

    // Actions
    requestAccess,
    refresh,
    consumeFree,
  };
};

export default usePaymentGate;
