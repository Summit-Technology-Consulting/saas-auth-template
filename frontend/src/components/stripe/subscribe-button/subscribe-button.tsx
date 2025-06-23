"use client";

import { fetch } from "@/lib/utils";

export const SubscribeButton = () => {
  const handleSubscribe = async () => {
    const res = await fetch<{ url: string }>(
      "/stripe/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          user_id: "my-user-id",
          price_id: "price_1RczM0PYf612M0izKQJCFrqc",
        },
      }
    );

    if (res && res.url) {
      window.location.href = res.url;
    } else {
      console.error("Failed to create Stripe session");
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Subscribe
    </button>
  );
};
