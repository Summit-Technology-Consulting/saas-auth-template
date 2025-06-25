"use client";

import { fetch } from "@/lib/utils";
import { User } from "@/types/user.types";
import React, { useState } from "react";
import styles from "./plan-card.module.css";

interface PlanCardProps {
  profile: User;
}

const PlanCard: React.FC<PlanCardProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch<{ url: string }>(
        "/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: {
            price_id: "price_1RczM0PYf612M0izKQJCFrqc",
          },
        }
      );

      if (res && res.url) {
        window.location.href = res.url;
      } else {
        setError("Failed to create checkout session");
      }
    } catch (err) {
      setError("Failed to upgrade plan");
      console.error("Error upgrading plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!profile.plan.subscription_id) {
      setError("No active subscription to cancel");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would need a backend endpoint to handle subscription cancellation
      // For now, we'll just show an error
      setError("Subscription cancellation not implemented yet");
    } catch (err) {
      setError("Failed to cancel subscription");
      console.error("Error canceling subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const isProPlan = profile.plan.name === "pro";
  const hasActiveSubscription = !!profile.plan.subscription_id;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Subscription Plan</h2>
        <div className={`${styles.badge} ${styles[profile.plan.name]}`}>
          {profile.plan.name.toUpperCase()}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.planInfo}>
          <div className={styles.planName}>
            {isProPlan ? "Pro Plan" : "Free Plan"}
          </div>
          <div className={styles.planDescription}>
            {isProPlan
              ? "Unlimited access to all features with priority support"
              : "Basic access with limited features"}
          </div>
        </div>

        {isProPlan && (
          <div className={styles.subscriptionInfo}>
            <div className={styles.field}>
              <label className={styles.label}>Subscription Status</label>
              <div className={styles.value}>
                <span className={styles.status}>Active</span>
              </div>
            </div>

            {profile.plan.expires_at && (
              <div className={styles.field}>
                <label className={styles.label}>Next Billing Date</label>
                <div className={styles.value}>
                  {new Date(profile.plan.expires_at * 1000).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          {!isProPlan ? (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className={styles.upgradeButton}
            >
              {loading ? "Processing..." : "Upgrade to Pro"}
            </button>
          ) : (
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className={styles.cancelButton}
            >
              {loading ? "Processing..." : "Cancel Subscription"}
            </button>
          )}
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Plan Features</h3>
          <ul className={styles.featuresList}>
            {isProPlan ? (
              <>
                <li className={styles.feature}>✅ Unlimited API calls</li>
                <li className={styles.feature}>✅ Priority support</li>
                <li className={styles.feature}>✅ Advanced analytics</li>
                <li className={styles.feature}>✅ Custom integrations</li>
                <li className={styles.feature}>✅ Team collaboration</li>
              </>
            ) : (
              <>
                <li className={styles.feature}>✅ 100 API calls per month</li>
                <li className={styles.feature}>✅ Basic support</li>
                <li className={styles.feature}>❌ Advanced analytics</li>
                <li className={styles.feature}>❌ Custom integrations</li>
                <li className={styles.feature}>❌ Team collaboration</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
