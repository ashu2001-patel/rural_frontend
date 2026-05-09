import { useState, useEffect } from "react";
import { paymentAPI } from "../api/axios";

export const usePayment = () => {
  const [pricing, setPricing] = useState({
    reveal_contact: 0,
    post_animal: 0,
    highlight_post: 0,
    tier: "free"
  });
  const [userCount, setUserCount] = useState(0);
  const [animalCount, setAnimalCount] = useState(0);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      // Get counts from your APIs
      const res = await paymentAPI.get(`/pricing?userCount=${userCount}&animalCount=${animalCount}`);
      setPricing(res.data.pricing);
      setUserCount(res.data.userCount);
      setAnimalCount(res.data.animalCount);
    } catch (err) {
      console.error(err);
    }
  };

  const initiatePayment = async (type, referenceId, onSuccess) => {
    try {
      const res = await paymentAPI.post("/order", {
        type,
        referenceId,
        userCount,
        animalCount
      });

      // Free — directly call success
      if (res.data.isFree) {
        onSuccess && onSuccess(res.data.transaction);
        return;
      }

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: res.data.key,
          amount: res.data.amount * 100,
          currency: "INR",
          name: "Rural Company",
          description: type === "reveal_contact" ? "Reveal Seller Contact"
            : type === "post_animal" ? "Post Animal Listing"
            : "Highlight Animal Post",
          order_id: res.data.order.id,
          handler: async (response) => {
            try {
              await paymentAPI.post("/verify", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                transactionId: res.data.transaction._id
              });
              onSuccess && onSuccess();
            } catch (err) {
              alert("Payment verification failed");
            }
          },
          prefill: { name: "Rural User" },
          theme: { color: "#d4af63" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const checkAccess = async (type, referenceId) => {
    try {
      const res = await paymentAPI.get(`/access?type=${type}&referenceId=${referenceId}`);
      return res.data.hasAccess;
    } catch {
      return false;
    }
  };

  return { pricing, initiatePayment, checkAccess };
};