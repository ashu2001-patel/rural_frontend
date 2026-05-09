// Legacy payment hook — kept for any remaining callers.
// New code should use usePaymentGate instead.
import { useState, useEffect } from "react";
import { paymentAPI } from "../api/axios";

export const usePayment = () => {
  const [pricing, setPricing] = useState({
    reveal_contact: 0, post_animal: 0, highlight_post: 0, tier: "free",
  });

  useEffect(() => { fetchPricing(); }, []);

  const fetchPricing = async () => {
    try {
      const res = await paymentAPI.get("/payment/pricing");
      setPricing(res.data.pricing || {});
    } catch (err) {
      console.error("fetchPricing error:", err);
    }
  };

  const initiatePayment = async (featureKey, referenceId, onSuccess) => {
    try {
      const res = await paymentAPI.post("/payment/order", { featureKey, referenceId });

      if (res.data.isFree) {
        onSuccess?.(res.data.transaction);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        const rzp = new window.Razorpay({
          key:       res.data.keyId,
          amount:    res.data.amount,
          currency:  "INR",
          order_id:  res.data.orderId,
          name:      "Rural Company",
          theme:     { color: "#d4af63" },
          handler: async (response) => {
            try {
              await paymentAPI.post("/payment/verify", {
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                transactionId:     res.data.transactionId,
              });
              onSuccess?.();
            } catch {
              alert("Payment verification failed");
            }
          },
        });
        rzp.open();
      };
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const checkAccess = async (featureKey, referenceId) => {
    try {
      const res = await paymentAPI.get(
        `/payment/access?featureKey=${featureKey}&referenceId=${referenceId}`
      );
      return res.data.hasAccess;
    } catch {
      return false;
    }
  };

  return { pricing, initiatePayment, checkAccess };
};
